import { CircleAlert, CircleCheck, Loader } from 'lucide-react';

/** Indicador discreto: Guardando / Guardado / Error / Cambios sin guardar. */
export default function SaveStatus({ status, message, dirty }) {
  if (status === 'saving') {
    return (
      <span className="a-status is-saving" role="status">
        <Loader size={15} className="a-spin" aria-hidden="true" /> Guardando
      </span>
    );
  }
  if (status === 'saved') {
    return (
      <span className="a-status is-saved" role="status">
        <CircleCheck size={15} aria-hidden="true" /> Guardado
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="a-status is-error" role="alert">
        <CircleAlert size={15} aria-hidden="true" /> {message || 'Error al guardar'}
      </span>
    );
  }
  if (dirty) return <span className="a-status is-dirty">Cambios sin guardar</span>;
  return <span className="a-status">Todo está guardado</span>;
}
