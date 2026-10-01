import { Save } from 'lucide-react';
import SaveStatus from './SaveStatus';

/** Barra fija con estado de guardado y acciones Descartar / Guardar. */
export default function SaveBar({ status, message, dirty, onSave, onReset, label = 'Guardar cambios' }) {
  return (
    <div className="a-savebar">
      <SaveStatus status={status} message={message} dirty={dirty} />
      <div className="a-row">
        {dirty && onReset ? (
          <button type="button" className="a-btn a-btn-ghost a-btn-sm" onClick={onReset} disabled={status === 'saving'}>
            Descartar
          </button>
        ) : null}
        <button type="button" className="a-btn a-btn-primary" onClick={onSave} disabled={!dirty || status === 'saving'}>
          <Save size={16} aria-hidden="true" />
          {label}
        </button>
      </div>
    </div>
  );
}
