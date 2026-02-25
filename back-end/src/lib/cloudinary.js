/**
 * cloudinary.js — Cloudinary SDK Configuration
 *
 * Configures and exports the Cloudinary client used for uploading images.
 * Both profile pictures (/api/auth/update-profile) and chat images
 * (/api/messages/send/:id) are uploaded here before the resulting CDN URL
 * is stored in MongoDB.
 *
 * Configuration:
 *  Reads CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET
 *  from environment variables. The `cloudinary.config()` call is guarded so
 *  the app won't crash at startup if the keys are missing — uploads will simply
 *  fail at runtime.
 *
 * Usage in controllers:
 *  const uploadResponse = await cloudinary.uploader.upload(base64String);
 *  const imageUrl = uploadResponse.secure_url;
 *
 * Environment Variables Required:
 *  CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
// Package is CJS; use default import (v2 is the main API in this version)
import cloudinary from "cloudinary";
import { ENV } from "./env.js";

// Only configure Cloudinary if all three keys are present in .env
// This prevents a crash at startup if you haven't set up Cloudinary yet
if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME, // your Cloudinary account name
    api_key: ENV.CLOUDINARY_API_KEY,       // your Cloudinary API key
    api_secret: ENV.CLOUDINARY_API_SECRET, // your Cloudinary API secret (keep this private!)
  });
}

// Export the configured client — controllers import this to upload images
export default cloudinary;