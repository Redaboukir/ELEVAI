// src/services/reminderJob.js
import { getDB } from "../db.js";
import { sendReminderEmail } from "./mailer.js";

export async function sendDailyReminders() {
  const db = getDB();

  const [users] = await db.query(`
    SELECT email
    FROM users
    WHERE email IS NOT NULL
  `);

  console.log(`📧 ${users.length} emails à envoyer`);

  for (const user of users) {
    try {
      await sendReminderEmail(user.email);
      console.log(`✅ Envoyé à ${user.email}`);
    } catch (err) {
      console.error(`❌ Erreur ${user.email}`, err.message);
    }
  }
}
