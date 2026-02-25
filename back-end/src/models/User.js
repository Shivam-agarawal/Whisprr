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


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    });

const User = mongoose.model("User", userSchema);

export default User;