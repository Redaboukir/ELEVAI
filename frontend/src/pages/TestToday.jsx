import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function TestToday() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;
  const userId = user.id;

  const navigate = useNavigate();

  const [form, setForm] = useState({
    sommeil_h: 7,
    pas: 8000,
    sport_min: 30,
    calories: 2000,
    humeur_0_5: 3,
    stress_0_5: 2,
    fc_repos: 65
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value)
    });
  }

  async function submit() {
    try {
      await api.post(`/analysis/test/${userId}`, form);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Erreur envoi données");
    }
  }

  return (
    <>
      <style>{`
        .test {
          padding: 36px 24px;
          max-width: 620px;
          margin: 0 auto;
        }

        .test h2 {
          font-size: 24px;
          letter-spacing: 1px;
          margin-bottom: 28px;
        }

        .test-card {
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
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.25);
          background: rgba(2,6,23,0.75);
        }

        .submit-btn {
          margin-top: 24px;
          width: 100%;
          padding: 14px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.6px;
          cursor: pointer;
          box-shadow: 0 14px 35px rgba(37,99,235,0.45);
          transition: all 0.25s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 45px rgba(37,99,235,0.6);
        }

        .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 10px 22px rgba(37,99,235,0.5);
        }
      `}</style>

      <div className="test">
        <h2>🧪 Test santé – aujourd’hui</h2>

        <div className="test-card">
          {Object.keys(form).map(key => (
            <div key={key} className="field">
              <label>{key}</label>
              <input
                type="number"
                name={key}
                value={form[key]}
                onChange={handleChange}
              />
            </div>
          ))}

          <button className="submit-btn" onClick={submit}>
            ✅ Enregistrer & analyser
          </button>
        </div>
      </div>
    </>
  );
}
