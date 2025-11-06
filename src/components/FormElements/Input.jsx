export default function Input({ label, ...props }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {label && <label>{label}</label>}
      <input {...props} />
    </div>
  );
}
