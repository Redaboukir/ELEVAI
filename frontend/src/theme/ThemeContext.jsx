import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDark(saved === "true");
  }, []);

  function toggle() {
    localStorage.setItem("darkMode", !dark);
    setDark(!dark);
  }

  const theme = {
    dark,
    bg: dark ? "#020617" : "#f5f7fb",
    card: dark ? "rgba(255,255,255,0.06)" : "#ffffff",
    text: dark ? "#e5e7eb" : "#020617",
    muted: dark ? "#94a3b8" : "#475569",
    primary: "#2563eb",
    success: "#22c55e",
    danger: "#dc2626",
    border: dark ? "rgba(255,255,255,0.12)" : "#e5e7eb"
  };

  return (
    <>
      <style>{`
        /* ===== GLOBAL THEME RESET ===== */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: ${theme.bg};
          color: ${theme.text};
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          transition: background 0.35s ease, color 0.35s ease;
        }

        /* ===== TYPOGRAPHY ===== */
        h1, h2, h3, h4 {
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        p {
          color: ${theme.muted};
          line-height: 1.6;
        }

        /* ===== CARD SYSTEM ===== */
        .card {
          background: ${theme.card};
          border-radius: 18px;
          border: 1px solid ${theme.border};
          padding: 24px;
          box-shadow:
            0 20px 40px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          transition: all 0.3s ease;
        }

        /* ===== BUTTON BASE ===== */
        button {
          font-family: inherit;
          transition: all 0.25s ease;
        }

        /* ===== INPUT BASE ===== */
        input, select, textarea {
          font-family: inherit;
          background: transparent;
          color: inherit;
        }

        /* ===== LINKS ===== */
        a {
          color: ${theme.primary};
          text-decoration: none;
          font-weight: 500;
        }

        a:hover {
          text-decoration: underline;
        }

        /* ===== SCROLLBAR (LUXE DETAIL) ===== */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme.bg};
        }

        ::-webkit-scrollbar-thumb {
          background: ${theme.dark ? "#334155" : "#cbd5f5"};
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.primary};
        }
      `}</style>

      <ThemeContext.Provider value={{ theme, toggle }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
