/** Interruptor accesible (checkbox con apariencia de switch). */
export default function Toggle({ label, description, checked, onChange, disabled }) {
  return (
    <label className="a-toggle">
      <span className="a-toggle-text">
        <strong>{label}</strong>
        {description ? <span>{description}</span> : null}
      </span>
      <span className="a-switch">
        <input type="checkbox" role="switch" checked={!!checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        <span className="a-switch-track" aria-hidden="true" />
      </span>
    </label>
  );
}
