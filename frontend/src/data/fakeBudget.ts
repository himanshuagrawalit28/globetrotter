import type { Budget } from "@/api/types";

// Matches GET /trips/{id}/budget response shape exactly.
export const fakeBudget: Budget = {
  trip_id: 1,
  total_cost: 15000,
  breakdown: { activities: 5000, stay: 8000, transport: 2000, meals: 0 },
  avg_cost_per_day: 3000,
  days: 5,
};
