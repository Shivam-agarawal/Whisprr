/**
 * auth.route.js — Authentication Routes
 *
 * Mounts all authentication-related HTTP routes under /api/auth.
 * Every route first passes through `arcjetProtection` (rate limiting + bot/attack blocking).
 *
 * Public routes (no JWT required):
 *  POST /api/auth/signup  → signup controller
 *  POST /api/auth/login   → login controller
 *  POST /api/auth/logout  → logout controller
 *
 * Protected routes (require valid JWT cookie via protectRoute):
 *  PUT  /api/auth/update-profile → updateProfile controller
 *  GET  /api/auth/check          → returns req.user (used by frontend on page load
 *                                   to restore the session without re-logging in)
 */
import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

// express.Router() creates a mini-router just for /api/auth routes
const router = express.Router();

// Apply Arcjet security to ALL routes in this router (rate limiting + bot/attack protection)
router.use(arcjetProtection);

// --- Public routes — no login required ---
router.post("/signup", signup);    // create a new account
router.post("/login", login);      // log in with email + password
router.post("/logout", logout);    // clear the JWT cookie

// --- Protected routes — must be logged in (JWT cookie required) ---
// protectRoute middleware runs first; if it fails, the handler never runs
router.put("/update-profile", protectRoute, updateProfile); // upload a new profile picture

// /check is called by the frontend on every page load to restore the session
// protectRoute verifies the cookie; if valid it sets req.user and we return it
router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user),
);

export default router;
