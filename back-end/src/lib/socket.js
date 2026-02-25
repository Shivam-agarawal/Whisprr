/**
 * socket.js — Socket.io Server Setup
 *
 * Creates and exports the Socket.io server along with the shared Express app
 * and HTTP server. This file is the single source of truth for real-time
 * communication in Whisprr.
 *
 * Why it creates its own app & server:
 *  Socket.io requires a raw Node.js `http.Server` instance (not Express alone).
 *  So we create: express() → http.createServer(app) → new Server(httpServer).
 *  The Express app and http server are exported so server.js can attach all
 *  REST routes to the same app and listen on the same port.
 *
 * Authentication:
 *  `socketAuthMiddleware` runs before every new socket connection is accepted.
 *  It verifies the JWT cookie and attaches `socket.user` and `socket.userId`
 *  so the connection event handler knows who just connected.
 *
 * Online User Tracking:
 *  `userSocketMap` — an in-memory object mapping userId → socketId.
 *  Updated on every `connection` and `disconnect` event.
 *  `getReceiverSocketId(userId)` — helper used by message.controller.js to
 *  look up the active socketId of a recipient before emitting `newMessage`.
 *
 * Events:
 *  Emits `getOnlineUsers` (array of online userIds) to ALL clients whenever
 *  any user connects or disconnects. The frontend stores this in useAuthStore.
 *
 * Exports:
 *  io      — The Socket.io Server instance (used to emit events from controllers).
 *  app     — The Express application (REST routes are mounted here in server.js).
 *  server  — The http.Server instance (server.js calls server.listen() on this).
 *  getReceiverSocketId(userId) — Returns the socketId for a given userId, or
 *                                undefined if that user is offline.
 */
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
    console.log("A user connected:", socket.user.username);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // with socket.on we listen for events from clients
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.user.username);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };