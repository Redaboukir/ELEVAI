import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import "./cron/dailyReminder.js";

import analysisRoutes from "./routes/analysis.js";
import dataRoutes from "./routes/data.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ===== ROUTES =====
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/analysis", analysisRoutes);
app.use("/data", dataRoutes);
app.use("/users", userRoutes);

// ===== INIT =====
initDB()
  .then(() => {
    console.log("✅ Base de données MySQL prête");

    app.listen(4000, () => {
      console.log("🚀 Backend lancé sur http://localhost:4000");
    });
  })
  .catch((err) => {
    console.error("❌ Erreur DB:", err);
  });
