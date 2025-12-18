import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/profile");

    } catch (err) {
      setError(err.response?.data?.error || "Erreur de connexion");
    }
  };

  return (
    <>
      <style>{`
        /* ===== RESET & BASE ===== */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        }

        body {
          background: radial-gradient(1200px 600px at 50% 0%, #111827, #05060a);
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
          max-width: 420px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.08),
            rgba(255,255,255,0.02)
          );
          backdrop-filter: blur(14px);
          border-radius: 18px;
          padding: 40px 32px;
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow:
            0 20px 40px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        /* ===== TITLE ===== */
        .container h2 {
          margin-bottom: 28px;
          font-size: 28px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          background: linear-gradient(90deg, #f9fafb, #9ca3af);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ===== ERROR ===== */
        .container p {
          margin-bottom: 16px;
          font-size: 14px;
          text-align: center;
        }

        /* ===== INPUTS ===== */
        .container input {
          width: 100%;
          padding: 14px 16px;
          margin-bottom: 18px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(0,0,0,0.4);
          color: #f9fafb;
          font-size: 15px;
          transition: all 0.25s ease;
        }

        .container input::placeholder {
          color: #9ca3af;
        }

        .container input:focus {
          outline: none;
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px rgba(167,139,250,0.25);
          background: rgba(0,0,0,0.6);
        }

        /* ===== BUTTON ===== */
        .container button {
          width: 100%;
          padding: 14px;
          margin-top: 8px;
          border-radius: 14px;
          border: none;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.8px;
          cursor: pointer;
          color: #111827;
          background: linear-gradient(
            135deg,
            #f9fafb,
            #d1d5db
          );
          transition: all 0.3s ease;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.6);
        }

        .container button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 16px 40px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.8);
        }

        .container button:active {
          transform: translateY(0);
          box-shadow:
            0 8px 20px rgba(0,0,0,0.5),
            inset 0 2px 6px rgba(0,0,0,0.4);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 480px) {
          .container form {
            padding: 32px 24px;
          }

          .container h2 {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="container">
        <h2>Connexion</h2>

        {error && <p style={{ color: "#f87171" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit">Se connecter</button>
        </form>
      </div>
    </>
  );
}
