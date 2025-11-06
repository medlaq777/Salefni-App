import { useEffect, useState } from "react";
import { get, patch } from "../../api/client";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    get("/settings").then(setSettings);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setSettings((s) => ({ ...s, [name]: value }));
  }

  async function save() {
    setSaving(true);
    await patch("/settings", settings);
    setSaving(false);
    alert("Paramètres enregistrés ✅");
  }
  if (!settings) return <div className="card">Chargement…</div>;

  return (
    <div className="card">
      <h2>Paramètres généraux</h2>
      <div className="row" style={{ marginTop: 12 }}>
        <div className="col-6">
          <Input
            label="Devise"
            name="currency"
            value={settings.currency}
            onChange={handleChange}
          />
        </div>
        <div className="col-6">
          <Input
            label="Nom du site"
            name="siteName"
            value={settings.siteName || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <Button onClick={save} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
}
