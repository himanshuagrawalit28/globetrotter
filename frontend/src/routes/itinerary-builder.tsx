import { useEffect, useMemo, useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  CalendarDays,
  Check,
  MapPin,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TripPicker } from "@/components/TripPicker";
import { getMyTrips } from "@/api/tripsApi";
import { searchCities } from "@/api/citiesApi";
import { searchActivities, addActivityToStop, removeActivityFromStop } from "@/api/activitiesApi";
import { addStop, removeStop, getStops } from "@/api/stopsApi";
import type { TripListItem, City, Activity } from "@/api/types";

export const Route = createFileRoute("/itinerary-builder")({
  head: () => ({
    meta: [
      { title: "Itinerary Builder — GlobeTrotter" },
      {
        name: "description",
        content:
          "Build your day-wise plan: add stops, pick cities and dates, assign activities and reorder the route.",
      },
    ],
  }),
  component: BuilderPage,
});

interface StopVM {
  id: number;
  city: City;
  start_date: string;
  end_date: string;
  activity_ids: number[];
}

const inr = (n: number) => `\u20b9${n.toLocaleString("en-IN")}`;

function BuilderPage() {
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [tripId, setTripId] = useState<number | null>(null);
  const [stops, setStops] = useState<StopVM[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [activitiesByCity, setActivitiesByCity] = useState<Record<number, Activity[]>>({});
  const [activityCache, setActivityCache] = useState<Record<number, Activity>>({});
  const [loading, setLoading] = useState(false);

  const [cityId, setCityId] = useState<number | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [tripsRes, citiesRes] = await Promise.all([
          getMyTrips(),
          searchCities(""),
        ]);
        setTrips(tripsRes.data);
        setCities(citiesRes.data);
        if (tripsRes.data.length) setTripId(tripsRes.data[0]!.id);
        if (citiesRes.data.length) setCityId(citiesRes.data[0]!.id);
      } catch (err) {
        toast.error("Could not load trips or cities");
      }
    })();
  }, []);

  const fetchActivitiesForCity = useCallback(
    async (id: number) => {
      if (activitiesByCity[id]) return activitiesByCity[id];
      const res = await searchActivities({ city_id: id });
      setActivitiesByCity((prev) => ({ ...prev, [id]: res.data }));
      setActivityCache((prev) => {
        const next = { ...prev };
        res.data.forEach((a) => (next[a.id] = a));
        return next;
      });
      return res.data;
    },
    [activitiesByCity],
  );

  useEffect(() => {
    if (tripId == null) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getStops(tripId);
        const withCity: StopVM[] = res.data.map((s) => {
          const city = cities.find((c) => c.id === s.city_id) ?? {
            id: s.city_id,
            name: "Unknown",
            country: "",
            cost_index: 0,
            popularity: 0,
          };
          return {
            id: s.id,
            city,
            start_date: s.start_date,
            end_date: s.end_date,
            activity_ids: s.activity_ids,
          };
        });
        setStops(withCity);
        withCity.forEach((s) => fetchActivitiesForCity(s.city.id));
      } catch (err) {
        toast.error("Could not load stops for this trip");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId, cities]);

  const trip = trips.find((t) => t.id === tripId) ?? null;

  useEffect(() => {
    if (trip) {
      setStart(trip.start_date);
      setEnd(trip.start_date);
    }
  }, [trip]);

  useEffect(() => {
    if (cityId != null) fetchActivitiesForCity(cityId);
  }, [cityId, fetchActivitiesForCity]);

  const budget = useMemo(() => {
    let activitiesTotal = 0;
    stops.forEach((s) => {
      s.activity_ids.forEach((id) => {
        const a = activityCache[id];
        if (a) activitiesTotal += a.cost;
      });
    });
    const days =
      trip && trip.start_date && trip.end_date
        ? Math.max(
            1,
            Math.round(
              (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
                86400000,
            ) + 1,
          )
        : 1;
    const stay = 1500 * days;
    const transport = 500 * days;
    const meals = 600 * days;
    const total = activitiesTotal + stay + transport + meals;
    return {
      total,
      days,
      avgPerDay: Math.round(total / days),
      activities: activitiesTotal,
      stay,
      transport,
      meals,
    };
  }, [stops, activityCache, trip]);

  async function handleAddStop() {
    if (tripId == null || cityId == null) return;
    if (!start || !end) {
      toast.error("Pick the arrival and departure dates");
      return;
    }
    if (end < start) {
      toast.error("Departure must be on or after arrival");
      return;
    }
    try {
      const res = await addStop(tripId, { city_id: cityId, start_date: start, end_date: end });
      const city = cities.find((c) => c.id === cityId)!;
      setStops((prev) => [
        ...prev,
        { id: res.data.id, city, start_date: start, end_date: end, activity_ids: [] },
      ]);
      toast.success(`${city.name} added to the route`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add stop");
    }
  }

  async function handleRemoveStop(stopId: number) {
    if (tripId == null) return;
    try {
      await removeStop(tripId, stopId);
      setStops((prev) => prev.filter((s) => s.id !== stopId));
      toast.success("Stop removed");
    } catch (err) {
      toast.error("Could not remove stop");
    }
  }

  async function toggleActivity(stopId: number, activityId: number) {
    if (tripId == null) return;
    const stop = stops.find((s) => s.id === stopId);
    if (!stop) return;
    const isOn = stop.activity_ids.includes(activityId);
    try {
      if (isOn) {
        await removeActivityFromStop(tripId, stopId, activityId);
      } else {
        await addActivityToStop(tripId, stopId, activityId);
      }
      setStops((prev) =>
        prev.map((s) =>
          s.id === stopId
            ? {
                ...s,
                activity_ids: isOn
                  ? s.activity_ids.filter((a) => a !== activityId)
                  : [...s.activity_ids, activityId],
              }
            : s,
        ),
      );
    } catch (err) {
      toast.error("Could not update activity");
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          Step 2 of 3
        </p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
          Itinerary <span className="text-gradient-sunset">Builder</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Add a stop for every city, set the dates you'll be there, tick the
          activities you want.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <TripPicker trips={trips} value={tripId} onChange={setTripId} />

            {trip ? (
              <section className="rounded-2xl border border-border bg-card p-5 shadow-lift">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                  <Plus className="size-4 text-primary" />
                  Add stop
                </h2>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="stop-city" className="text-xs font-semibold">
                      City
                    </label>
                    <select
                      id="stop-city"
                      value={cityId ?? ""}
                      onChange={(e) => setCityId(Number(e.target.value))}
                      className={fieldClass}
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}, {c.country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="stop-start" className="text-xs font-semibold">
                        Arrive
                      </label>
                      <input
                        id="stop-start"
                        type="date"
                        value={start}
                        min={trip.start_date}
                        max={trip.end_date}
                        onChange={(e) => setStart(e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="stop-end" className="text-xs font-semibold">
                        Depart
                      </label>
                      <input
                        id="stop-end"
                        type="date"
                        value={end}
                        min={start || trip.start_date}
                        max={trip.end_date}
                        onChange={(e) => setEnd(e.target.value)}
                        className={fieldClass}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddStop}
                    className="gradient-sunset inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-lift transition active:scale-[0.98]"
                  >
                    <Plus className="size-4" />
                    Add stop
                  </button>
                </div>
              </section>
            ) : null}

            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Wallet className="size-4 text-primary" />
                Running budget
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gradient-sunset">
                {inr(budget.total)}
              </p>
              <p className="text-xs text-muted-foreground">
                {budget.days} days · {inr(budget.avgPerDay)} / day
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
          </aside>

          <section className="space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
                <p className="text-sm text-muted-foreground">Loading stops…</p>
              </div>
            ) : null}

            {!loading && stops.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
                <MapPin className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-display text-lg font-bold">
                  No stops yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your first city on the left to start the route.
                </p>
              </div>
            ) : null}

            {stops.map((stop, index) => {
              const cityActivities = activitiesByCity[stop.city.id] ?? [];
              return (
                <article
                  key={stop.id}
                  className="rounded-3xl border border-border bg-card p-5 shadow-lift transition hover:border-primary/40"
                >
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="gradient-sunset flex size-10 items-center justify-center rounded-2xl font-display text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-bold">
                          {stop.city.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {stop.city.country}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStop(stop.id)}
                      aria-label={`Remove ${stop.city.name}`}
                      className="rounded-full border border-border p-2 text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </header>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">
                        <CalendarDays className="mr-1 inline size-3.5 text-primary" />
                        Arrive
                      </label>
                      <p className="text-sm">{stop.start_date}</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">
                        <CalendarDays className="mr-1 inline size-3.5 text-primary" />
                        Depart
                      </label>
                      <p className="text-sm">{stop.end_date}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Activities
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cityActivities.map((a) => {
                        const on = stop.activity_ids.includes(a.id);
                        return (
                          <button
                            key={a.id}
                            onClick={() => toggleActivity(stop.id, a.id)}
                            aria-pressed={on}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                              on
                                ? "gradient-sunset border-transparent text-primary-foreground"
                                : "border-border hover:bg-secondary"
                            }`}
                          >
                            {on ? <Check className="size-3.5" /> : null}
                            {a.name}
                            <span className="opacity-70">
                              {a.cost ? inr(a.cost) : "Free"}
                            </span>
                          </button>
                        );
                      })}
                      {cityActivities.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          No activities found for this city.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}

            {stops.length ? (
              <Link
                to="/itinerary"
                className="gradient-sunset inline-flex rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-lift"
              >
                View itinerary
              </Link>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}
