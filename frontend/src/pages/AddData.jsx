import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function AddData() {
  const navigate = useNavigate();

  // 🔐 Récupération utilisateur connecté
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }

  const userId = user.id;
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: today,
    sommeil_h: "",
    pas: "",
    sport_min: "",
    calories: "",
    humeur_0_5: "3",
    stress_0_5: "3",
    fc_repos: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post(`/data/${userId}`, {
  sommeil_h: Number(form.sommeil_h),
  pas: Number(form.pas),
  sport_min: Number(form.sport_min),
  calories: Number(form.calories),
  humeur_0_5: Number(form.humeur_0_5),
  stress_0_5: Number(form.stress_0_5),
  fc_repos: Number(form.fc_repos)
});


      setSuccess("Données enregistrées avec succès ✅");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Ajouter les données journalières</h2>

      <div className="card">
        <form onSubmit={handleSubmit}>

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <label>Sommeil (heures)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="24"
            name="sommeil_h"
            required
            value={form.sommeil_h}
            onChange={handleChange}
          />

          <label>Pas</label>
          <input
            type="number"
            min="0"
            name="pas"
            required
            value={form.pas}
            onChange={handleChange}
          />

          <label>Sport (minutes)</label>
          <input
            type="number"
            min="0"
            name="sport_min"
            required
            value={form.sport_min}
            onChange={handleChange}
          />

          <label>Calories</label>
          <input
            type="number"
            min="0"
            name="calories"
            required
            value={form.calories}
            onChange={handleChange}
          />

          <label>Humeur (0 à 5)</label>
          <select
            name="humeur_0_5"
            value={form.humeur_0_5}
            onChange={handleChange}
          >
            {[0,1,2,3,4,5].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          <label>Stress (0 à 5)</label>
          <select
            name="stress_0_5"
            value={form.stress_0_5}
            onChange={handleChange}
          >
            {[0,1,2,3,4,5].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          <label>Fréquence cardiaque au repos</label>
          <input
            type="number"
            min="30"
            max="200"
            name="fc_repos"
            required
            value={form.fc_repos}
            onChange={handleChange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>

        </form>
      </div>
    </div>
  );
}
