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
 *                       Image is a base64 string uploaded to Cloudinary by the backend.
 *  setSelectedUser()  — Sets which user's chat is open.
 *  setActiveTab()     — Switches sidebar between "chats" and "contacts".
 *  toggleSound()      — Toggles sound on/off and persists the preference.
 *  subscribeToMessages()   — (socket.io stub — pending full implementation)
 *  unsubscribeFromMessages()— (socket.io stub — pending full implementation)
 */
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify optimistic messages (optional)
    };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      // remove optimistic message on failure
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    // TODO: socket.io - listen for newMessage
    //const socket = useAuthStore.getState().socket;
    //socket.on("newMessage", (newMessage) => {
    //const isMessageSentFromSelectedUser =
    //newMessage.senderId === selectedUser._id;
    //if (!isMessageSentFromSelectedUser) return;

    //const currentMessages = get().messages;
    //set({ messages: [...currentMessages, newMessage] });

    // if (isSoundEnabled) {
    //   const notificationSound = new Audio("/sounds/notification.mp3");

    //   notificationSound.currentTime = 0; // reset to start
    //   notificationSound
    //     .play()
    //     .catch((e) => console.log("Audio play failed:", e));
    // }
    //});
  },

  unsubscribeFromMessages: () => {
    // TODO: socket.io - socket.off("newMessage");
  },
}));
