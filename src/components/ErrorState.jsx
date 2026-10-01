import { RotateCw } from 'lucide-react';
import ElegantButton from './ElegantButton';
import Ornament from './Ornament';
import styles from './ErrorState.module.css';

const DEFAULTS = {
  title: 'Estamos preparando cada detalle',
  message: 'No pudimos cargar la invitación en este momento. Inténtalo nuevamente en unos segundos.',
  button: 'Intentar nuevamente',
};

/** Pantalla de error elegante con boton para reintentar. */
export default function ErrorState({ title = DEFAULTS.title, message = DEFAULTS.message, buttonText = DEFAULTS.button, onRetry }) {
  return (
    <main className={styles.wrap} role="alert">
      <svg className={styles.rings} viewBox="0 0 120 70" aria-hidden="true">
        <circle cx="48" cy="38" r="22" />
        <circle cx="72" cy="38" r="22" />
      </svg>
      <h1 className={styles.title}>{title}</h1>
      <Ornament immediate width={140} />
      <p className={styles.message}>{message}</p>
      {onRetry ? (
        <ElegantButton icon={RotateCw} variant="outline" onClick={onRetry}>
          {buttonText}
        </ElegantButton>
      ) : null}
    </main>
  );
}
