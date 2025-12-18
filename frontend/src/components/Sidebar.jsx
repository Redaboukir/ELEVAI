import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  function logout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <>
      <style>{`
        /* ===== SIDEBAR ===== */
        .sidebar {
          width: 220px;
          min-height: 100vh;
          padding: 22px 18px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid;
          backdrop-filter: blur(14px);
        }

        .sidebar-title {
          margin-bottom: 34px;
          font-size: 20px;
          letter-spacing: 1px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ===== BUTTONS ===== */
        .nav-btn {
          padding: 12px 16px;
          margin-bottom: 12px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          text-align: left;
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: 0.4px;
          transition: all 0.25s ease;
          box-shadow:
            0 8px 20px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .nav-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 12px 28px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }

        .nav-btn:active {
          transform: translateY(0);
          box-shadow:
            0 6px 14px rgba(0,0,0,0.3),
            inset 0 2px 6px rgba(0,0,0,0.4);
        }

        .nav-btn.danger {
          margin-top: auto;
          box-shadow:
            0 10px 30px rgba(127,29,29,0.45),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }
      `}</style>

      <aside
        className="sidebar"
        style={{
          background: theme.bg,
          color: theme.text,
          borderColor: theme.border
        }}
      >
        <h2 className="sidebar-title">
          🧠 ElevAI
        </h2>

        <NavBtn onClick={() => navigate("/profile")} theme={theme}>
          👤 Profil
        </NavBtn>

        <NavBtn onClick={() => navigate("/dashboard")} theme={theme}>
          📊 Dashboard
        </NavBtn>

        <NavBtn onClick={() => navigate("/test")} theme={theme}>
          🧪 Test du jour
        </NavBtn>

        <NavBtn onClick={toggle} theme={theme}>
          {theme.dark ? "☀️ Mode clair" : "🌙 Mode sombre"}
        </NavBtn>

        <NavBtn onClick={logout} theme={theme} danger>
          🚪 Déconnexion
        </NavBtn>
      </aside>
    </>
  );
}

function NavBtn({ children, onClick, theme, danger }) {
  return (
    <button
      onClick={onClick}
      className={`nav-btn ${danger ? "danger" : ""}`}
      style={{
        background: danger ? theme.danger : theme.primary,
        color: "white"
      }}
    >
      {children}
    </button>
  );
}
