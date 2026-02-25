/**
 * resend.js — Resend Email Client Configuration
 *
 * Sets up and exports the Resend email client and the sender identity
 * used by all outgoing transactional emails in Whisprr.
 *
 * Exports:
 *  resendClient — Authenticated Resend API client. Used in email.Handlers.js
 *                 to call resendClient.emails.send(...).
 *
 *  sender       — Object { email, name } representing the "From" field.
 *                 Falls back to "onboarding@resend.dev" (Resend sandbox address)
 *                 if EMAIL_FROM is a Gmail address (gmail.com domains cannot be
 *                 verified with Resend without domain ownership).
 *
 * Environment Variables Required:
 *  RESEND_API_KEY    — your Resend project API key.
 *  EMAIL_FROM        — the verified sender email address.
 *  EMAIL_FROM_NAME   — display name shown in the From field (defaults to "Whisprr").
 */
import { Resend } from "resend";
import { ENV } from "./env.js";

export const resendClient = new Resend(ENV.RESEND_API_KEY);

// Force Resend sandbox when EMAIL_FROM is gmail (can't verify gmail.com)
// System env vars can override .env, so check for gmail explicitly
const rawFrom = ENV.EMAIL_FROM || "onboarding@resend.dev";
const useSandbox = rawFrom.includes("gmail.com") || rawFrom.includes("gmail.co");
export const sender = {
  email: useSandbox ? "onboarding@resend.dev" : rawFrom,
  name: ENV.EMAIL_FROM_NAME || "Whisprr",
};
