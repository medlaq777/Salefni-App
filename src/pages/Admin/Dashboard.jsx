import { useMemo, useState } from "react";
import useApi from "../../hooks/useApi";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/finance";

export default function Dashboard() {
  const { data: apps, loading } = useApi(
    "/applications?_sort=createdAt&_order=desc"
  );
  const { data: sims } = useApi("/simulations");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("desc");

  const rows = useMemo(() => {
    const mapSim = new Map((sims || []).map((s) => [s.id, s]));
    let list = (apps || []).map((a) => ({ ...a, sim: mapSim.get(a.sim) }));
    if (status) list = list.filter((a) => a.status === status);
    if (q) {
      const x = q.toLowerCase();
      list = list.filter(
        (a) =>
          (a.fullName || "").toLowerCase().includes(x) ||
          (a.email || "").toLowerCase().includes(x)
      );
    }
    list.sort((a, b) =>
      sort === "asc"
        ? a.createdAt > b.createdAt
          ? 1
          : -1
        : a.createdAt > b.createdAt
        ? -1
        : 1
    );
    return list;
  }, [apps, sims, status, q, sort]);

  function exportCSV() {
    const header = [
      "id",
      "data",
      "nom",
      "email",
      "status",
      "montant",
      "mensualité",
    ];
    const lines = [header.join(",")];
    rows.forEach((a) => {
      const s = a.sim || {};
      lines.push(
        [
          a.id,
          a.createdAt,
          JSON.stringify(a.fullName || ""),
          a.email,
          a.status,
          s.amount || "",
          s.monthlyPayment || "",
        ].join(",")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "demandes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="card">
      <h2>Liste des demandes de crédit</h2>
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="accepted">Acceptée</option>
          <option value="rejected">Refusée</option>
        </select>
        <input
          placeholder="Recherche nom/email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="desc">Plus récentes</option>
          <option value="asc">Plus anciennes</option>
        </select>
        <button className="btn ghost" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {loading ? (
        "Chargement…"
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Demandeur</th>
              <th>Montant</th>
              <th>Mensualité</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>
                  <div style={{ display: "grid" }}>
                    <span style={{ fontWeight: 600 }}>{a.fullName}</span>
                    <span style={{ opacity: 0.8, fontSize: 12 }}>
                      {a.email}
                    </span>
                  </div>
                </td>
                <td>{a.sim ? formatMoney(a.sim.amount) : "-"}</td>
                <td>{a.sim ? formatMoney(a.sim.monthlyPayment) : "-"}</td>
                <td>
                  <span className={`status ${a.status}`}>
                    {a.status.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/applications/${a.id}`}>Ouvrir ➜</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
