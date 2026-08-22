import instance from "./axiosInstance";
import type { Trip, TripCreateInput, TripDetail, TripListItem } from "./types";

export const createTrip = (data: TripCreateInput) =>
  instance.post<Trip>("/trips", data);

export const getMyTrips = () => instance.get<TripListItem[]>("/trips");

export const getTripDetail = (tripId: number) =>
  instance.get<TripDetail>(`/trips/${tripId}`);

export const updateTrip = (tripId: number, data: TripCreateInput) =>
  instance.put<Trip>(`/trips/${tripId}`, data);

export const deleteTrip = (tripId: number) =>
  instance.delete<void>(`/trips/${tripId}`);
