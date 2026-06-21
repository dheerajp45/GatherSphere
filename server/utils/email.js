import nodemailer from "nodemailer";
import { EMAIL, APP_PASSWORD } from "../config/env.js";

const isEmailConfigured = Boolean(EMAIL && APP_PASSWORD);

let transporter = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: APP_PASSWORD,
    },
  });
} else {
  console.warn(
    "[email] EMAIL or APP_PASSWORD missing in .env — outgoing emails will be skipped"
  );
}

async function sendEmail({ to, subject, text, html }) {
  if (!isEmailConfigured) {
    console.warn(`[email] skipped (not configured): "${subject}" → ${to}`);
    return { ok: false, skipped: true };
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL,
      to,
      subject,
      text,
      ...(html ? { html } : {}),
    });
    console.log(`[email] sent "${subject}" → ${to} (${info.messageId})`);
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[email] failed "${subject}" → ${to}:`, error.message);
    return { ok: false, error: error.message };
  }
}

async function verifyEmailTransport() {
  if (!isEmailConfigured) return;

  try {
    await transporter.verify();
    console.log("[email] SMTP connection ready");
  } catch (error) {
    console.error("[email] SMTP verification failed:", error.message);
  }
}

export { sendEmail, verifyEmailTransport, isEmailConfigured };
