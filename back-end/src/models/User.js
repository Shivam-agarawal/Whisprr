/**
 * User.js — Mongoose User Model
 *
 * Defines the schema and model for all user accounts in Whisprr.
 *
 * Schema Fields:
 *  username        String  — Required, unique, trimmed. Displayed throughout the UI.
 *  email           String  — Required, unique, lowercased. Used for login and emails.
 *  password        String  — Required, min 6 chars. Stored as a bcrypt hash.
 *  profilePicture  String  — Cloudinary URL of the user's avatar. Defaults to "".
 *  bio             String  — Optional short bio text. Defaults to "".
 *
 * Auto-generated fields (via { timestamps: true }):
 *  createdAt, updatedAt
 *
 * Note: The password field is excluded from API responses by using
 * `.select("-password")` in the auth middleware and controllers.
 */
import mongoose from "mongoose";

// A schema defines the "shape" of documents stored in a MongoDB collection.
// Think of it like a table definition in SQL — it lists each field and its type/rules.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,  // MongoDB will reject a save() if this is missing
        unique: true,    // no two users can have the same username
        trim: true       // removes leading/trailing spaces automatically
    },
    email: {
        type: String,
        required: true,
        unique: true,        // no duplicate emails
        trim: true,
        lowercase: true      // always store email in lowercase (gmail.com vs Gmail.com = same)
    },
    password: {
        type: String,
        required: true,
        minlength: 6         // the minimum is enforced here AND in the controller
    },
    profilePicture: {
        type: String,
        default: ""          // empty string means no picture set yet
    },
    bio: {
        type: String,
        default: ""          // optional — users don't have to fill this in
    }
},
    {
        timestamps: true // Mongoose automatically adds createdAt and updatedAt to every document
    });

// Create the model from the schema (Mongoose will create a "users" collection in MongoDB)
const User = mongoose.model("User", userSchema);

export default User;