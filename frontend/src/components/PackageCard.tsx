import { Clock3 } from "lucide-react";
import type { RecommendedPackage } from "@/data/fakePackages";

export function PackageCard({ pack }: { pack: RecommendedPackage }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-40 overflow-hidden">
        <img
          src={pack.image}
          alt={`${pack.city}, ${pack.country}`}
          loading="lazy"
          width={1600}
          height={900}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold">
          {pack.city}, {pack.country}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-bold">{pack.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock3 className="size-4 text-primary" />
          {pack.days} days
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pack.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          from{" "}
          <span className="font-display text-lg font-bold text-foreground">
            ₹{pack.price_from.toLocaleString("en-IN")}
          </span>
        </p>
      </div>
    </article>
  );
}
