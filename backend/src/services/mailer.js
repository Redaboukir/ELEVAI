// src/services/mailer.js
import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderEmail(to) {
  await resend.emails.send({
    from: "ElevAI <onboarding@resend.dev>",
    to,
    subject: "⏰ Rappel ElevAI – Test bien-être du jour",
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>👋 Bonjour</h2>

        <p>
          C’est le moment de faire ton <strong>test bien-être ElevAI</strong>.
        </p>

        <p>⏱️ Cela prend moins de 2 minutes.</p>

        <a href="http://localhost:5173/dashboard"
           style="
             display:inline-block;
             padding:12px 20px;
             background:#2563eb;
             color:white;
             text-decoration:none;
             border-radius:8px;
             font-weight:bold;
           ">
          Faire mon test
        </a>

        <p style="margin-top:20px;color:#666;font-size:12px">
          — L’équipe ElevAI 💙
        </p>
      </div>
    `
  });
}
