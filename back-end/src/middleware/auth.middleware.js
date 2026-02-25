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

// This middleware runs BEFORE the actual route handler.
// If the user is not authenticated, it stops the request here and returns an error.
// If authenticated, it calls next() to pass control to the next handler.
export const protectRoute = async (req, res, next) => {
  try {
    // Read the JWT from the cookie named "jwt"
    // (set by generateToken in utils.js during login/signup)
    const token = req.cookies.jwt;

    // If no cookie is present, the user is not logged in — reject the request
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    // Decode and verify the token using the secret key
    // jwt.verify throws an error if the token is expired or tampered with
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized - Invalid token" });

    // Token is valid — look up the actual user in the database
    // .select("-password") removes the password hash from the returned object
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      // Token was valid but the user account was deleted — reject
      console.log("User not found for userId:", decoded.id);
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user object to the request — controllers can now use req.user
    req.user = user;

    // Pass control to the actual route handler
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
