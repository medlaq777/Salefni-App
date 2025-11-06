import { Routes, Route, Navigate } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import Header from "./components/Layouts/Header";
import AdminSidebar from "./components/Layouts/AdminSidebar";
import Simulation from "./pages/guest/Simulation";
import ApplicationForm from "./pages/Guest/ApplicationForm";
import Dashboard from "./pages/Admin/Dashboard";
import ApplicationDetail from "./pages/Admin/ApplicationDetail";
import Login from "./pages/Auth/Login";

function ProtectRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return (
    <SettingsProvider>
      <div className="app">
        <Header />
        <div className="layout">
          {isAdmin && <AdminSidebar />}
          <main className="content">
            <Routes>
              <Route path="/" element={<Simulation />} />
              <Route path="/apply" element={<ApplicationForm />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/applications/:id"
                element={
                  <ProtectedRoute>
                    <ApplicationDetail />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </SettingsProvider>
  );
}
