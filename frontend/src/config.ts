// Backend base URL — change here when the FastAPI server moves.
export const BASE_URL = "http://localhost:8000";

// While the backend is not ready, pages read from src/data/* fake data.
// Flip this to false (or set VITE_USE_FAKE_DATA=false) to hit the real API.
export const USE_FAKE_DATA =
  (import.meta.env["VITE_USE_FAKE_DATA"] ?? "true") !== "false";
