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

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user),
);

export default router;
