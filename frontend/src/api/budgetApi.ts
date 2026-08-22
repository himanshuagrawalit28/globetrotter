import instance from "./axiosInstance";
import type { Budget } from "./types";

export const getBudget = (tripId: number) =>
  instance.get<Budget>(`/trips/${tripId}/budget`);
