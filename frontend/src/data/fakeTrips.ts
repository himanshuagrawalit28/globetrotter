import type { TripListItem } from "@/api/types";

// Matches GET /trips response shape exactly.
export const fakeTrips: TripListItem[] = [
  {
    id: 1,
    name: "Goa Beach Escape",
    start_date: "2026-09-01",
    end_date: "2026-09-05",
    stop_count: 2,
  },
  {
    id: 2,
    name: "Kyoto Autumn Trail",
    start_date: "2026-10-12",
    end_date: "2026-10-19",
    stop_count: 3,
  },
  {
    id: 3,
    name: "Europe Sampler",
    start_date: "2026-12-20",
    end_date: "2027-01-02",
    stop_count: 4,
  },
];
