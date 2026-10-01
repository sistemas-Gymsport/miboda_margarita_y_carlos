import { useMemo, useState } from 'react';
import { ExternalLink, GripVertical, MapPin, Plus, Save, Trash2 } from 'lucide-react';
import Field from './Field';
import Toggle from './Toggle';
import SaveStatus from './SaveStatus';
import SortableList from './SortableList';
import ConfirmDialog from './ConfirmDialog';
import { useFormState } from '../../hooks/useFormState';
import { useCollectionEditor } from '../../hooks/useCollectionEditor';
import { adminService } from '../../services/adminService';
import styles from './EditorList.module.css';

const TYPE_OPTIONS = [
  { value: 'CEREMONY', label: 'Ceremonia' },
  { value: 'RECEPTION', label: 'Recepción' },
  { value: 'OTHER', label: 'Otro' },
];

const KEYS = ['type', 'label', 'name', 'address', 'date', 'time', 'description', 'mapUrl', 'buttonText', 'isVisible'];

function LocationCard({ location, handleProps, onSave, onDelete, busy }) {
  const initial = useMemo(() => Object.fromEntries(KEYS.map((k) => [k, location[k]])), [location]);
  const form = useFormState(initial);
  const { values, setField } = form;
  const urlInvalid = values.mapUrl && !/^https?:\/\//i.test(values.mapUrl);

  return (
    <article className={`a-card ${styles.card}`}>
      <div className={styles.head}>
        <button type="button" className={`a-icon-btn ${styles.handle}`} {...handleProps}>
          <GripVertical size={18} />
        </button>
        <span className={styles.badge}>
          <MapPin size={17} />
        </span>
        <strong className={styles.headTitle}>
          {values.label} · {values.name}
        </strong>
        {!values.isVisible ? <span className="a-badge">Oculta</span> : null}
        <button type="button" className="a-icon-btn is-danger" onClick={onDelete} aria-label={`Eliminar ${location.name}`}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="a-grid a-grid-2">
        <Field label="Tipo" as="select" options={TYPE_OPTIONS} value={values.type} onChange={(v) => setField('type', v)} />
        <Field label="Etiqueta" hint="Ejemplo: Ceremonia, Recepción" value={values.label} onChange={(v) => setField('label', v)} maxLength={60} />
        <Field className="a-span-2" label="Nombre del lugar" value={values.name} onChange={(v) => setField('name', v)} maxLength={120} />
        <Field className="a-span-2" label="Dirección" value={values.address} onChange={(v) => setField('address', v)} maxLength={300} />
        <Field label="Fecha (texto)" hint="Ejemplo: Sábado 14 de noviembre" value={values.date} onChange={(v) => setField('date', v)} maxLength={80} />
        <Field label="Hora" type="time" value={values.time} onChange={(v) => setField('time', v)} />
        <Field className="a-span-2" label="Descripción" as="textarea" rows={3} value={values.description} onChange={(v) => setField('description', v)} maxLength={600} />
        <Field
          className="a-span-2"
          label="Enlace de Google Maps"
          type="url"
          placeholder="https://maps.app.goo.gl/..."
          hint={urlInvalid ? 'El enlace debe comenzar con https://' : 'En Google Maps: Compartir > Copiar vínculo.'}
          value={values.mapUrl}
          onChange={(v) => setField('mapUrl', v.trim())}
        />
        <Field label="Texto del botón" value={values.buttonText} onChange={(v) => setField('buttonText', v)} maxLength={40} />
        <div className="a-field" style={{ justifyContent: 'flex-end' }}>
          {values.mapUrl && !urlInvalid ? (
            <a className="a-btn a-btn-secondary" href={values.mapUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={15} aria-hidden="true" /> Probar enlace
            </a>
          ) : null}
        </div>
      </div>
      <Toggle label="Mostrar en la invitación" checked={values.isVisible} onChange={(v) => setField('isVisible', v)} />

      {form.dirty ? (
        <div className={styles.actions}>
          <button type="button" className="a-btn a-btn-ghost a-btn-sm" onClick={form.reset}>
            Descartar
          </button>
          <button type="button" className="a-btn a-btn-primary a-btn-sm" disabled={busy || urlInvalid} onClick={() => onSave(form.changes)}>
            <Save size={15} aria-hidden="true" /> Guardar
          </button>
        </div>
      ) : null}
    </article>
  );
}

/** Ubicaciones: ceremonia, recepcion y otros lugares con su enlace de mapa. */
export default function LocationEditor() {
  const editor = useCollectionEditor('locations', adminService.locations);
  const [toDelete, setToDelete] = useState(null);

  return (
    <>
      <div className={styles.toolbar}>
        <SaveStatus status={editor.status.status} message={editor.status.message} />
        <button type="button" className="a-btn a-btn-primary" onClick={() => editor.create({ type: 'OTHER', label: 'Evento', name: 'Nuevo lugar' })}>
          <Plus size={16} aria-hidden="true" /> Agregar ubicación
        </button>
      </div>

      {editor.items.length ? (
        <SortableList items={editor.items} onReorder={editor.reorder} className={styles.list}>
          {(location, handleProps) => (
            <LocationCard
              location={location}
              handleProps={handleProps}
              busy={editor.busyId === location.id}
              onSave={(changes) => editor.save(location.id, changes)}
              onDelete={() => setToDelete(location)}
            />
          )}
        </SortableList>
      ) : (
        <div className="a-empty">No hay ubicaciones. Agrega la ceremonia y la recepción.</div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar ubicación"
        message={`¿Seguro que deseas eliminar "${toDelete?.name}"?`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          editor.remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </>
  );
}
