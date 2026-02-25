/**
 * message.controller.js — Messaging & Contacts Controller
 *
 * Handles all HTTP logic for chat-related endpoints. All routes require
 * the user to be authenticated (protectRoute middleware).
 *
 *  getAllContacts     GET /api/messages/contacts
 *                    Returns every registered user except the logged-in user.
 *                    Used to populate the "Contacts" tab in the sidebar.
 *
 *  getChatPartners   GET /api/messages/chats
 *                    Finds all messages involving the logged-in user and returns
 *                    the unique set of users they have exchanged messages with.
 *                    Used to populate the "Chats" tab in the sidebar.
 *
 *  getMessagesByUserId  GET /api/messages/:id
 *                    Returns the full message history between the logged-in user
 *                    and the user specified by :id (both directions).
 *
 *  sendMessage       POST /api/messages/send/:id
 *                    Validates the payload (text or image required, can't message
 *                    yourself). If an image is included (base64), uploads it to
 *                    Cloudinary and stores the secure URL. Saves the Message doc.
 *                    Real-time delivery via socket.io is currently commented out
 *                    (see TODO comments).
 *
 * Note: socket.io real-time events (newMessage emit) are prepared but currently
 * commented out pending full socket.io integration.
 */
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js"; // for real-time delivery
import Message from "../models/message.js";
import User from "../models/User.js";

// --- GET ALL CONTACTS ---
// Returns every user in the DB except the currently logged-in user.
// This powers the "Contacts" tab in the sidebar.
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // set by protectRoute middleware

    // $ne means "not equal" — exclude the logged-in user from results
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET MESSAGES BY USER ID ---
// Returns the full chat history between the logged-in user and user :id.
// Messages are fetched in BOTH directions (sent and received).
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;              // logged-in user
    const { id: userToChatId } = req.params; // the other user from the URL

    // $or — match messages where either:
    //   (I'm the sender AND they're the receiver) OR (they're the sender AND I'm the receiver)
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- SEND MESSAGE ---
// Sends a text message, an image, or both from the logged-in user to another user.
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;    // message content from the request body
    const { id: receiverId } = req.params; // recipient user ID from the URL
    const senderId = req.user._id;         // logged-in user (set by protectRoute)

    // At least one of text or image must be present
    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    // Prevent users from messaging themselves
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }

    // Make sure the recipient account actually exists
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    // If an image is attached (as base64), upload it to Cloudinary first
    // and store the permanent CDN URL instead of the raw base64 string
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // the permanent image URL
    }

    // Create the message document and save it to MongoDB
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, // undefined if no image was sent
    });

    await newMessage.save();

    // --- Real-time delivery via socket.io ---
    // Check if the recipient is currently online (has an active socket connection)
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Emit directly to that socket so the message appears instantly
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    // If the receiver is offline, they'll see the message next time they load the chat

    res.status(201).json(newMessage); // return the saved message to the sender
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- GET CHAT PARTNERS ---
// Returns only the users the logged-in user has ALREADY exchanged messages with.
// This powers the "Chats" tab (recent conversations) in the sidebar.
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all messages where the logged-in user is either the sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    // Extract the OTHER person's ID from each message (not our own ID)
    // Set removes duplicates so each chat partner appears only once.
    // The final .filter() is a safety guard: if any old self-message exists in the DB,
    // it would add the logged-in user's own ID — this removes that edge case.
    const chatPartnerIds = [
      ...new Set(
        messages
          .map((msg) =>
            msg.senderId.toString() === loggedInUserId.toString()
              ? msg.receiverId.toString()  // we were the sender → return their ID
              : msg.senderId.toString()    // we were the receiver → return their ID
          )
          .filter((id) => id !== loggedInUserId.toString()) // never include ourselves
      ),
    ];

    // Fetch the full user objects for all chat partners
    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};