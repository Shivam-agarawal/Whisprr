/**
 * email.Handlers.js — Transactional Email Dispatchers
 *
 * Contains functions that compose and send specific transactional emails
 * using the Resend client. Each handler is responsible for one email type.
 *
 * Exported Functions:
 *  sendWelcomeEmail(email, name, clientURL)
 *    — Sends a branded HTML welcome email to a newly registered user.
 *    — Uses the createWelcomeEmailTemplate() from email.Templates.js.
 *    — Failures are logged but NOT re-thrown, so a broken email service
 *      will never cause a signup to fail.
 *
 * Called From:
 *  auth.controller.js → signup() → after the user is saved to the database.
 */
import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/email.Templates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Whisprr!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    return; // Don't throw - signup succeeds regardless
  }

  console.log("Welcome Email sent successfully", data);
};
