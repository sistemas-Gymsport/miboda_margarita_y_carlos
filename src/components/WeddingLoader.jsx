import styles from './WeddingLoader.module.css';

/**
 * Loader elegante y reutilizable: dos anillos minimalistas que se dibujan y se entrelazan.
 *
 * <WeddingLoader />                              en linea
 * <WeddingLoader fullscreen label="..." />       pantalla completa (carga inicial / cold start)
 * <WeddingLoader overlay label="Subiendo..." />  sobre el contenido (operaciones administrativas)
 */
export default function WeddingLoader({ label, hint, fullscreen = false, overlay = false, size = 'md', className = '' }) {
  const variant = fullscreen ? styles.fullscreen : overlay ? styles.overlay : styles.inline;

  return (
    <div className={`${styles.root} ${variant} ${styles[size] || ''} ${className}`} role="status" aria-live="polite">
      <div className={styles.mark}>
        <svg viewBox="0 0 120 84" className={styles.svg} aria-hidden="true">
          <circle className={`${styles.ring} ${styles.ringOne}`} cx="48" cy="48" r="22" pathLength="100" />
          <circle className={`${styles.ring} ${styles.ringTwo}`} cx="72" cy="48" r="22" pathLength="100" />
          <path className={styles.gem} d="M72 18.5l4 4.2-4 4.6-4-4.6z" />
          <line className={styles.line} x1="30" y1="80" x2="90" y2="80" />
        </svg>
      </div>
      {label ? <p className={styles.label}>{label}</p> : <span className="sr-only">Preparando contenido</span>}
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </div>
  );
}
