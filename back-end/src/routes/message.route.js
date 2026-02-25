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

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by 
// rate limiting before hitting the auth middleware.
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;