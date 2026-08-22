import type { City } from "@/api/types";

// Matches GET /cities?search= response shape exactly.
export const fakeCities: City[] = [
  { id: 5, name: "Panaji", country: "India", cost_index: 3, popularity: 8 },
  { id: 6, name: "Paris", country: "France", cost_index: 9, popularity: 10 },
  { id: 7, name: "Kyoto", country: "Japan", cost_index: 7, popularity: 9 },
  { id: 8, name: "Santorini", country: "Greece", cost_index: 8, popularity: 9 },
];
