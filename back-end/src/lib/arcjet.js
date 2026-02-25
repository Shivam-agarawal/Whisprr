/**
 * arcjet.js — Arcjet Security Client Configuration
 *
 * Creates and exports a pre-configured Arcjet security client (`aj`) used by
 * the arcjet.middleware.js to protect all API routes.
 *
 * Active Rules:
 *  1. Shield (LIVE)       — Blocks common web attack vectors: SQL injection,
 *                           XSS, path traversal, etc.
 *  2. detectBot (LIVE)    — Blocks automated bots. Search engine crawlers
 *                           (Google, Bing) are explicitly allowed.
 *  3. slidingWindow (LIVE)— Rate limiting: max 100 requests per 60 seconds
 *                           per IP (sliding window algorithm).
 *
 * To test without blocking traffic, switch mode from "LIVE" to "DRY_RUN"
 * in each rule — requests will be logged but not rejected.
 *
 * Environment Variables Required:
 *  ARCJET_KEY — your Arcjet project API key.
 */

import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

import { ENV } from "./env.js";

const aj = arcjet({

  key: ENV.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.

    slidingWindow({
      mode: "LIVE",//Blocks requests. Use "DRY_RUN" to log only
      max: 100, // Maximum number of requests per interval
      interval: 60, // Refill every 10 seconds
    }),
  ],
});

export default aj;