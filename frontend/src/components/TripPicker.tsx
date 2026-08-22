import type { TripListItem } from "@/api/types";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function TripPicker({
  trips,
  value,
  onChange,
}: {
  trips: TripListItem[];
  value: number | null;
  onChange: (id: number) => void;
}) {
  if (trips.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          You don't have any trips yet.
        </p>
        <Link
          to="/create-trip"
          className="gradient-sunset mt-4 inline-flex rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-lift"
        >
          Create a trip
        </Link>
      </div>
    );
  }

  const active = trips.find((t) => t.id === value);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-lift/50">
      <label
        htmlFor="trip-picker"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
      >
        Trip
      </label>
      <select
        id="trip-picker"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
      >
        {trips.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      {active ? (
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-primary" />
            {active.start_date} → {active.end_date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary" />
            {active.stop_count} stops
          </span>
        </div>
      ) : null}
    </div>
  );
}
