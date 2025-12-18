import express from "express";
import { getDB } from "../db.js";
import { computeScore } from "../services/score.js";
import { predictScoreML } from "../services/mlModel.js";
import { getOpenAI, getHealthSystemPrompt } from "../services/openai.js";
import { spawn } from "child_process";

const router = express.Router();

/* =========================================================
   📥 EXPORT DATASET (POUR LE PROF)
========================================================= */
router.get("/dataset/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const db = getDB();

    const [rows] = await db.query(
      `
      SELECT
        d.sommeil_h,
        d.pas,
        d.sport_min,
        d.calories,
        d.humeur_0_5,
        d.stress_0_5,
        d.fc_repos,
        a.score,
        a.date
      FROM daily_data d
      JOIN analysis_results a
        ON d.user_id = a.user_id
       AND d.date = a.date
      WHERE d.user_id = ?
      ORDER BY a.date ASC
      `,
      [user_id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Dataset vide" });
    }

    const headers = Object.keys(rows[0]).join(",");
    const csv =
      headers + "\n" +
      rows.map(r => Object.values(r).join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="dataset_user_${user_id}.csv"`
    );

    res.send(csv);
  } catch (err) {
    console.error("❌ dataset export error:", err);
    res.status(500).json({ error: "Erreur export dataset" });
  }
});

/* =========================================================
   🧠 TEST DU JOUR — STRICT (1 FOIS / JOUR)
========================================================= */
router.post("/test/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const d = req.body;
    const db = getDB();

    const today = new Date().toISOString().slice(0, 10);

    const [[already]] = await db.query(
      `
      SELECT id
      FROM analysis_results
      WHERE user_id = ? AND date = ?
      `,
      [user_id, today]
    );

    if (already) {
      return res.status(400).json({
        error: "Test déjà effectué aujourd’hui"
      });
    }

    let score;
    let risk_level = "Stable";

    try {
      const ml = await predictScoreML(d);
      const mlScore = Math.round(ml.score_ml);
      const ruleScore = computeScore(d);

      score = Math.round(0.6 * mlScore + 0.4 * ruleScore);

      if (ml.anomaly) {
        risk_level = "Dérive détectée par ML";
      }
    } catch {
      score = computeScore(d);
    }

    score = Math.max(0, Math.min(100, score));

    const category =
      score >= 80 ? "Excellent" :
      score >= 60 ? "Bon" :
      score >= 40 ? "Moyen" : "À risque";

    const [[last]] = await db.query(
      `
      SELECT score
      FROM analysis_results
      WHERE user_id = ?
        AND date < ?
      ORDER BY date DESC
      LIMIT 1
      `,
      [user_id, today]
    );

    const delta_score = last ? score - last.score : 0;

    let coach_message = "Continue comme ça 💪";

    const openai = getOpenAI();
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: getHealthSystemPrompt() },
            {
              role: "user",
              content: `
Sommeil: ${d.sommeil_h} h
Pas: ${d.pas}
Sport: ${d.sport_min} min
Calories: ${d.calories}
Humeur: ${d.humeur_0_5}/5
Stress: ${d.stress_0_5}/5
FC repos: ${d.fc_repos}

Score: ${score}
Évolution: ${delta_score}
Risque: ${risk_level}

Donne UN message court, motivant et utile.
`
            }
          ]
        });

        coach_message = completion.choices[0].message.content;
      } catch {
        console.log("⚠️ Coach IA fallback");
      }
    }

    await db.query(
      `
      INSERT INTO analysis_results
      (user_id, date, score, category, delta_score, risk_level, coach_message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        today,
        score,
        category,
        delta_score,
        risk_level,
        coach_message
      ]
    );

    res.json({
      score,
      delta_score,
      category,
      risk_level,
      coach_message
    });
  } catch (err) {
    console.error("❌ /analysis/test error:", err);
    res.status(500).json({ error: "Erreur analyse" });
  }
});

/* =========================================================
   📊 DERNIÈRE ANALYSE + DONNÉES TEST (FIX RADAR)
========================================================= */
router.get("/analyze/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const db = getDB();

    const [[row]] = await db.query(
      `
      SELECT
        a.*,
        d.sommeil_h,
        d.pas,
        d.sport_min,
        d.calories,
        d.humeur_0_5,
        d.stress_0_5,
        d.fc_repos
      FROM analysis_results a
      LEFT JOIN daily_data d
        ON a.user_id = d.user_id
       AND a.date = d.date
      WHERE a.user_id = ?
      ORDER BY a.date DESC
      LIMIT 1
      `,
      [user_id]
    );

    if (!row) {
      return res.json({
        score: 0,
        category: "Aucune donnée",
        delta_score: 0,
        risk_level: null,
        coach_message: null
      });
    }

    res.json(row);
  } catch (err) {
    console.error("❌ /analysis/analyze error:", err);
    res.status(500).json({ error: "Erreur analyse" });
  }
});

/* =========================================================
   📈 HISTORIQUE (GRAPHE)
========================================================= */
router.get("/history/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const db = getDB();

  const [rows] = await db.query(
    `
    SELECT
      date AS day,
      score AS avg_score
    FROM analysis_results
    WHERE user_id = ?
    ORDER BY date ASC
    `,
    [user_id]
  );

  res.json(rows);
});

export default router;
/* =========================================================
   🔮 PRÉDICTION 7 JOURS (PAR USER)
========================================================= */
router.get("/predict-next/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const db = getDB();

    // 🔹 récupérer les 7 derniers jours
    const [rows] = await db.query(
      `
      SELECT
        sommeil_h,
        pas,
        sport_min,
        calories,
        humeur_0_5,
        stress_0_5,
        fc_repos
      FROM daily_data
      WHERE user_id = ?
      ORDER BY date DESC
      LIMIT 7
      `,
      [user_id]
    );

    if (rows.length < 3) {
      return res.status(400).json({
        error: "Pas assez de données pour prédire"
      });
    }

    // 🔹 moyenne des habitudes
    const avg = rows.reduce((acc, r) => {
      Object.keys(r).forEach(k => {
        acc[k] = (acc[k] || 0) + Number(r[k]);
      });
      return acc;
    }, {});

    Object.keys(avg).forEach(k => {
      avg[k] /= rows.length;
    });

    // 🔹 appel script Python
    const py = spawn("py", ["ml/predict.py"]);
    py.stdin.write(JSON.stringify(avg));
    py.stdin.end();

    let output = "";
    py.stdout.on("data", data => {
      output += data.toString();
    });

    py.stderr.on("data", err => {
      console.error("❌ ML error:", err.toString());
    });

    py.on("close", () => {
      try {
        const result = JSON.parse(output);
        res.json(result);
      } catch {
        res.status(500).json({ error: "Erreur prédiction ML" });
      }
    });

  } catch (err) {
    console.error("❌ predict-next error:", err);
    res.status(500).json({ error: "Erreur prédiction" });
  }
});