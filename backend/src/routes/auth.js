import express from "express";
import bcrypt from "bcryptjs";
import { getDB } from "../db.js";

const router = express.Router();

/* =========================
   REGISTER
   POST /auth/register
========================= */
router.post("/register", async (req, res) => {
  try {
    const { email, password, age, genre, taille_cm, poids_kg, objectif } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const db = getDB();

    // Vérifier si l'utilisateur existe
    const [[existing]] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing) {
      return res.status(400).json({ error: "Utilisateur déjà existant" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO users
      (email, password, age, genre, taille_cm, poids_kg, objectif)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        email,
        hashedPassword,
        age || null,
        genre || null,
        taille_cm || null,
        poids_kg || null,
        objectif || null
      ]
    );

    res.json({
      user: {
        id: result.insertId,
        email
      }
    });
  } catch (err) {
    console.error("❌ REGISTER ERROR", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* =========================
   LOGIN
   POST /auth/login
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = getDB();

    const [[user]] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(400).json({ error: "Utilisateur introuvable" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
