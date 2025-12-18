import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;
  const userId = user.id;

  const navigate = useNavigate();

  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line
  }, []);

  async function loadAll() {
    try {
      setLoading(true);

      const [latestRes, historyRes] = await Promise.all([
        api.get(`/analysis/analyze/${userId}`),
        api.get(`/analysis/history/${userId}`)
      ]);

      setLatest(latestRes.data);

      setHistory(
        historyRes.data.map(h => ({
          day: new Date(h.day).toLocaleDateString("fr-FR"),
          score: Math.round(h.avg_score)
        }))
      );
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p style={{ padding: 40 }}>Chargement…</p>;
  if (!latest) return <p style={{ padding: 40 }}>Aucune donnée</p>;

  /* ===================== */
  /* RADAR DATA (SYNCHRO)  */
  /* ===================== */
  const radarData = [
    {
      metric: "Sommeil",
      value: Math.round(Math.min((latest.sommeil_h || 0) / 8 * 100, 100))
    },
    {
      metric: "Activité",
      value: Math.round(Math.min((latest.pas || 0) / 10000 * 100, 100))
    },
    {
      metric: "Sport",
      value: Math.round(Math.min((latest.sport_min || 0) / 45 * 100, 100))
    },
    {
      metric: "Humeur",
      value: Math.round(Math.min((latest.humeur_0_5 || 0) / 5 * 100, 100))
    },
    {
      metric: "Stress",
      value: Math.round(Math.max(100 - (latest.stress_0_5 || 0) / 5 * 100, 0))
    },
    {
      metric: "Cardio",
      value: Math.round(Math.max(100 - Math.abs(60 - (latest.fc_repos || 60)) * 2, 0))
    }
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h2>📊 Dashboard santé</h2>

      <button onClick={() => navigate("/test")} style={btn}>
        🧪 Faire un test aujourd’hui
      </button>

      {/* SCORE */}
      <div style={card}>
        <h3>🎯 Score du jour</h3>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h1 style={{ fontSize: 48 }}>{latest.score}</h1>

          {latest.delta_score !== 0 && (
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                background: latest.delta_score > 0 ? "#16a34a" : "#dc2626",
                color: "white",
                fontWeight: "bold"
              }}
            >
              {latest.delta_score > 0 ? "+" : ""}
              {latest.delta_score}
            </span>
          )}
        </div>

        <p>Catégorie : <strong>{latest.category}</strong></p>
        <p>🧠 Analyse ML : <strong>{latest.risk_level}</strong></p>
      </div>

      {/* COACH */}
      {latest.coach_message && (
        <div style={{ ...card, background: "#f8fafc" }}>
          <h3>🤖 Coach santé</h3>
          <p style={{ fontStyle: "italic" }}>
            “{latest.coach_message}”
          </p>
        </div>
      )}

      {/* GRAPHS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* LINE */}
        <div style={card}>
          <h3>📈 Évolution des scores</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={history}>
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RADAR */}
        <div style={card}>
          <h3>🕸️ Équilibre santé (Test du jour)</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* STYLES */
const card = {
  padding: 20,
  borderRadius: 14,
  background: "white",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  marginBottom: 24
};

const btn = {
  marginBottom: 24,
  padding: "12px 22px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  cursor: "pointer"
};
