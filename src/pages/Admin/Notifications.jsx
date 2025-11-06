import useApi from "../../hooks/useApi";
import { patch } from "../../api/client";

export default function Notifications() {
  const { data: notifications, reload } = useApi(
    "/notifications?_sort=createdAt&_order=desc"
  );

  async function markAsSeen(id) {
    await patch(`/notifications/${id}`, { seen: true });
    reload();
  }

  return (
    <div className="card">
      <h2>Notifications</h2>
      {!notifications?.length && <p>Aucune notification</p>}
      <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
        {notifications?.map((n) => (
          <li
            key={n.id}
            style={{
              marginBottom: 10,
              borderBottom: "1px solid #1f2b4a",
              paddingBottom: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{n.title}</strong>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              {!n.seen && (
                <button className="btn" onClick={() => markAsSeen(n.id)}>
                  Marquer comme lue
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
