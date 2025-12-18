import mysql from "mysql2/promise";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "elevai";

let pool;

export async function initDB() {
  try {
    // Connexion sans base (pour créer la DB si besoin)
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await connection.end();

    // Pool avec base
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10
    });

    // Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        age INT NOT NULL,
        genre VARCHAR(10) NOT NULL,
        taille_cm INT NOT NULL,
        poids_kg DECIMAL(5,2) NOT NULL,
        objectif VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        sommeil_h DECIMAL(4,2) NOT NULL,
        pas INT NOT NULL,
        sport_min INT NOT NULL,
        calories INT NOT NULL,
        humeur_0_5 INT NOT NULL,
        stress_0_5 INT NOT NULL,
        fc_repos INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_user_date (user_id, date),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analysis_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        score INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        risk_prediction VARCHAR(255) NOT NULL,
        explanations JSON NOT NULL,
        recommendations JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_user_date (user_id, date),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Base de données MySQL prête");
  } catch (err) {
    console.error("❌ Erreur MySQL :", err.message);
    process.exit(1); // arrêt propre
  }
}

export function getDB() {
  console.log("🟢 DB CONNECTÉE :", process.env.DB_NAME);
  return pool;

}
