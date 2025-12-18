import express from "express";
import { getDB } from "../db.js";

const router = express.Router();

/* =====================
   CREATE USER (REGISTER)
===================== */
router.post("/", async (req, res) => {
  const { age, genre, taille_cm, poids_kg, objectif, email } = req.body;

  const db = getDB();

  const [result] = await db.query(
    `
    INSERT INTO users (email, age, genre, taille_cm, poids_kg, objectif)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [email, age, genre, taille_cm, poids_kg, objectif]
  );

  const [[user]] = await db.query(
    "SELECT * FROM users WHERE id=?",
    [result.insertId]
  );

  res.json(user);
});

/* =====================
   UPDATE PROFILE
===================== */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { age, genre, taille_cm, poids_kg, objectif } = req.body;

  const db = getDB();

  await db.query(
    `
    UPDATE users
    SET age=?, genre=?, taille_cm=?, poids_kg=?, objectif=?
    WHERE id=?
    `,
    [age, genre, taille_cm, poids_kg, objectif, id]
  );

  const [[user]] = await db.query(
    "SELECT * FROM users WHERE id=?",
    [id]
  );

  res.json(user);
});

export default router;
