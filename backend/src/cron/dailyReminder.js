import cron from "node-cron";
import { sendDailyReminders } from "../services/reminderJob.js";

export function startDailyReminder() {
  // ⏰ Tous les jours à 12h00
  cron.schedule("0 12 * * *", async () => {
    console.log("⏰ Cron : envoi des rappels quotidiens");

    try {
      await sendDailyReminders();
      console.log("✅ Rappels envoyés");
    } catch (err) {
      console.error("❌ Erreur cron reminder", err.message);
    }
  });
}
