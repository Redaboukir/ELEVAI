import { useState } from "react";
import { api } from "../api/api";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    email: user.email,
    age: user.age,
    genre: user.genre,
    taille_cm: user.taille_cm,
    poids_kg: user.poids_kg,
    objectif: user.objectif
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save() {
    try {
      const res = await api.put(`/users/${user.id}`, form);
      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage("Profil mis à jour ✅");
    } catch (err) {
      setMessage("Erreur mise à jour ❌");
    }
  }

  return (
    <>
      <style>{`
        .profile {
          max-width: 520px;
          padding: 32px 24px;
        }

        .profile h2 {
          font-size: 24px;
          letter-spacing: 1px;
          margin-bottom: 28px;
        }

        .profile-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(14px);
          box-shadow:
            0 20px 45px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .field {
          margin-bottom: 18px;
        }

        .field label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          letter-spacing: 0.4px;
          color: #94a3b8;
        }

        .field input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(2,6,23,0.55);
          color: #f9fafb;
          font-size: 14px;
          transition: all 0.25s ease;
        }

        .field input:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.25);
          background: rgba(2,6,23,0.75);
        }

        .save-btn {
          margin-top: 22px;
          padding: 14px 22px;
          width: 100%;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.6px;
          cursor: pointer;
          box-shadow: 0 14px 35px rgba(34,197,94,0.45);
          transition: all 0.25s ease;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 45px rgba(34,197,94,0.6);
        }

        .save-btn:active {
          transform: translateY(0);
          box-shadow: 0 10px 22px rgba(34,197,94,0.5);
        }

        .message {
          margin-top: 16px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>

      <div className="profile">
        <h2>👤 Mon profil</h2>

        <div className="profile-card">
          {Object.keys(form).map(key => (
            <div key={key} className="field">
              <label>{key}</label>
              <input
                name={key}
                value={form[key] || ""}
                onChange={handleChange}
              />
            </div>
          ))}

          <button className="save-btn" onClick={save}>
            💾 Enregistrer
          </button>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </>
  );
}
