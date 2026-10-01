import { useId } from 'react';

/** Campo de texto con etiqueta, ayuda y soporte para textarea/select. */
export default function Field({ label, hint, as = 'input', options, prefix, className = '', value, onChange, ...rest }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const common = {
    id,
    value: value ?? '',
    onChange: (e) => onChange?.(e.target.value),
    'aria-describedby': hintId,
    ...rest,
  };

  let control;
  if (as === 'textarea') {
    control = <textarea className="a-textarea" rows={rest.rows || 4} {...common} />;
  } else if (as === 'select') {
    control = (
      <select className="a-select" {...common}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  } else {
    const input = <input className="a-input" type={rest.type || 'text'} {...common} />;
    control = prefix ? (
      <div className="a-input-group">
        <span className="a-addon">{prefix}</span>
        {input}
      </div>
    ) : (
      input
    );
  }

  return (
    <div className={`a-field ${className}`}>
      <label className="a-label" htmlFor={id}>
        {label}
      </label>
      {control}
      {hint ? (
        <span id={hintId} className="a-hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
