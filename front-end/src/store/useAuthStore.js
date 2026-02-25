/**
 * useAuthStore.js — Global Authentication State (Zustand)
 *
 * The single source of truth for the logged-in user's session across the
 * entire React app. Uses Zustand for lightweight global state management.
 *
 * State:
 *  authUser        — The currently authenticated user object (or null).
 *                    Populated by checkAuth, login, and signup.
 *  isCheckingAuth  — True while the initial /auth/check request is in flight.
 *                    App.jsx shows a PageLoader spinner until this is false.
 *  isSigningUp     — True while a signup request is in flight (disables form).
 *  isLoggingIn     — True while a login request is in flight (disables form).
 *  socket          — Active socket.io connection (or null).
 *  onlineUsers     — Array of user IDs currently connected via socket.io.
 *
 * Actions:
 *  checkAuth()      — Called on app mount. Hits GET /api/auth/check to restore
 *                     the session from the JWT cookie without re-logging in.
 *  signup(data)     — Creates a new account and sets authUser.
 *  login(data)      — Authenticates and sets authUser.
 *  logout()         — Clears authUser and the JWT cookie.
 *  updateProfile()  — Uploads a new profile picture and updates authUser.
 *  connectSocket()  — Opens a socket.io connection authenticated via cookie.
 *  disconnectSocket() — Closes the socket.io connection on logout.
 */
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
//import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

  // connectSocket: () => {
  //   const { authUser } = get();
  //   if (!authUser || get().socket?.connected) return;

  //   const socket = io(BASE_URL, {
  //     withCredentials: true, // this ensures cookies are sent with the connection
  //   });

  //   socket.connect();

  //   set({ socket });

  //   // listen for online users event
  //   socket.on("getOnlineUsers", (userIds) => {
  //     set({ onlineUsers: userIds });
  //   });
  // },

  // disconnectSocket: () => {
  //   if (get().socket?.connected) get().socket.disconnect();
  // },
}));
