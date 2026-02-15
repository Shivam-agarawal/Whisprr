import { Resend } from "resend";
import { ENV } from "./env.js";

export const resendClient = new Resend(ENV.RESEND_API_KEY);

// Force Resend sandbox when EMAIL_FROM is gmail (can't verify gmail.com)
// System env vars can override .env, so check for gmail explicitly
const rawFrom = ENV.EMAIL_FROM || "onboarding@resend.dev";
const useSandbox = rawFrom.includes("gmail.com") || rawFrom.includes("gmail.co");
export const sender = {
  email: useSandbox ? "onboarding@resend.dev" : rawFrom,
  name: ENV.EMAIL_FROM_NAME || "Whisprr",
};
