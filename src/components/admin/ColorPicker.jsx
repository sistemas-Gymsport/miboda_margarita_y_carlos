import { useEffect, useId, useState } from 'react';
import styles from './ThemeEditor.module.css';

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Selector de color: muestra nativa + campo hexadecimal validado. */
export default function ColorPicker({ label, value, onChange }) {
  const id = useId();
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  return (
    <div className={styles.color}>
      <input
        className={styles.swatch}
        type="color"
        value={HEX.test(value) && value.length === 7 ? value : '#000000'}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        aria-label={`${label}: selector`}
      />
      <div className={styles.colorText}>
        <label htmlFor={id} className="a-label">
          {label}
        </label>
        <input
          id={id}
          className={`a-input ${styles.hex}`}
          value={text}
          maxLength={7}
          spellCheck={false}
          onChange={(e) => {
            const next = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
            setText(next);
            if (HEX.test(next)) onChange(next.toUpperCase());
          }}
          onBlur={() => setText(value)}
        />
      </div>
    </div>
  );
}
