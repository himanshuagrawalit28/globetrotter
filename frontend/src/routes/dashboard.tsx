import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowRight, Wallet } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DestinationBanner } from "@/components/DestinationBanner";
import { DriveToCreateButton } from "@/components/DriveToCreateButton";
import { TripCard } from "@/components/TripCard";
import { PackageCard } from "@/components/PackageCard";
import { useAuth } from "@/context/AuthContext";
import { USE_FAKE_DATA } from "@/config";
import { fakeTrips } from "@/data/fakeTrips";
import { fakePackages } from "@/data/fakePackages";
import { fakeBudget } from "@/data/fakeBudget";
import { getMyTrips } from "@/api/tripsApi";
import type { TripListItem } from "@/api/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — GlobeTrotter" },
      {
        name: "description",
        content:
          "Your GlobeTrotter home: upcoming trips, recommended multi-day packages and budget highlights.",
      },
      { property: "og:title", content: "Dashboard — GlobeTrotter" },
      {
        property: "og:description",
        content: "Upcoming trips, recommended packages and budget highlights.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripListItem[]>([]);

  useEffect(() => {
    if (USE_FAKE_DATA) {
      setTrips(fakeTrips);
      return;
    }
    // Backend ready → GET /trips
    getMyTrips()
      .then((res) => setTrips(res.data))
      .catch((err: Error) => toast.error(err.message));
  }, []);

  const upcoming = trips[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl space-y-14 px-5 py-8">
        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Namaste{user ? `, ${user.name}` : ""}
            </p>
            <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
              Where are we going{" "}
              <span className="text-gradient-sunset">next?</span>
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Build a multi-city itinerary, assign dates and activities to every
              stop, and watch the budget add up as you go.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <DriveToCreateButton
              onDone={() =>
                toast.success("Create Trip screen plugs in here next")
              }
            />
            <button
              onClick={() => toast("My Trips screen coming up next")}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
            >
              View all trips
              <ArrowRight className="size-4" />
            </button>
          </div>
        </section>

        <DestinationBanner />

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Trips planned
            </p>
            <p className="mt-2 font-display text-3xl font-extrabold">
              {trips.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Next trip budget
            </p>
            <p className="mt-2 flex items-center gap-2 font-display text-3xl font-extrabold">
              <Wallet className="size-6 text-primary" />₹
              {fakeBudget.total_cost.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Avg cost / day
            </p>
            <p className="mt-2 font-display text-3xl font-extrabold">
              ₹{fakeBudget.avg_cost_per_day.toLocaleString("en-IN")}
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Recommended packages</h2>
              <p className="text-sm text-muted-foreground">
                Multi-day plans you can copy and make your own.
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fakePackages.map((pack) => (
              <PackageCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>

        <section className="space-y-5 pb-10">
          <div>
            <h2 className="text-2xl font-bold">Your previous packages</h2>
            <p className="text-sm text-muted-foreground">
              {upcoming
                ? `Up next: ${upcoming.name}`
                : "Nothing planned yet — start with a new trip."}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
