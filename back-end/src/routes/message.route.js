/**
 * message.route.js — Messaging Routes
 *
 * Mounts all chat and contact-related HTTP routes under /api/messages.
 * All routes are protected by both arcjetProtection (security/rate limiting)
 * and protectRoute (JWT authentication) — applied in that order for efficiency
 * (unauthenticated requests are rejected before hitting the DB).
 *
 * Routes:
 *  GET  /api/messages/contacts  → getAllContacts  (all users except self)
 *  GET  /api/messages/chats     → getChatPartners (users you've chatted with)
 *  GET  /api/messages/:id       → getMessagesByUserId (full message history)
 *  POST /api/messages/send/:id  → sendMessage (text and/or image)
 */
import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// Apply BOTH middlewares to every route in this file:
// 1. arcjetProtection — rejects bots and rate-limits excessive requests
// 2. protectRoute     — verifies the JWT cookie and attaches req.user
// Order matters: security check runs first so unauthenticated requests
// are blocked early, before any database work is done.
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);       // all users (for Contacts tab)
router.get("/chats", getChatPartners);         // chat history partners (for Chats tab)
router.get("/:id", getMessagesByUserId);       // messages with a specific user
router.post("/send/:id", sendMessage);         // send a message to a specific user

export default router;