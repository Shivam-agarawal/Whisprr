/**
 * useChatStore.js — Global Chat State (Zustand)
 *
 * Manages all chat-related state and server interactions. Consumed by
 * sidebar components (ChatsList, ContactList) and the main chat area
 * (ChatContainer, MessageInput, ProfileHeader).
 *
 * State:
 *  allContacts      — Full list of all registered users (for the Contacts tab).
 *  chats            — List of users the logged-in user has messaged before (Chats tab).
 *  messages         — Full message history with the currently selectedUser.
 *  activeTab        — "chats" | "contacts" — controls which sidebar list is shown.
 *  selectedUser     — The user whose conversation is currently open (or null).
 *  isUsersLoading   — True while contacts/chats are being fetched (shows skeleton).
 *  isMessagesLoading— True while messages are being fetched (shows skeleton).
 *  isSoundEnabled   — Whether keystroke/notification sounds are on. Persisted to localStorage.
 *
 * Actions:
 *  getAllContacts()    — Fetches all users (excluding self) for the Contacts tab.
 *  getMyChatPartners()— Fetches only users you've chatted with for the Chats tab.
 *  getMessagesByUserId(userId) — Loads message history with a specific user.
 *  sendMessage(data)  — Sends { text, image } with optimistic UI update.
 *  setSelectedUser()  — Sets which user's chat is open.
 *  setActiveTab()     — Switches sidebar between "chats" and "contacts".
 *  toggleSound()      — Toggles sound on/off and persists the preference.
 */
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  // --- State ---
  allContacts: [],          // list of all users (Contacts tab)
  chats: [],                // list of users you've chatted with (Chats tab)
  messages: [],             // messages with the currently open user
  activeTab: "chats",       // "chats" or "contacts" — which sidebar tab is visible
  selectedUser: null,       // the user whose chat is currently open (null = no chat open)
  isUsersLoading: false,    // true while loading contacts/chats (shows skeleton)
  isMessagesLoading: false, // true while loading messages (shows skeleton)

  // Read sound preference from localStorage on startup — default to false if not set
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  // --- Simple setters ---
  setActiveTab: (tab) => set({ activeTab: tab }), // switch between "chats" and "contacts"
  setSelectedUser: (selectedUser) => set({ selectedUser }), // open a user's chat

  // Toggle the typing sound on/off and save the preference to localStorage
  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled); // persist to localStorage
    set({ isSoundEnabled: !get().isSoundEnabled });                 // update in-memory state
  },

  // --- API calls ---

  // Fetch all users except the logged-in user (for the Contacts tab)
  getAllContacts: async () => {
    set({ isUsersLoading: true }); // show skeleton while loading
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data }); // store the contacts list
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false }); // hide skeleton either way
    }
  },

  // Fetch only users you have previously chatted with (for the Chats tab)
  getMyChatPartners: async () => {
    set({ isUsersLoading: true }); // show skeleton while loading
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data }); // store the chat partners list
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false }); // hide skeleton either way
    }
  },

  // Fetch all messages between the logged-in user and userId
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true }); // show skeleton while loading
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data }); // store the message history
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false }); // hide skeleton either way
    }
  },

  // Send a message to the currently selected user.
  // Uses OPTIMISTIC UI: the message appears in the chat immediately (before the server responds),
  // giving a fast, responsive feel. If the server call fails, we roll back.
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState(); // get the logged-in user

    // Create a fake "pending" message to display right now (before the API call)
    const tempId = `temp-${Date.now()}`; // temporary unique ID for this optimistic message
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // custom flag to identify this as a not-yet-confirmed message
    };

    // Add the fake message to the UI immediately so the user sees it right away
    set({ messages: [...messages, optimisticMessage] });

    try {
      // Actually send the message to the backend
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      // Replace the optimistic message with the real one from the server
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      // If the send fails, remove the optimistic message so the UI reflects the failure
      set({ messages: messages }); // restore to original list (without the optimistic one)
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  // --- Socket.io real-time listeners ---
  // Called when opening a chat to start receiving live messages
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return; // nothing to subscribe to if no chat is open

    const socket = useAuthStore.getState().socket;
    if (!socket) return; // socket not connected yet

    // Listen for "newMessage" events from the backend
    socket.on("newMessage", (newMessage) => {
      // Only add the message if it was sent by the currently open user
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isFromSelectedUser) return;

      // Add the new message to the chat
      set({ messages: [...get().messages, newMessage] });

      // Play notification sound if sounds are enabled.
      // IMPORTANT: use get().isSoundEnabled here, NOT a local variable —
      // this is a socket callback (not a React render), so we must read
      // the latest state directly from the Zustand store via get().
      if (get().isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0; // reset so rapid messages each play from start
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  // Called when closing a chat to stop listening for messages
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage"); // remove the event listener
  },
}));
