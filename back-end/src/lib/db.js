/**
 * db.js — MongoDB Connection
 *
 * Exports `connectDB`, an async function that connects Mongoose to MongoDB.
 * Called once at startup inside server.js after the Express server begins listening.
 *
 * Behaviour:
 *  - Reads MONGO_URI from environment variables (throws if missing).
 *  - Logs the connected host on success.
 *  - Calls process.exit(1) on failure so the process doesn't silently run
 *    without a database connection.
 *
 * Environment Variables Required:
 *  MONGO_URI — full MongoDB connection string (e.g. mongodb+srv://...)
 */
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // Read the connection string from the .env file
        const { MONGO_URI } = process.env;

        // If MONGO_URI is not set, throw an error immediately — we can't run without a DB
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        // Connect Mongoose to MongoDB using the connection string
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Log which host we connected to (useful for debugging env issues)
        console.log("Connecting to MongoDB... ", conn.connection.host);
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);

        // Exit with code 1 (failure) — don't let the server run with no database
        process.exit(1);
    }
};