import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { bannerSlides } from "@/data/fakePackages";

export function DestinationBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % bannerSlides.length),
      5000,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative h-[380px] overflow-hidden rounded-3xl shadow-lift sm:h-[440px]">
      {bannerSlides.map((slide, i) => (
        <img
          key={slide.city}
          src={slide.image}
          alt={`${slide.city}, ${slide.country}`}
          width={1600}
          height={900}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-dusk)" }}
      />
      <div className="absolute inset-0 bg-foreground/20" />

      <div className="relative flex h-full flex-col justify-end gap-3 p-7 sm:p-10">
        <span className="flex w-fit items-center gap-2 rounded-full bg-ocean-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ocean-foreground backdrop-blur">
          <Sparkles className="size-3.5" />
          Featured destination
        </span>
        <h2 className="text-4xl font-extrabold text-ocean-foreground sm:text-5xl">
          {bannerSlides[index]!.city}
          <span className="ml-3 text-lg font-semibold text-ocean-foreground/70">
            {bannerSlides[index]!.country}
          </span>
        </h2>
        <p className="max-w-xl text-sm text-ocean-foreground/85 sm:text-base">
          {bannerSlides[index]!.speciality}
        </p>

        <div className="mt-2 flex gap-2">
          {bannerSlides.map((s, i) => (
            <button
              key={s.city}
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.city}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-primary"
                  : "w-4 bg-ocean-foreground/45 hover:bg-ocean-foreground/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
