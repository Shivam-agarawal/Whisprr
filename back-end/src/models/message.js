/**
 * message.js — Mongoose Message Model
 *
 * Defines the schema and model for chat messages stored in MongoDB.
 *
 * Schema Fields:
 *  senderId    ObjectId (ref: User) — Required. The user who sent the message.
 *  receiverId  ObjectId (ref: User) — Required. The user who receives the message.
 *  text        String               — Optional. The text content (max 2000 chars).
 *  image       String               — Optional. Cloudinary URL of an attached image.
 *
 * Auto-generated fields (via { timestamps: true }):
 *  createdAt — used in the UI to display the message timestamp.
 *  updatedAt
 *
 * Either `text` or `image` must be present (validated in the controller).
 * Message history between two users is fetched using a bidirectional $or query.
 */
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // stores a reference to a User document's _id
      ref: "User",  // tells Mongoose this links to the User model (enables .populate())
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // same — a reference to the recipient's User _id
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,        // remove leading/trailing whitespace
      maxlength: 2000,   // limit message length to 2000 characters
      // not required — a message can be image-only
    },
    image: {
      type: String,
      // stores the Cloudinary CDN URL of the image (not the raw base64)
      // not required — a message can be text-only
    },
  },
  { timestamps: true } // auto-adds createdAt and updatedAt to every message
);

// Create the "Message" model from the schema (MongoDB collection: "messages")
const Message = mongoose.model("Message", messageSchema);

export default Message;