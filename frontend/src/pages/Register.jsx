import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    age: "",
    genre: "",
    taille_cm: "",
    poids_kg: "",
    objectif: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <>
      <style>{`
        /* ===== RESET ===== */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        }

        body {
          background: radial-gradient(1200px 600px at 50% 0%, #0f172a, #020617);
          color: #e5e7eb;
        }

        /* ===== CONTAINER ===== */
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 24px;
        }

        /* ===== CARD ===== */
        .container form {
          width: 100%;
          max-width: 480px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.07),
            rgba(255,255,255,0.015)
          );
          backdrop-filter: blur(16px);
          border-radius: 20px;
          padding: 42px 36px;
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow:
            0 25px 50px rgba(0,0,0,0.65),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        /* ===== TITLE ===== */
        .container h2 {
          margin-bottom: 26px;
          font-size: 26px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          background: linear-gradient(90deg, #f8fafc, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ===== ERROR ===== */
        .container p {
          margin-bottom: 18px;
          font-size: 14px;
          text-align: center;
        }

        /* ===== INPUTS ===== */
        .container input {
          width: 100%;
          padding: 14px 16px;
          margin-bottom: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(2,6,23,0.55);
          color: #f9fafb;
          font-size: 14.5px;
          transition: all 0.25s ease;
        }

        .container input::placeholder {
          color: #9ca3af;
        }

        .container input:focus {
          outline: none;
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(129,140,248,0.25);
          background: rgba(2,6,23,0.75);
        }

        /* ===== BUTTON ===== */
        .container button {
          width: 100%;
          padding: 15px;
          margin-top: 10px;
          border-radius: 16px;
          border: none;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.9px;
          cursor: pointer;
          color: #020617;
          background: linear-gradient(
            135deg,
            #f8fafc,
            #c7d2fe
          );
          transition: all 0.3s ease;
          box-shadow:
            0 14px 35px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.7);
        }

        .container button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 20px 45px rgba(0,0,0,0.65),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .container button:active {
          transform: translateY(0);
          box-shadow:
            0 10px 22px rgba(0,0,0,0.5),
            inset 0 2px 6px rgba(0,0,0,0.35);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 520px) {
          .container form {
            padding: 34px 26px;
          }

          .container h2 {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="container">
        <h2>Créer un compte</h2>

        {error && <p style={{ color: "#f87171" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            name="age"
            type="number"
            placeholder="Âge"
            value={form.age}
            onChange={handleChange}
          />

          <input
            name="genre"
            placeholder="Genre"
            value={form.genre}
            onChange={handleChange}
          />

          <input
            name="taille_cm"
            type="number"
            placeholder="Taille (cm)"
            value={form.taille_cm}
            onChange={handleChange}
          />

          <input
            name="poids_kg"
            type="number"
            placeholder="Poids (kg)"
            value={form.poids_kg}
            onChange={handleChange}
          />

          <input
            name="objectif"
            placeholder="Objectif"
            value={form.objectif}
            onChange={handleChange}
          />

          <button type="submit">Créer le compte</button>
        </form>
      </div>
    </>
  );
}
