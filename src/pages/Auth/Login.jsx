import { useState } from "react";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { get } from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("admin@selefni.com");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const users = await get("/users", { email });
    const u = users.find((u) => u.email === email && u.password === password);
    if (u) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else setError("Identifiants invalides");
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Connexion Admin</h2>
      <form
        onSubmit={submit}
        style={{ display: "grid", gap: 10, marginTop: 12 }}
      >
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div style={{ color: "#ff6b6b" }}>{error}</div>}
        <Button type="submit">Se connecter</Button>
      </form>
    </div>
  );
}
