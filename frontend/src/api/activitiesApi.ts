import instance from "./axiosInstance";
import type { Activity } from "./types";

export const searchActivities = (params: { city_id?: number; type?: string }) =>
  instance.get<Activity[]>("/activities", { params });

export const addActivityToStop = (
  tripId: number,
  stopId: number,
  activityId: number,
) =>
  instance.post(`/trips/${tripId}/stops/${stopId}/activities`, {
    activity_id: activityId,
  });

export const removeActivityFromStop = (
  tripId: number,
  stopId: number,
  activityId: number,
) =>
  instance.delete<void>(
    `/trips/${tripId}/stops/${stopId}/activities/${activityId}`,
  );
