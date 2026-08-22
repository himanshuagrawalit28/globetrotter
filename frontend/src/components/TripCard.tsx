import { CalendarDays, MapPin } from "lucide-react";
import type { TripListItem } from "@/api/types";

function formatRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const s = new Date(`${start}T00:00:00`).toLocaleDateString("en-GB", opts);
  const e = new Date(`${end}T00:00:00`).toLocaleDateString("en-GB", {
    ...opts,
    year: "numeric",
  });
  return `${s} – ${e}`;
}

export function TripCard({ trip }: { trip: TripListItem }) {
  return (
    <article className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lift">
      <h3 className="font-display text-lg font-bold">{trip.name}</h3>
      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4 text-primary" />
        {formatRange(trip.start_date, trip.end_date)}
      </p>
      <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="size-4 text-accent" />
        {trip.stop_count} {trip.stop_count === 1 ? "stop" : "stops"}
      </p>
      <div className="mt-4 flex gap-2">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          Trip #{trip.id}
        </span>
      </div>
    </article>
  );
}
