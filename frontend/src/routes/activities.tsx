import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Clock, Plus, Search, Check, IndianRupee } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { USE_FAKE_DATA } from "@/config";
import { fakeActivities } from "@/data/fakeActivities";
import { fakeCities } from "@/data/fakeCities";
import { searchActivities } from "@/api/activitiesApi";
import type { Activity } from "@/api/types";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "My Activities — GlobeTrotter" },
      {
        name: "description",
        content:
          "Browse sightseeing, food and adventure activities by city, cost and duration, then add them to your trip stops.",
      },
      { property: "og:title", content: "My Activities — GlobeTrotter" },
      {
        property: "og:description",
        content: "Filter activities by type, cost and duration for each stop.",
      },
    ],
  }),
  component: ActivitiesPage,
});

const TYPES = ["all", "sightseeing", "adventure", "food", "culture"] as const;

function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const [cityId, setCityId] = useState<number | "all">("all");
  const [maxCost, setMaxCost] = useState(5000);
  const [added, setAdded] = useState<number[]>([]);

  useEffect(() => {
    if (USE_FAKE_DATA) {
      setActivities(fakeActivities);
      return;
    }
    searchActivities({
      ...(cityId === "all" ? {} : { city_id: cityId }),
      ...(type === "all" ? {} : { type }),
    })
      .then((res) => setActivities(res.data))
      .catch((err: Error) => toast.error(err.message));
  }, [cityId, type]);

  const visible = useMemo(
    () =>
      activities.filter(
        (a) =>
          (type === "all" || a.type === type) &&
          a.cost <= maxCost &&
          (a.name.toLowerCase().includes(query.toLowerCase()) ||
            a.description.toLowerCase().includes(query.toLowerCase())),
      ),
    [activities, type, maxCost, query],
  );

  function toggle(activity: Activity) {
    setAdded((prev) =>
      prev.includes(activity.id)
        ? prev.filter((id) => id !== activity.id)
        : [...prev, activity.id],
    );
    toast.success(
      added.includes(activity.id)
        ? `${activity.name} removed`
        : `${activity.name} added to your list`,
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          Activity search
        </p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
          My <span className="text-gradient-sunset">Activities</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Things to do at every stop — filter by interest, cost and duration,
          then add them to your itinerary.
        </p>

        <section className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 sm:col-span-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activities"
              className="w-full bg-transparent text-sm outline-none"
              aria-label="Search activities"
            />
          </label>

          <select
            value={cityId}
            onChange={(e) =>
              setCityId(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
            aria-label="Filter by city"
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none"
          >
            <option value="all">All cities</option>
            {fakeCities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}, {c.country}
              </option>
            ))}
          </select>

          <div className="space-y-1">
            <label htmlFor="max-cost" className="text-xs text-muted-foreground">
              Max cost: ₹{maxCost.toLocaleString("en-IN")}
            </label>
            <input
              id="max-cost"
              type="range"
              min={0}
              max={5000}
              step={250}
              value={maxCost}
              onChange={(e) => setMaxCost(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  type === t
                    ? "gradient-sunset border-transparent text-primary-foreground"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => {
            const isAdded = added.includes(a.id);
            return (
              <article
                key={a.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition hover:shadow-lift"
              >
                <div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                    {a.type}
                  </span>
                  <h2 className="mt-3 text-xl font-bold">{a.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {a.description}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <span className="flex items-center">
                      <IndianRupee className="size-4 text-primary" />
                      {a.cost === 0 ? "Free" : a.cost.toLocaleString("en-IN")}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-4" />
                      {a.duration_hours}h
                    </span>
                  </div>
                  <button
                    onClick={() => toggle(a)}
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                      isAdded
                        ? "border border-border hover:bg-secondary"
                        : "gradient-sunset text-primary-foreground"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="size-4" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="size-4" /> Add
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}

          {visible.length === 0 ? (
            <p className="text-muted-foreground">
              No activities match these filters yet.
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
