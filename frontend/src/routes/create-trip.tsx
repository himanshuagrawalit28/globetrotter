import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CalendarDays, ImagePlus, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { USE_FAKE_DATA } from "@/config";
import { createTrip } from "@/api/tripsApi";
import { addTrip } from "@/lib/tripStore";

export const Route = createFileRoute("/create-trip")({
  head: () => ({
    meta: [
      { title: "Create a trip — GlobeTrotter" },
      {
        name: "description",
        content:
          "Start a new GlobeTrotter trip: name it, pick travel dates, describe the plan and add a cover photo.",
      },
      { property: "og:title", content: "Create a trip — GlobeTrotter" },
      {
        property: "og:description",
        content: "Name your trip, set dates and start building the itinerary.",
      },
    ],
  }),
  component: CreateTripPage,
});

function CreateTripPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 3) {
      toast.error("Give your trip a name");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Pick start and end dates");
      return;
    }
    if (endDate < startDate) {
      toast.error("End date must come after the start date");
      return;
    }

    setLoading(true);
    try {
      if (USE_FAKE_DATA) {
        addTrip({
          name: name.trim(),
          start_date: startDate,
          end_date: endDate,
          stop_count: 0,
        });
      } else {
        await createTrip({
          name: name.trim(),
          start_date: startDate,
          end_date: endDate,
          description: description.trim(),
          cover_photo_url: coverUrl.trim() || null,
        });
      }
      toast.success(`"${name.trim()}" saved — add stops next`);
      void navigate({ to: "/trips" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          Step 1 of 3
        </p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
          Create a <span className="text-gradient-sunset">new trip</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Name the journey and lock the dates. You can add cities, activities
          and budgets right after.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8"
        >
          <div className="space-y-2">
            <label htmlFor="trip-name" className="text-sm font-semibold">
              Trip name
            </label>
            <input
              id="trip-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Goa monsoon escape"
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="start-date" className="text-sm font-semibold">
                <CalendarDays className="mr-1 inline size-4 text-primary" />
                Start date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end-date" className="text-sm font-semibold">
                <CalendarDays className="mr-1 inline size-4 text-primary" />
                End date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="trip-desc" className="text-sm font-semibold">
              Description
            </label>
            <textarea
              id="trip-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beaches, seafood shacks and one scuba day."
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cover-url" className="text-sm font-semibold">
              <ImagePlus className="mr-1 inline size-4 text-primary" />
              Cover photo URL{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <input
              id="cover-url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://…"
              className={fieldClass}
            />
            {coverUrl.trim() ? (
              <img
                src={coverUrl}
                alt="Trip cover preview"
                className="mt-3 h-40 w-full rounded-2xl object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="gradient-sunset inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-lift transition active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Save trip
            </button>
            <button
              type="button"
              onClick={() => void navigate({ to: "/dashboard" })}
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
