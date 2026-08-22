import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import authBg from "@/assets/auth-bg.jpg";
import { Compass } from "lucide-react";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <img
        src={authBg}
        alt="Aerial view of a coastal road winding above a turquoise bay at sunset"
        width={1280}
        height={1600}
        className="kenburns absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-dusk)" }}
      />
      <div className="absolute inset-0 bg-foreground/25" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <Link
          to="/"
          className="flex w-fit items-center gap-2 text-ocean-foreground"
        >
          <span className="gradient-sunset flex size-9 items-center justify-center rounded-xl shadow-lift">
            <Compass className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            GlobeTrotter
          </span>
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center gap-12 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="hidden max-w-md text-ocean-foreground lg:block animate-float-up">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[1.05]">
              Somewhere out there, a road is waiting for you.
            </h1>
            <p className="mt-5 text-base text-ocean-foreground/80">
              Multi-city itineraries, day-wise plans and honest budgets — all in
              one place. Pack light, plan deep.
            </p>
          </div>

          <div className="surface-glass w-full max-w-md rounded-3xl p-8 shadow-glow animate-float-up">
            <h2 className="text-2xl font-bold text-ocean-foreground">{title}</h2>
            <p className="mt-1 text-sm text-ocean-foreground/75">{subtitle}</p>
            <div className="mt-6">{children}</div>
            <div className="mt-6 text-center text-sm text-ocean-foreground/80">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
