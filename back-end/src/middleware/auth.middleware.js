/**
 * auth.middleware.js — JWT Authentication Middleware
 *
 * Exports `protectRoute`, an Express middleware that guards private API routes.
 *
 * How it works:
 *  1. Reads the `jwt` cookie from the incoming request.
 *  2. Verifies the token using JWT_SECRET from environment variables.
 *  3. Fetches the corresponding user from MongoDB (password field excluded).
 *  4. Attaches the user document to `req.user` so downstream controllers
 *     can access the authenticated user without an extra DB query.
 *
 * Responds with:
 *  401 — if no token is present or the token is invalid/expired.
 *  404 — if the token is valid but the user no longer exists in the DB.
 *  500 — for any unexpected server errors.
 *
 * Usage: add `protectRoute` before any controller that requires auth.
 *   router.get("/check", protectRoute, (req, res) => res.json(req.user));
 */
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("User not found for userId:", decoded.id);
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
