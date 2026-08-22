import instance from "./axiosInstance";
import type { LoginResponse, SignupResponse } from "./types";

export const signup = (email: string, password: string, name: string) =>
  instance.post<SignupResponse>("/auth/signup", { email, password, name });

export const login = (email: string, password: string) =>
  instance.post<LoginResponse>("/auth/login", { email, password });
