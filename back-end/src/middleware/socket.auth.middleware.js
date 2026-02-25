/**
 * socket.auth.middleware.js — Socket.io Authentication Middleware
 *
 * Runs before a Socket.io connection is established (via `io.use()`).
 * Its job is identical to `auth.middleware.js` (HTTP), but adapted for
 * the Socket.io handshake flow using the `(socket, next)` signature.
 *
 * How it works:
 *  1. Extracts the `jwt` cookie from the socket handshake headers.
 *     Socket.io sends the browser's cookies in the handshake HTTP request,
 *     so we manually parse the `Cookie` header string to find the jwt value.
 *  2. Verifies the JWT using JWT_SECRET from environment variables.
 *  3. Fetches the user from MongoDB (password field excluded).
 *  4. Attaches `socket.user` (full user object) and `socket.userId` (string)
 *     so the `connection` handler in socket.js knows who just connected.
 *  5. Calls `next()` on success or `next(new Error(...))` to reject
 *     the connection without crashing the server.
 *
 * Rejection reasons (connection is refused):
 *  - No `jwt` cookie present in the handshake.
 *  - Token is invalid or expired.
 *  - User belonging to the token no longer exists in the database.
 *
 * Note: `socket.user.fullName` is referenced in socket.js console logs,
 * but the User model uses `username` — update those logs if needed.
 */
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        // extract token from http-only cookies
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];

        if (!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized - No Token Provided"));
        }

        // verify the token
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded) {
            console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid Token"));
        }

        // find the user fromdb
        // JWT payload uses { id } (see utils.js → jwt.sign({ id: userId }))
        // auth.middleware.js also uses decoded.id — must match here too
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("User not found"));
        }

        // attach user info to socket
        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`Socket authenticated for user: ${user.username} (${user._id})`);

        next();
    } catch (error) {
        console.log("Error in socket authentication:", error.message);
        next(new Error("Unauthorized - Authentication failed"));
    }
};