import { Link, useNavigate, useLocation } from "react-router-dom";

import useApi from "../../hooks/useApi";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const { data: notifications } = useApi("/notifications", { seen: false });

  return (
    <header>
      <div className="header-title">💳 Crédit App</div>
      <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {!isAdmin && <Link to="/">Simulation</Link>}
        {!isAdmin && <Link to="/apply">Demande</Link>}
        {isAdmin && <Link to="/admin">Dashboard</Link>}
        {isAdmin && (
          <span className="badge">🔔 {notifications?.length ?? 0}</span>
        )}
        {isAdmin ? (
          <button
            className="btn ghost"
            onClick={() => {
              localStorage.removeItem("isAdmin");
              navigate("/");
            }}
          >
            Se déconnecter
          </button>
        ) : (
          pathname !== "/login" && <Link to="/login">Admin</Link>
        )}
      </nav>
    </header>
  );
}
