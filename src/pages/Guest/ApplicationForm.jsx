import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import useApi from "../../hooks/useApi";
import { post } from "../../api/client";
import { formatMoney } from "../../utils/finance";
import { useSettings } from "../../contexts/SettingsContext";

export default function ApplicationForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const simId = state?.simulationId;
  const { data: simulation } = useApi(simId ? `/simulations/${simId}` : null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    monthlyIncome: "",
    comment: "",
  });
  useEffect(() => {
    if (!simId) navigate("/");
  }, [simId, navigate]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit() {
    if (!simulation) return;
    const payload = {
      ...form,
      simulationId: simulation.id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await post("/applications", payload);
    alert("Votre demande a bien été envoyée ✅");
    window.print();
    navigate("/");
  }
  if (!simulation) return <div className="card">Chargement…</div>;

  return (
    <div className="card">
      <h2>Demande de crédit</h2>
      <div className="card" style={{ marginTop: 12 }}>
        <div>
          <strong>Montant:</strong>{" "}
          {formatMoney(simulation.amount, settings.currency)}
        </div>
        <div>
          <strong>Durée:</strong> {simulation.months} mois
        </div>
        <div>
          <strong>Mensualité:</strong>{" "}
          {formatMoney(simulation.monthlyPayment, settings.currency)}
        </div>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <div className="col-6">
          <Input
            label="Nom complet"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
          />
        </div>
        <div className="col-6">
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={onChange}
          />
        </div>
        <div className="col-6">
          <Input
            label="Téléphone"
            name="phone"
            value={form.phone}
            onChange={onChange}
          />
        </div>
        <div className="col-6">
          <Input
            label="Revenu mensuel"
            name="monthlyIncome"
            type="number"
            value={form.monthlyIncome}
            onChange={onChange}
          />
        </div>
        <div className="col-12">
          <textarea
            name="comment"
            value={form.comment}
            onChange={onChange}
            placeholder="Commentaire"
            rows={3}
          />
        </div>
      </div>

      <Button onClick={submit} style={{ marginTop: 12 }}>
        Envoyer la demande ✅
      </Button>
    </div>
  );
}
