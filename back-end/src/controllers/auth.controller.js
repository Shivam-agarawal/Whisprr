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

// --- SIGNUP ---
// Creates a new user account with a hashed password and JWT cookie
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Make sure none of the required fields are missing
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password must be at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Basic email format check using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check the database: is this email already registered?
    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check the database: is this username already taken?
    const existingByUsername = await User.findOne({ username });
    if (existingByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password before saving — NEVER store plain text passwords!
    // bcrypt.genSalt(10) creates a random "salt" to make the hash unique
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user in memory (not saved to DB yet)
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // store the hash, not the plain password
    });

    if (newUser) {
      // Save the user to MongoDB
      const savedUser = await newUser.save();

      // Generate a JWT and set it as an httpOnly cookie in the response
      generateToken(savedUser._id, res);

      // Send back the user's public info (no password hash!)
      res.status(201).json({
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        profilePicture: savedUser.profilePicture,
      });

      // Try to send a welcome email — wrap in try/catch so a failure here
      // doesn't affect the signup response (the user is already created)
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

    // MongoDB throws error code 11000 when a unique field (email/username) already exists.
    // We turn this into a readable 400 error instead of a generic 500.
    if (error?.code === 11000) {
      const duplicatedField = Object.keys(error.keyPattern || {})[0] || "field";
      return res
        .status(400)
        .json({ message: `${duplicatedField.charAt(0).toUpperCase() + duplicatedField.slice(1)} already exists` });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// --- LOGIN ---
// Checks the user's credentials and issues a JWT cookie if correct
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Reject immediately if either field is missing
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Look up the user by their email address
    const user = await User.findOne({ email });

    // Return "Invalid credentials" for BOTH wrong email and wrong password —
    // never tell the client which one is wrong (security best practice)
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // bcrypt.compare hashes the input and checks it against the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // Credentials are correct — create a JWT cookie for this session
    generateToken(user._id, res);

    // Send back the user's public info (no password hash!)
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

// --- LOGOUT ---
// Clears the JWT cookie by setting its expiry to 0 (immediate expiry)
export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 }); // overwrite cookie with empty value + instant expiry
  res.status(200).json({ message: "Logged out successfully" });
};

// --- UPDATE PROFILE ---
// Lets the logged-in user upload a new profile picture
// req.user is attached by the protectRoute middleware (auth.middleware.js)
export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body; // expect a base64-encoded image string
    if (!profilePicture) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id; // the ID of the currently logged-in user
    console.log("[updateProfile] Uploading to Cloudinary for user:", userId);

    // Upload the base64 image to Cloudinary and get back a permanent URL
    const uploadResponse = await cloudinary.uploader.upload(profilePicture);
    console.log("[updateProfile] Cloudinary upload success, URL:", uploadResponse.secure_url);

    // Save the Cloudinary URL to the user's record in MongoDB
    // { new: true } makes findByIdAndUpdate return the UPDATED document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    ).select("-password"); // exclude password hash from the response
    console.log("[updateProfile] DB updated, profilePicture saved:", updatedUser.profilePicture);

    res.status(200).json(updatedUser); // send the updated user back to the frontend
  } catch (error) {
    console.log("[updateProfile] Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};