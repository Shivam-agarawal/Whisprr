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

        const { MONGO_URI } = process.env;
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connecting to MongoDB... ", conn.connection.host)
    }
    catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        process.exit(1); // 1 status code indicates failure, 0 indicates success
    }
}