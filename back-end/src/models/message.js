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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;