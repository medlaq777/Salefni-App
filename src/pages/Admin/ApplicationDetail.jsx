import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get, patch } from "../../api/client";
import { formatMoney } from "../../utils/finance";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [sim, setSim] = useState(null);
  const [note, setNote] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const a = await get(`/applications/${id}`);
      if (!mounted) return;
      setApp(a);
      const s = await get(`/simulations/${a.simulationId}`);
      if (!mounted) return;
      setSim(s);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function changeStatus(status) {
    const updated = await patch(`/applications/${id}`, { status });
    setApp(updated);
  }

  async function addNote() {
    if (!note.trim()) return;
    const notes = [
      ...(app.notes || []),
      { text: note, at: new Date().toISOString() },
    ];
    const updated = await patch(`/applications/${id}`, { notes });
    setApp(updated);
    setNote("");
  }

  async function togglePriority() {
    const updated = await patch(`/applications/${id}`, {
      priority: !app.priority,
    });
    setApp(updated);
  }

  if (!app || !sim) return <div className="card">Chargement…</div>;

  return (
    <div className="card">
      <button className="btn ghost" onClick={() => navigate(-1)}>
        ← Retour
      </button>
      <h2 style={{ marginTop: 8 }}>Demande #{app.id}</h2>

      <div className="row" style={{ marginTop: 12 }}>
        <div className="col-6">
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Demandeur</div>
            <div>{app.fullName}</div>
            <div>{app.email}</div>
            <div>{app.phone}</div>
            <div>
              Revenu mensuel: <strong>{app.monthlyIncome}</strong>
            </div>
            <div style={{ marginTop: 8 }}>
              Commentaire: {app.comment || "—"}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Simulation</div>
            <div>Type: {sim.creditTypeId}</div>
            <div>Montant: {formatMoney(sim.amount)}</div>
            <div>Durée: {sim.months} mois</div>
            <div>Mensualité: {formatMoney(sim.monthlyPayment)}</div>
            <div>TAEG: {sim.apr}%</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`status ${app.status}`}>
            {app.status.replace("_", " ")}
          </span>
          <button className="btn" onClick={() => changeStatus("in_progress")}>
            Mettre en cours
          </button>
          <button className="btn" onClick={() => changeStatus("accepted")}>
            Accepter
          </button>
          <button className="btn" onClick={() => changeStatus("rejected")}>
            Refuser
          </button>
          <button className="btn ghost" onClick={togglePriority}>
            {app.priority ? "Retirer priorité" : "Marquer prioritaire"}
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Notes internes</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Ajouter une note…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button className="btn" onClick={addNote}>
            Ajouter
          </button>
        </div>
        <ul>
          {(app.notes || [])
            .slice()
            .reverse()
            .map((n, i) => (
              <li key={i} style={{ marginTop: 6 }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {new Date(n.at).toLocaleString()}
                </div>
                <div>{n.text}</div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
