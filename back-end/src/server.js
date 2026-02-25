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

dotenv.config();
const app = express();

const __dirname = Path.resolve();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" })); // Raised limit for base64 image payloads
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(cookieParser());

// Explicit auth routes so /auth/login and /api/auth/login always work
app.post("/auth/login", login);
app.post("/api/auth/login", login);
app.post("/auth/signup", signup);
app.post("/api/auth/signup", signup);
app.post("/auth/logout", logout);
app.post("/api/auth/logout", logout);

// Other API routes (must be before any catch-all)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check – use GET http://localhost:3000/api/health to verify server
app.get("/api/health", (_, res) => res.json({ ok: true, message: "API is running" }));

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(Path.join(__dirname, "../front-end/dist")));

  app.get("*", (_, res) => {
    res.sendFile(Path.join(__dirname, "../front-end/dist/index.html"));
  });
}

// JSON 404 for API routes (avoids HTML "Cannot POST ..." for wrong paths)
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found", path: req.method + " " + req.path });
});

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});

// scripts
// "scripts": {
//   "start": "node src/server.js"
// }
