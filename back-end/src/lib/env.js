/**
 * env.js — Centralised Environment Variables
 *
 * Loads the .env file (via dotenv) and re-exports all environment variables
 * as a single typed `ENV` object. Import `ENV` from this file anywhere in
 * the backend instead of accessing process.env directly — this makes it
 * easy to see all required variables in one place.
 *
 * Variables:
 *  PORT                    — Port the Express server listens on (default 3000).
 *  MONGO_URI               — MongoDB connection string.
 *  JWT_SECRET              — Secret key for signing/verifying JWT tokens.
 *  NODE_ENV                — "development" or "production".
 *  CLIENT_URL              — Frontend origin URL (used in CORS and welcome emails).
 *  RESEND_API_KEY          — Resend transactional email API key.
 *  EMAIL_FROM              — Sender email address for outgoing emails.
 *  EMAIL_FROM_NAME         — Sender display name for outgoing emails.
 *  CLOUDINARY_CLOUD_NAME   — Cloudinary cloud name for image uploads.
 *  CLOUDINARY_API_KEY      — Cloudinary API key.
 *  CLOUDINARY_API_SECRET   — Cloudinary API secret.
 *  ARCJET_KEY              — Arcjet security SDK API key.
 *  ARCJET_ENV              — Arcjet environment ("development" / "production").
 */
import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  ARCJET_KEY: process.env.ARCJET_KEY,
  ARCJET_ENV: process.env.ARCJET_ENV,
};