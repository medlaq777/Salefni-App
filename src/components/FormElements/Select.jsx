export default function Select({ label, options = [], ...props }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {label && <label>{label}</label>}
      <select {...props}>
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value ?? o.id ?? o} value={o.value ?? o.id ?? o}>
            {o.label ?? String(o)}
          </option>
        ))}
      </select>
    </div>
  );
}
