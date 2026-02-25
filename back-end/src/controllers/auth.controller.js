/**
 * auth.controller.js — Authentication Controller
 *
 * Handles all HTTP logic for user authentication endpoints:
 *
 *  signup      POST /api/auth/signup
 *              Validates input, checks for duplicate email/username, hashes
 *              the password with bcrypt, saves the new User, issues a JWT
 *              cookie via generateToken(), and sends a welcome email (Resend).
 *
 *  login       POST /api/auth/login
 *              Looks up the user by email, compares the password hash, issues
 *              a JWT cookie, and returns the public user fields.
 *
 *  logout      POST /api/auth/logout
 *              Clears the JWT cookie by setting its maxAge to 0.
 *
 *  updateProfile  PUT /api/auth/update-profile  (protected)
 *              Accepts a base64 image in req.body.profilePicture, uploads it
 *              to Cloudinary, and stores the resulting secure URL in the DB.
 *              Returns the updated user document (password excluded).
 *
 * All protected routes require the protectRoute middleware to run first,
 * which verifies the JWT and attaches req.user.
 */
import { sendWelcomeEmail } from "../emails/email.Handlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check if email is valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check for existing email
    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check for existing username (schema enforces unique username)
    const existingByUsername = await User.findOne({ username });
    if (existingByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        profilePicture: savedUser.profilePicture,
      });

      try {
        await sendWelcomeEmail(savedUser.email, savedUser.username, ENV.CLIENT_URL);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);

    // Handle Mongo duplicate key error as a readable 400 instead of 500
    if (error?.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern || {})[0] || "field";
      return res
        .status(400)
        .json({ message: `${duplicatedField.charAt(0).toUpperCase() + duplicatedField.slice(1)} already exists` });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    // never tell the client which one is incorrect: password or email

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    if (!profilePicture) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;
    console.log("[updateProfile] Uploading to Cloudinary for user:", userId);

    const uploadResponse = await cloudinary.uploader.upload(profilePicture);
    console.log("[updateProfile] Cloudinary upload success, URL:", uploadResponse.secure_url);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    ).select("-password");
    console.log("[updateProfile] DB updated, profilePicture saved:", updatedUser.profilePicture);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("[updateProfile] Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};