import { useMemo, useState } from 'react';
import { GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import Field from './Field';
import SaveStatus from './SaveStatus';
import SortableList from './SortableList';
import ConfirmDialog from './ConfirmDialog';
import ScheduleIcon, { SCHEDULE_ICONS } from '../ScheduleIcon';
import { useFormState } from '../../hooks/useFormState';
import { useCollectionEditor } from '../../hooks/useCollectionEditor';
import { adminService } from '../../services/adminService';
import styles from './EditorList.module.css';

const ICON_OPTIONS = Object.entries(SCHEDULE_ICONS).map(([value, { label }]) => ({ value, label }));

function ScheduleItemCard({ item, handleProps, onSave, onDelete, busy }) {
  const initial = useMemo(
    () => ({ title: item.title, time: item.time, description: item.description, icon: item.icon }),
    [item.title, item.time, item.description, item.icon]
  );
  const form = useFormState(initial);
  const { values, setField } = form;

  return (
    <article className={`a-card ${styles.card}`}>
      <div className={styles.head}>
        <button type="button" className={`a-icon-btn ${styles.handle}`} {...handleProps}>
          <GripVertical size={18} />
        </button>
        <span className={styles.badge}>
          <ScheduleIcon name={values.icon} size={18} />
        </span>
        <strong className={styles.headTitle}>{values.title || 'Sin título'}</strong>
        <button type="button" className="a-icon-btn is-danger" onClick={onDelete} aria-label={`Eliminar ${item.title}`}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="a-grid a-grid-3">
        <Field label="Título" value={values.title} onChange={(v) => setField('title', v)} maxLength={80} />
        <Field label="Hora" type="time" value={values.time} onChange={(v) => setField('time', v)} />
        <Field label="Icono" as="select" options={ICON_OPTIONS} value={values.icon} onChange={(v) => setField('icon', v)} />
        <Field
          className="a-span-2"
          label="Descripción"
          value={values.description}
          onChange={(v) => setField('description', v)}
          maxLength={400}
        />
      </div>

      {form.dirty ? (
        <div className={styles.actions}>
          <button type="button" className="a-btn a-btn-ghost a-btn-sm" onClick={form.reset}>
            Descartar
          </button>
          <button type="button" className="a-btn a-btn-primary a-btn-sm" disabled={busy} onClick={() => onSave(form.changes)}>
            <Save size={15} aria-hidden="true" /> Guardar
          </button>
        </div>
      ) : null}
    </article>
  );
}

/** Itinerario: crear, editar, ordenar (arrastrar) y eliminar momentos. */
export default function ScheduleEditor() {
  const editor = useCollectionEditor('schedule', adminService.schedule);
  const [toDelete, setToDelete] = useState(null);

  return (
    <>
      <div className={styles.toolbar}>
        <SaveStatus status={editor.status.status} message={editor.status.message} />
        <button type="button" className="a-btn a-btn-primary" onClick={() => editor.create({ title: 'Nuevo momento', time: '12:00', icon: 'sparkles' })}>
          <Plus size={16} aria-hidden="true" /> Agregar momento
        </button>
      </div>

      {editor.items.length ? (
        <SortableList items={editor.items} onReorder={editor.reorder} className={styles.list}>
          {(item, handleProps) => (
            <ScheduleItemCard
              item={item}
              handleProps={handleProps}
              busy={editor.busyId === item.id}
              onSave={(changes) => editor.save(item.id, changes)}
              onDelete={() => setToDelete(item)}
            />
          )}
        </SortableList>
      ) : (
        <div className="a-empty">Aún no hay momentos en el itinerario. Agrega el primero.</div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar momento"
        message={`¿Seguro que deseas eliminar "${toDelete?.title}" del itinerario?`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          editor.remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </>
  );
}
