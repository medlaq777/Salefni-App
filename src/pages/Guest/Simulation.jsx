import { useEffect, useMemo, useState } from "react";
import useApi from "../../hooks/useApi";
import { post } from "../../api/client";
import Input from "../../components/FormElements/Input";
import Select from "../../components/FormElements/Select";
import Button from "../../components/FormElements/Button";
import { summarize, formatMoney } from "../../utils/finance";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";

export default function Simulation() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { data: creditTypes } = useApi("/creditTypes");

  const [form, setForm] = useState({
    creditTypeId: "",
    amount: "",
    months: "",
    annualRate: "",
    fees: "",
    insuranceRate: "",
  });

  useEffect(() => {
    if (!form.creditTypeId && creditTypes?.length) {
      const c = creditTypes[0];
      setForm({
        creditTypeId: c.id,
        annualRate: c.defaultAnnualRate,
        months: 48,
        fees: c.defaultFees,
        insuranceRate: c.defaultInsuranceRate,
      });
    }
  }, [creditTypes, form.creditTypeId]);

  const summary = useMemo(() => {
    if (!form.amount || !form.months || !form.annualRate) return null;
    return summarize(
      Number(form.amount),
      Number(form.months),
      Number(form.annualRate),
      Number(form.fees || 0)
    );
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function saveSimulation() {
    if (!summary) return;
    const payload = {
      ...form,
      monthlyPayment: Number(summary.payment.toFixed(2)),
      totalCost: Number(summary.totalPaid.toFixed(2)),
      apr: Number(summary.apr.toFixed(2)),
      createdAt: new Date().toISOString(),
    };
    const created = await post("/simulations", payload);
    navigate("/apply", { state: { simlationId: created.id } });
  }
  return (
    <div className="card">
      <h2>Simulation de crédit</h2>
      <div className="row" style={{ marginTop: 12 }}>
        <div className="col-6">
          <Select
            label="Type de crédit"
            name="creditTypeId"
            value={form.creditTypeId}
            onChange={handleChange}
            options={
              creditTypes?.map((c) => ({ id: c.id, label: c.label })) ?? []
            }
          />
        </div>
        <div className="col-6">
          <Input
            label="Montant"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />
        </div>
        <div className="col-4">
          <Input
            label="Durée (mois)"
            name="months"
            type="number"
            value={form.months}
            onChange={handleChange}
          />
        </div>
        <div className="col-4">
          <Input
            label="Taux annuel (%)"
            name="annualRate"
            type="number"
            step="0.01"
            value={form.annualRate}
            onChange={handleChange}
          />
        </div>
        <div className="col-4">
          <Input
            label="Frais fixes"
            name="fees"
            type="number"
            value={form.fees}
            onChange={handleChange}
          />
        </div>
      </div>

      {summary && (
        <div style={{ marginTop: 16 }}>
          <div>
            <strong>Mensualité:</strong>{" "}
            {formatMoney(summary.payment, settings.currency)}
          </div>
          <div>
            <strong>Coût total:</strong>{" "}
            {formatMoney(summary.totalPaid, settings.currency)}
          </div>
          <div>
            <strong>TAEG:</strong> {summary.apr.toFixed(2)}%
          </div>
          <Button onClick={saveSimulation} style={{ marginTop: 10 }}>
            Enregistrer la simulation ➜
          </Button>
        </div>
      )}
    </div>
  );
}
