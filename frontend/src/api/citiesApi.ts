import instance from "./axiosInstance";
import type { City } from "./types";

export const searchCities = (search: string) =>
  instance.get<City[]>("/cities", { params: { search } });
