import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Coins, Flame, Globe2, MapPin, Plus, Search, Wallet } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TripPicker } from "@/components/TripPicker";
import { loadTrips } from "@/lib/tripStore";
import {
  inr,
  loadStops,
  newStopId,
  saveStops,
  tripBudget,
  type StoredStop,
} from "@/lib/itineraryStore";
import { cityRegions, fakeCities } from "@/data/fakeCities";
import type { TripListItem } from "@/api/types";

export const Route = createFileRoute("/cities")({
  head: () => ({
    meta: [
      { title: "City Search & Budget — GlobeTrotter" },
      {
        name: "description",
        content:
          "Search cities by name or region, compare cost index and popularity, add them to your trip and watch the budget update live.",
      },
      { property: "og:title", content: "City Search & Budget — GlobeTrotter" },
      {
        property: "og:description",
        content:
          "Find cities by region, compare cost and popularity, and add them straight to your trip.",
      },
    ],
  }),
  component: CitiesPage,
});

type Sort = "popularity" | "cost-low" | "cost-high" | "name";

function CitiesPage() {
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [tripId, setTripId] = useState<number | null>(null);
  const [stops, setStops] = useState<StoredStop[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("popularity");

  useEffect(() => {
    const list = loadTrips();
    setTrips(list);
    if (list.length) setTripId(list[0]!.id);
  }, []);

  useEffect(() => {
    if (tripId != null) setStops(loadStops(tripId));
  }, [tripId]);

  const trip = trips.find((t) => t.id === tripId) ?? null;
  const budget = useMemo(() => tripBudget(stops), [stops]);

  const results = useMemo(() => {
    const list = fakeCities.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q);
      const matchesRegion = region === "All" || c.region === region;
      return matchesQuery && matchesRegion;
    });
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "cost-low") return a.cost_index - b.cost_index;
      if (sort === "cost-high") return b.cost_index - a.cost_index;
      return b.popularity - a.popularity;
    });
  }, [query, region, sort]);

  function addToTrip(cityId: number) {
    if (tripId == null || !trip) {
      toast.error("Create a trip first");
      return;
    }
    const city = fakeCities.find((c) => c.id === cityId)!;
    const next: StoredStop[] = [
      ...stops,
      {
        id: newStopId(),
        city,
        start_date: trip.start_date,
        end_date: trip.start_date,
        activity_ids: [],
      },
    ];
    setStops(next);
    saveStops(tripId, next);
    toast.success(`${city.name} added to ${trip.name}`);
  }

  const added = new Set(stops.map((s) => s.city.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          Explore
        </p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
          City search & <span className="text-gradient-sunset">budget</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Find your next stop by region, compare how expensive and how popular
          each city is, then drop it straight into the trip.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search cities or countries"
                  aria-label="Search cities"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                aria-label="Sort cities"
                className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none"
              >
                <option value="popularity">Most popular</option>
                <option value="cost-low">Cheapest first</option>
                <option value="cost-high">Priciest first</option>
                <option value="name">A – Z</option>
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {cityRegions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    region === r
                      ? "gradient-sunset border-transparent text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <Globe2 className="size-3.5" />
                  {r}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {results.map((city) => (
                <article
                  key={city.id}
                  className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-xl font-bold">
                          {city.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {city.country}
                        </p>
                      </div>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                        {city.region}
                      </span>
                    </div>

                    <dl className="mt-4 space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between">
                          <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Coins className="size-3.5 text-primary" />
                            Cost index
                          </dt>
                          <dd className="font-semibold">{city.cost_index}/10</dd>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="gradient-sunset h-full"
                            style={{ width: `${city.cost_index * 10}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Flame className="size-3.5 text-primary" />
                            Popularity
                          </dt>
                          <dd className="font-semibold">{city.popularity}/10</dd>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="gradient-sunset h-full"
                            style={{ width: `${city.popularity * 10}%` }}
                          />
                        </div>
                      </div>
                    </dl>
                  </div>

                  <button
                    onClick={() => addToTrip(city.id)}
                    className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition active:scale-[0.98] ${
                      added.has(city.id)
                        ? "border border-border text-muted-foreground hover:bg-secondary"
                        : "gradient-sunset text-primary-foreground shadow-lift"
                    }`}
                  >
                    <Plus className="size-4" />
                    {added.has(city.id) ? "Add again" : "Add to trip"}
                  </button>
                </article>
              ))}
            </div>

            {results.length === 0 ? (
              <p className="mt-10 text-center text-sm text-muted-foreground">
                No cities match “{query}” in {region}.
              </p>
            ) : null}
          </section>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <TripPicker trips={trips} value={tripId} onChange={setTripId} />

            <section className="rounded-2xl border border-border bg-card p-5 shadow-lift">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Wallet className="size-4 text-primary" />
                Budget estimate
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gradient-sunset">
                {inr(budget.total)}
              </p>
              <p className="text-xs text-muted-foreground">
                {stops.length} stops · {budget.days} days ·{" "}
                {inr(budget.avgPerDay)} per day
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                {(
                  [
                    ["Activities", budget.activities],
                    ["Stay", budget.stay],
                    ["Transport", budget.transport],
                    ["Meals", budget.meals],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-semibold">{inr(value)}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <MapPin className="size-4 text-primary" />
                On the route
              </h2>
              {stops.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No cities added yet.
                </p>
              ) : (
                <ol className="mt-3 space-y-2 text-sm">
                  {stops.map((s, i) => (
                    <li key={s.id} className="flex justify-between">
                      <span>
                        {i + 1}. {s.city.name}
                      </span>
                      <span className="text-muted-foreground">
                        {s.city.country}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              <Link
                to="/itinerary-builder"
                className="mt-4 block rounded-full border border-border px-5 py-2.5 text-center text-sm font-semibold transition hover:bg-secondary"
              >
                Set dates in builder
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
