import type { Activity } from "@/api/types";

// Matches GET /activities response shape exactly.
export const fakeActivities: Activity[] = [
  {
    id: 100,
    name: "Beach Walk",
    type: "sightseeing",
    cost: 0,
    duration_hours: 2,
    description: "Sunset stroll along Miramar beach.",
  },
  {
    id: 101,
    name: "Scuba Diving",
    type: "adventure",
    cost: 2500,
    duration_hours: 3,
    description: "Guided reef dive with equipment included.",
  },
];
