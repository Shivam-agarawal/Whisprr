/**
 * arcjet.middleware.js — Security & Rate Limiting Middleware
 *
 * Exports `arcjetProtection`, an Express middleware that applies security rules
 * to every request using the Arcjet SDK. Applied as the first middleware on all
 * auth and message routes.
 *
 * Protection rules (configured in lib/arcjet.js):
 *  - Shield:        Blocks common web attacks (SQLi, XSS, etc.)
 *  - Bot Detection: Blocks malicious bots; allows known search engine crawlers.
 *  - Rate Limiting: Sliding window of max 100 requests per 60 seconds per IP.
 *
 * Responses:
 *  429 — Rate limit exceeded.
 *  403 — Bot or spoofed-bot detected, or blocked by security policy.
 *  Calls next() on all passing requests, and also on internal Arcjet errors
 *  (fail-open) to prevent the app from going down if Arcjet is unreachable.
 */
import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res.status(403).json({
          message: "Access denied by security policy.",
        });
      }
    }

    // check for spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next();
  }
};