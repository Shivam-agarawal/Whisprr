/**
 * server.js — Express Application Entry Point
 *
 * This is the main backend server file for the Whisprr chat application.
 * It sets up the Express app with all middleware and routes, then starts
 * listening on the configured port.
 *
 * Responsibilities:
 *  - Registers global middleware: JSON body parser (10mb limit for base64 images),
 *    CORS (configured to allow the frontend origin with credentials), and cookie parser.
 *  - Mounts route groups: /api/auth for authentication, /api/messages for chat.
 *  - Serves the built React frontend in production mode (static files + SPA fallback).
 *  - Connects to MongoDB via connectDB() after the server starts listening.
 *
 * Environment Variables Required:
 *  PORT, MONGO_URI, CLIENT_URL, NODE_ENV
 */
// Note: This file uses ES Modules (import/export), not CommonJS (require)

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { login, signup, logout } from "./controllers/auth.controller.js";
import Path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

// Import the shared app, server, and socket from socket.js
// (socket.js creates the http server that socket.io needs)
import { app, server } from "./lib/socket.js";

// Load environment variables from .env file into process.env
dotenv.config();

// __dirname doesn't exist in ES Modules — Path.resolve() gives the same result
const __dirname = Path.resolve();

// Use PORT from .env or default to 3000
const PORT = process.env.PORT || 3000;

// --- Global Middleware ---
// Parse incoming JSON bodies (limit raised to 10mb so base64 images fit)
app.use(express.json({ limit: "10mb" }));
// Allow requests from the frontend origin and allow cookies to be sent
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// Parse cookies from incoming requests (needed to read the JWT cookie)
app.use(cookieParser());

// --- Duplicate routes for compatibility ---
// These ensure /auth/login and /api/auth/login both work (belt and suspenders)
app.post("/auth/login", login);
app.post("/api/auth/login", login);
app.post("/auth/signup", signup);
app.post("/api/auth/signup", signup);
app.post("/auth/logout", logout);
app.post("/api/auth/logout", logout);

// --- Main route groups ---
app.use("/api/auth", authRoutes);    // all auth endpoints (signup, login, etc.)
app.use("/auth", authRoutes);        // duplicate mount for compatibility
app.use("/api/messages", messageRoutes); // all chat/messaging endpoints

// Health check — hit GET /api/health to verify the server is up
app.get("/api/health", (_, res) => res.json({ ok: true, message: "API is running" }));

// --- Production: serve the built React app ---
if (process.env.NODE_ENV === "production") {
  // Serve static files from the Vite build output folder
  app.use(express.static(Path.join(__dirname, "../front-end/dist")));

  // For any route not matched above, send the React index.html
  // (React Router handles client-side routing from there)
  app.get("*", (_, res) => {
    res.sendFile(Path.join(__dirname, "../front-end/dist/index.html"));
  });
}

// Return JSON 404 for unknown /api routes (instead of ugly HTML error pages)
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found", path: req.method + " " + req.path });
});

// Start the HTTP server and connect to MongoDB once it's ready
server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB(); // connect to MongoDB after the server starts
});
