import dns from "node:dns";
import nodemailer from "nodemailer";
import { EMAIL, APP_PASSWORD } from "../config/env.js";

// Render free often cannot reach Gmail over IPv6 (ENETUNREACH on 2607:…).
// Prefer IPv4 so smtp.gmail.com resolves to a reachable address.
dns.setDefaultResultOrder("ipv4first");

const isEmailConfigured = Boolean(EMAIL && APP_PASSWORD);
const appPassword = APP_PASSWORD?.replace(/\s+/g, "") ?? "";

let transporter = null;

if (isEmailConfigured) {
  // Explicit host/port (587 STARTTLS) instead of service:"gmail" (often 465).
  // family: 4 forces IPv4 sockets — fixes ENETUNREACH on Render free.
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: EMAIL,
      pass: appPassword,
    },
    family: 4,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
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

/** Fire-and-forget so API responses never hang on SMTP. */
function queueEmail(payload) {
  sendEmail(payload).catch((error) => {
    console.error("[email] unexpected queue error:", error?.message ?? error);
  });
}

async function verifyEmailTransport() {
  if (!isEmailConfigured) return;

  try {
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP verify timeout (15s)")), 15_000)
      ),
    ]);
    console.log("[email] SMTP connection ready");
  } catch (error) {
    console.error("[email] SMTP verification failed:", error.message);
  }
}

export { sendEmail, queueEmail, verifyEmailTransport, isEmailConfigured };
