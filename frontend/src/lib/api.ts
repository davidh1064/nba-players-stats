import axios from "axios";

// Overridable so a deployed frontend can point at a real backend without a code
// change. Falls back to the local dev server.
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
