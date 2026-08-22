import type { ComponentProps } from "react";

interface AuthFieldProps extends ComponentProps<"input"> {
  label: string;
}

export function AuthField({ label, id, ...props }: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-ocean-foreground/75"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="h-11 w-full rounded-xl border border-ocean-foreground/25 bg-ocean-foreground/10 px-4 text-sm text-ocean-foreground outline-none transition placeholder:text-ocean-foreground/45 focus:border-primary focus:bg-ocean-foreground/15 focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
