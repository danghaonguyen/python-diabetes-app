import axios from "axios";

// Defaults to Vite's local /api proxy. Configure this value for deployment.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
