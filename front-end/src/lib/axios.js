/**
 * axios.js — Configured Axios HTTP Client
 *
 * Creates and exports a pre-configured Axios instance (`axiosInstance`) that
 * is used for every API request in the frontend instead of raw `fetch`.
 *
 * Configuration:
 *  baseURL        — Automatically set to:
 *                     "http://localhost:3000/api" in development
 *                     "/api" in production (same-origin, served by Express)
 *  withCredentials — true: ensures the JWT cookie is sent with every request
 *                    (required for session authentication to work).
 *
 * Usage:
 *  import { axiosInstance } from "../lib/axios";
 *  const res = await axiosInstance.get("/auth/check");
 *  const res = await axiosInstance.post("/messages/send/:id", { text, image });
 */
import axios from "axios";

// Set the base URL based on the environment:
// - In development: use the full URL of the local Express server
// - In production: use "/api" — Express serves the React app AND the API on the same port
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api" // local Express server
      : "/api",                     // same-origin in production (no CORS needed)
  withCredentials: true, // IMPORTANT: sends the JWT cookie with every request
});
