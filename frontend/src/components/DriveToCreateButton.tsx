import { useState } from "react";
import { Car, Plus } from "lucide-react";

export function DriveToCreateButton({ onDone }: { onDone: () => void }) {
  const [driving, setDriving] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setDriving(true)}
      onMouseLeave={() => setDriving(false)}
      onClick={() => {
        setDriving(true);
        window.setTimeout(onDone, 650);
      }}
      className="drive-track gradient-sunset relative flex h-14 w-full max-w-xs items-center rounded-full px-2 shadow-lift transition active:scale-[0.98]"
      aria-label="Create a new trip"
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold uppercase tracking-[0.18em] text-primary-foreground">
        Plan a new trip
      </span>
      <span
        className="drive-car relative z-10 flex size-10 items-center justify-center rounded-full bg-background shadow-lift"
        style={{
          transform: driving
            ? "translateX(calc(20rem - 3.5rem))"
            : "translateX(0)",
        }}
      >
        {driving ? (
          <Car className="size-5 text-primary" />
        ) : (
          <Plus className="size-5 text-primary" />
        )}
      </span>
    </button>
  );
}
