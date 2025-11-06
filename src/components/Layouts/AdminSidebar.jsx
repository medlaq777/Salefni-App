import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="sidebar">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        Espace Administrateur
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <Link to="/admin" className={pathname === "/admin" ? "active" : ""}>
          📋 Liste des demandes
        </Link>
        <Link
          to="/admin/notifications"
          className={pathname === "/admin/notifications" ? "active" : ""}
        >
          🔔 Notifications
        </Link>
        <Link
          to="/admin/settings"
          className={pathname === "/admin/settings" ? "active" : ""}
        >
          ⚙️ Paramètres
        </Link>
      </div>
    </aside>
  );
}
