//const express = require('express');

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { login, signup, logout } from "./controllers/auth.controller.js";
import Path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();

const __dirname = Path.resolve();

const PORT = process.env.PORT || 3000;

//payload to large error: express.json({ limit: '10mb' })
app.use(express.json()); // Middleware to parse JSON bodies
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
