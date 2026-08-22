import { Link, useNavigate } from "@tanstack/react-router";
import { Compass, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="gradient-sunset flex size-9 items-center justify-center rounded-xl">
            <Compass className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold">GlobeTrotter</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/trips"
            className="hidden text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:block"
            activeProps={{ className: "text-foreground" }}
          >
            My Trips
          </Link>
          <Link
            to="/activities"
            className="hidden text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:block"
            activeProps={{ className: "text-foreground" }}
          >
            Activities
          </Link>
          <span className="hidden text-sm text-muted-foreground sm:block">
            {user ? `Hi, ${user.name}` : "Guest explorer"}
          </span>
          <button
            onClick={() => {
              signOut();
              void navigate({ to: "/" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:bg-secondary"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </nav>
    </header>
  );
}
