import { useEffect, useRef } from 'react';

/** Dialogo de confirmacion para acciones irreversibles. */
export default function ConfirmDialog({ open, title, message, confirmText = 'Eliminar', onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    cancelRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="a-dialog-backdrop" onClick={onCancel}>
      <div className="a-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="a-dialog-actions">
          <button ref={cancelRef} type="button" className="a-btn a-btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="a-btn a-btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
