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
  {
    id: 102,
    name: "Old Town Food Crawl",
    type: "food",
    cost: 1800,
    duration_hours: 4,
    description: "Six tasting stops with a local guide.",
  },
  {
    id: 103,
    name: "Museum Day Pass",
    type: "culture",
    cost: 1200,
    duration_hours: 5,
    description: "Skip-the-line entry to the three main museums.",
  },
  {
    id: 104,
    name: "Sunrise Hike",
    type: "adventure",
    cost: 600,
    duration_hours: 3,
    description: "Early climb to the ridge viewpoint.",
  },
  {
    id: 105,
    name: "River Cruise",
    type: "sightseeing",
    cost: 1500,
    duration_hours: 2,
    description: "Evening cruise past the lit-up waterfront.",
  },
  {
    id: 106,
    name: "Cooking Class",
    type: "food",
    cost: 2200,
    duration_hours: 3,
    description: "Cook three regional dishes, then eat them.",
  },
  {
    id: 107,
    name: "Night Market",
    type: "shopping",
    cost: 800,
    duration_hours: 2,
    description: "Street food, crafts and live music.",
  },
];
