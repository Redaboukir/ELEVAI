import express from "express";
import { getDB } from "../db.js";

const router = express.Router();

router.post("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const {
      sommeil_h,
      pas,
      sport_min,
      calories,
      humeur_0_5,
      stress_0_5,
      fc_repos
    } = req.body;

    const date = new Date().toISOString().slice(0, 10);
    const db = getDB();

    console.log("🔥 INSERT daily_data", { user_id, date });

    await db.query(
      `
      INSERT INTO daily_data
      (user_id, date, sommeil_h, pas, sport_min, calories, humeur_0_5, stress_0_5, fc_repos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        sommeil_h = VALUES(sommeil_h),
        pas = VALUES(pas),
        sport_min = VALUES(sport_min),
        calories = VALUES(calories),
        humeur_0_5 = VALUES(humeur_0_5),
        stress_0_5 = VALUES(stress_0_5),
        fc_repos = VALUES(fc_repos)
      `,
      [
        user_id,
        date,
        sommeil_h,
        pas,
        sport_min,
        calories,
        humeur_0_5,
        stress_0_5,
        fc_repos
      ]
    );

    console.log("✅ daily_data OK");

    res.json({ success: true });
  } catch (err) {
    console.error("❌ ERROR /data", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
