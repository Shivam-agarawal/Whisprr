/**
 * utils.js — Shared Back-End Utilities
 *
 * Exports `generateToken`, a helper used by the auth controller
 * immediately after a successful signup or login.
 *
 * generateToken(userId, res):
 *  - Signs a JWT containing { id: userId } with a 7-day expiry.
 *  - Sets the token as an httpOnly cookie named "jwt" with:
 *      httpOnly: true   — prevents JavaScript access (XSS protection)
 *      sameSite: strict — prevents cross-site request forgery (CSRF)
 *      secure: true     — HTTPS-only in production, HTTP allowed in dev
 *      maxAge: 7 days   — matches the JWT expiry
 *  - Also returns the raw token string (rarely needed in practice).
 *
 * Environment Variables Required:
 *  JWT_SECRET — the secret key used to sign tokens.
 */
import jwt from 'jsonwebtoken';

// Creates a signed JWT and stores it in an httpOnly cookie on the response
// Called as: generateToken(user._id, res) — passes the ObjectId directly
export const generateToken = (userId, res) => {

    // Read the secret key from environment variables
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Sign the token — payload is { id: userId }, expires in 7 days
    // userId is a Mongoose ObjectId — jwt.sign serializes it to a hex string automatically
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Attach the token to the response as an httpOnly cookie named "jwt"
    res.cookie('jwt', token, {
        httpOnly: true,  // JavaScript can't read this cookie → protects against XSS attacks
        sameSite: 'strict', // cookie only sent on same-site requests → protects against CSRF
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds (matches token expiry)
    });

    return token; // return the raw token (not usually needed, cookie is enough)
};
