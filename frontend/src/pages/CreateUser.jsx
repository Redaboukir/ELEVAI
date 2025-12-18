import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function CreateUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    age: "",
    genre: "H",
    taille_cm: "",
    poids_kg: "",
    objectif: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/users", {
        age: Number(form.age),
        genre: form.genre,
        taille_cm: Number(form.taille_cm),
        poids_kg: Number(form.poids_kg),
        objectif: form.objectif
      });

      const userId = res.data.user_id;
      navigate(`/add-data/${userId}`);
    } catch (err) {
      setError("Erreur lors de la création du profil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Créer un profil utilisateur</h2>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Âge</label>
          <input
            type="number"
            name="age"
            required
            value={form.age}
            onChange={handleChange}
          />

          <label>Genre</label>
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
          >
            <option value="H">Homme</option>
            <option value="F">Femme</option>
          </select>

          <label>Taille (cm)</label>
          <input
            type="number"
            name="taille_cm"
            required
            value={form.taille_cm}
            onChange={handleChange}
          />

          <label>Poids (kg)</label>
          <input
            type="number"
            step="0.1"
            name="poids_kg"
            required
            value={form.poids_kg}
            onChange={handleChange}
          />

          <label>Objectif</label>
          <input
            type="text"
            name="objectif"
            required
            value={form.objectif}
            onChange={handleChange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer le profil"}
          </button>
        </form>
      </div>
    </div>
  );
}
