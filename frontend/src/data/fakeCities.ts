import type { City } from "@/api/types";

// Matches GET /cities?search= response shape exactly (region added for filtering).
export const fakeCities: City[] = [
  { id: 5, name: "Panaji", country: "India", region: "Asia", cost_index: 3, popularity: 8 },
  { id: 6, name: "Paris", country: "France", region: "Europe", cost_index: 9, popularity: 10 },
  { id: 7, name: "Kyoto", country: "Japan", region: "Asia", cost_index: 7, popularity: 9 },
  { id: 8, name: "Santorini", country: "Greece", region: "Europe", cost_index: 8, popularity: 9 },
  { id: 9, name: "Jaipur", country: "India", region: "Asia", cost_index: 3, popularity: 8 },
  { id: 10, name: "Lisbon", country: "Portugal", region: "Europe", cost_index: 6, popularity: 9 },
  { id: 11, name: "Bali", country: "Indonesia", region: "Asia", cost_index: 4, popularity: 10 },
  { id: 12, name: "Reykjavik", country: "Iceland", region: "Europe", cost_index: 10, popularity: 7 },
  { id: 13, name: "Marrakesh", country: "Morocco", region: "Africa", cost_index: 4, popularity: 8 },
  { id: 14, name: "Cape Town", country: "South Africa", region: "Africa", cost_index: 5, popularity: 8 },
  { id: 15, name: "New York", country: "United States", region: "Americas", cost_index: 10, popularity: 10 },
  { id: 16, name: "Mexico City", country: "Mexico", region: "Americas", cost_index: 4, popularity: 8 },
  { id: 17, name: "Rio de Janeiro", country: "Brazil", region: "Americas", cost_index: 5, popularity: 9 },
  { id: 18, name: "Queenstown", country: "New Zealand", region: "Oceania", cost_index: 8, popularity: 8 },
  { id: 19, name: "Sydney", country: "Australia", region: "Oceania", cost_index: 9, popularity: 9 },
  { id: 20, name: "Istanbul", country: "Türkiye", region: "Europe", cost_index: 5, popularity: 9 },
];

export const cityRegions = [
  "All",
  "Asia",
  "Europe",
  "Africa",
  "Americas",
  "Oceania",
] as const;
