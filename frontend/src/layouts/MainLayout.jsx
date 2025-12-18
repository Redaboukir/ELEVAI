import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../theme/ThemeContext";

export default function MainLayout() {
  const { theme } = useTheme();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 30, color: theme.text }}>
        <Outlet />
      </main>
    </div>
  );
}
