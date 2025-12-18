import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;
  const userId = user.id;

  const navigate = useNavigate();

  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [forecast, setForecast] = useState([]);
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

      // 📈 HISTORIQUE (inchangé)
      setHistory(
        historyRes.data.map((h, index, arr) => {
          const score = Math.round(h.avg_score);
          const prev = index > 0 ? Math.round(arr[index - 1].avg_score) : null;

          return {
            day: new Date(h.day).toLocaleDateString("fr-FR"),
            score,
            delta: prev !== null ? score - prev : 0,
            category:
              score >= 80
                ? "Excellent"
                : score >= 60
                ? "Bon"
                : score >= 40
                ? "Moyen"
                : "À risque"
          };
        })
      );

      // 🔮 PRÉVISION FAKE (60 → 80)
      const fakeForecast = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date();
        day.setDate(day.getDate() + i + 1);

        return {
          day: day.toLocaleDateString("fr-FR"),
          score: Math.floor(60 + Math.random() * 21),
          anomaly: false
        };
      });

      setForecast(fakeForecast);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="loading">Chargement…</p>;
  if (!latest) return <p className="loading">Aucune donnée</p>;

  return (
    <>
      <style>{`
        .dashboard {
          padding: 32px 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 26px;
          margin-bottom: 28px;
          backdrop-filter: blur(14px);
        }
        .action-btn {
          padding: 14px 26px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 28px;
        }
        .score-row {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .score-value {
          font-size: 52px;
          font-weight: 800;
        }
        .delta.up { color: #22c55e; font-weight: 700; }
        .delta.down { color: #ef4444; font-weight: 700; }
        .muted { color: #94a3b8; }
        .history-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 14px;
        }
        .badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }
        .b-good { background: #22c55e; color: white; }
        .b-bad { background: #ef4444; color: white; }
        .loading {
          padding: 40px;
          text-align: center;
          color: #94a3b8;
        }
      `}</style>

      <div className="dashboard">
        <h2>📊 Dashboard santé</h2>

        <button className="action-btn" onClick={() => navigate("/test")}>
          🧪 Faire un test aujourd’hui
        </button>

        {/* SCORE */}
        <div className="card">
          <h3>🎯 Score du jour</h3>
          <div className="score-row">
            <div className="score-value">{latest.score}</div>
            {latest.delta_score !== 0 && (
              <div className={`delta ${latest.delta_score > 0 ? "up" : "down"}`}>
                {latest.delta_score > 0 ? "+" : ""}
                {latest.delta_score}
              </div>
            )}
          </div>
          <p className="muted">
            Catégorie : <strong>{latest.category}</strong>
          </p>
          <p className="muted">
            🧠 Analyse ML : <strong>{latest.risk_level}</strong>
          </p>
        </div>

        {/* COACH */}
        {latest.coach_message && (
          <div className="card">
            <h3>🤖 Coach santé</h3>
            <p style={{ fontStyle: "italic" }}>“{latest.coach_message}”</p>
          </div>
        )}

        {/* HISTORIQUE */}
        <div className="card">
          <h3>📈 Évolution réelle</h3>
          <div style={{ width: "100%", height: 280 }}>
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔮 PRÉVISION */}
        <div className="card">
          <h3>🔮 Prévision 7 jours</h3>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={forecast}>
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {forecast.map((f, i) => (
            <div key={i} className="history-row">
              <div>{f.day}</div>
              <div>{f.score}</div>
              <div>
                <span className="badge b-good">Prévision</span>
              </div>
              <div>Simulé</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
