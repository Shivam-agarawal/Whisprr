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
import { io } from "socket.io-client"; // socket.io client for real-time communication

// In dev we connect to localhost:3000; in production the socket is on the same origin
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  // --- State ---
  authUser: null,        // the logged-in user object (null = not logged in)
  isCheckingAuth: true,  // true while app boot auth check is running
  isSigningUp: false,    // true while signup API call is in progress
  isLoggingIn: false,    // true while login API call is in progress
  socket: null,          // active socket.io connection (null if not connected)
  onlineUsers: [],       // list of userIds who are currently online

  // --- Actions ---

  // Called once on app mount (App.jsx) to restore session from JWT cookie.
  // If the cookie is valid, the server returns the user and we also open
  // the socket connection so online status works immediately.
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data }); // store the user in state
      get().connectSocket();       // open socket so we appear online
    } catch (error) {
      // cookie missing or expired → user is not logged in
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      // always stop showing the PageLoader spinner
      set({ isCheckingAuth: false });
    }
  },

  // Creates a new account. On success, stores the user and opens the socket.
  signup: async (data) => {
    set({ isSigningUp: true }); // disable the submit button
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data }); // save logged-in user
      toast.success("Account created successfully!");
      get().connectSocket();       // appear online right away
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false }); // re-enable the submit button
    }
  },

  // Logs in an existing user. On success, stores the user and opens the socket.
  login: async (data) => {
    set({ isLoggingIn: true }); // disable the submit button
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data }); // save logged-in user
      toast.success("Logged in successfully");
      get().connectSocket();       // appear online right away
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false }); // re-enable the submit button
    }
  },

  // Logs out the user — clears the JWT cookie server-side and closes the socket.
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });          // clear the user from state
      toast.success("Logged out successfully");
      get().disconnectSocket();         // go offline
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  // Uploads a new profile picture to Cloudinary via the backend and updates
  // the local authUser state so the UI reflects the change immediately.
  updateProfile: async (data) => {
    try {
      // data = { profilePicture: base64String }
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data }); // update avatar in state
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

  // Opens a socket.io connection to the backend using the JWT cookie for auth.
  // Guards against connecting twice (checks socket?.connected first).
  // Listens for the "getOnlineUsers" event and updates onlineUsers in state,
  // which drives the online/offline indicators in ChatsList and ContactList.
  connectSocket: () => {
    const { authUser } = get();

    // don't connect if not logged in, or if already connected
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // send the JWT cookie with the handshake request
    });

    socket.connect(); // initiate the WebSocket connection

    set({ socket }); // store the socket instance in state

    // when the server broadcasts the list of online user IDs, save them
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // Closes the socket connection — called on logout so the user goes offline.
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
