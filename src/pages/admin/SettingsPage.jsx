import { useMemo, useState } from 'react';
import { CircleAlert, CircleCheck, KeyRound } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import Field from '../../components/admin/Field';
import Toggle from '../../components/admin/Toggle';
import SaveBar from '../../components/admin/SaveBar';
import { useAdminData } from '../../hooks/useAdminData';
import { useFormState } from '../../hooks/useFormState';
import { useSaveStatus } from '../../hooks/useSaveStatus';
import { adminService, authService } from '../../services/adminService';

const SECTION_LABELS = [
  ['story', 'Mensaje principal'],
  ['countdown', 'Cuenta regresiva'],
  ['schedule', 'Itinerario'],
  ['locations', 'Ubicaciones'],
  ['gallery', 'Galería'],
  ['dressCode', 'Código de vestimenta'],
  ['gifts', 'Mesa de regalos'],
  ['rsvp', 'Confirmación por WhatsApp'],
  ['bank', 'Datos bancarios'],
  ['closing', 'Mensaje final'],
];

function PasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (next.length < 8) return setResult({ ok: false, text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
    if (next !== confirm) return setResult({ ok: false, text: 'Las contraseñas no coinciden.' });
    setSaving(true);
    try {
      await authService.changePassword(current, next);
      setResult({ ok: true, text: 'Contraseña actualizada.' });
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setResult({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  return (
    <form className="a-card" onSubmit={onSubmit}>
      <h2 className="a-card-title">Cambiar contraseña</h2>
      <div className="a-grid a-grid-3">
        <Field label="Contraseña actual" type="password" autoComplete="current-password" value={current} onChange={setCurrent} />
        <Field label="Nueva contraseña" type="password" autoComplete="new-password" value={next} onChange={setNext} />
        <Field label="Confirmar" type="password" autoComplete="new-password" value={confirm} onChange={setConfirm} />
      </div>
      {result ? (
        <div className={`a-alert ${result.ok ? '' : 'is-error'}`} role="status" style={{ marginTop: '1rem' }}>
          {result.ok ? <CircleCheck size={16} /> : <CircleAlert size={16} />} {result.text}
        </div>
      ) : null}
      <button type="submit" className="a-btn a-btn-secondary" style={{ marginTop: '1rem' }} disabled={saving || !current || !next}>
        <KeyRound size={16} aria-hidden="true" /> Actualizar contraseña
      </button>
    </form>
  );
}

export default function SettingsPage() {
  const { data, update } = useAdminData();
  const initial = useMemo(
    () => ({ seoTitle: data.wedding.seoTitle, seoDescription: data.wedding.seoDescription, sections: data.wedding.sections }),
    [data.wedding]
  );
  const form = useFormState(initial);
  const save = useSaveStatus();
  const { values, setField } = form;

  const onSave = () =>
    save.run(async () => {
      const wedding = await adminService.updateWedding(form.changes);
      update('wedding', wedding);
    });

  return (
    <>
      <PageHeader title="Configuración" description="Secciones visibles, información para compartir en redes y seguridad." />

      <section className="a-card">
        <h2 className="a-card-title">Secciones visibles</h2>
        {SECTION_LABELS.map(([key, label]) => (
          <Toggle
            key={key}
            label={label}
            checked={values.sections?.[key] !== false}
            onChange={(v) => setField('sections', { ...values.sections, [key]: v })}
          />
        ))}
      </section>

      <section className="a-card">
        <h2 className="a-card-title">Compartir en WhatsApp y redes</h2>
        <p className="a-card-desc">
          Título y descripción que aparecen al compartir el enlace. La imagen es la fotografía principal de la galería.
        </p>
        <div className="a-grid">
          <Field label="Título" value={values.seoTitle} onChange={(v) => setField('seoTitle', v)} maxLength={120} />
          <Field label="Descripción" as="textarea" rows={2} value={values.seoDescription} onChange={(v) => setField('seoDescription', v)} maxLength={300} />
        </div>
        <p className="a-hint" style={{ marginTop: '0.75rem' }}>
          Las vistas previas de WhatsApp se generan al publicar el sitio; tras cambiar estos datos vuelve a desplegar el frontend en Vercel para actualizarlas.
        </p>
      </section>

      <SaveBar status={save.status} message={save.message} dirty={form.dirty} onSave={onSave} onReset={form.reset} />

      <div style={{ marginTop: '1rem' }}>
        <PasswordForm />
      </div>
    </>
  );
}
