import axios from "axios";
import { BASE_URL } from "@/config";

const instance = axios.create({ baseURL: BASE_URL });

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// All backend errors come back as { detail: "message" }
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const detail =
      error?.response?.data?.detail ?? error?.message ?? "Something went wrong";
    return Promise.reject(new Error(detail));
  },
);

export default instance;
