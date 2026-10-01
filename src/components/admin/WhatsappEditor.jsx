import { ExternalLink } from 'lucide-react';
import Field from './Field';
import Toggle from './Toggle';
import SaveBar from './SaveBar';
import { useSingletonForm } from '../../hooks/useSingletonForm';
import { adminService } from '../../services/adminService';
import { buildWhatsappUrl } from '../../utils/whatsapp';

/** Configuracion de la confirmacion de asistencia por WhatsApp con vista previa del enlace. */
export default function WhatsappEditor() {
  const { form, save, onSave } = useSingletonForm('whatsapp', adminService.updateWhatsapp);
  const { values, setField } = form;
  const url = buildWhatsappUrl({ countryCode: values.countryCode, phone: values.phone, message: values.message });

  return (
    <>
      <section className="a-card">
        <h2 className="a-card-title">Número de WhatsApp</h2>
        <Toggle label="Mostrar confirmación de asistencia" checked={values.enabled} onChange={(v) => setField('enabled', v)} />
        <div className="a-grid a-grid-3" style={{ marginTop: '0.75rem' }}>
          <Field
            label="Lada"
            prefix="+"
            inputMode="numeric"
            hint="México: 52"
            value={values.countryCode}
            onChange={(v) => setField('countryCode', v.replace(/\D/g, '').slice(0, 4))}
          />
          <Field
            className="a-span-2"
            label="Teléfono"
            type="tel"
            inputMode="numeric"
            placeholder="4421234567"
            hint="10 dígitos, sin espacios ni lada."
            value={values.phone}
            onChange={(v) => setField('phone', v.replace(/\D/g, '').slice(0, 15))}
          />
        </div>
      </section>

      <section className="a-card">
        <h2 className="a-card-title">Mensaje y textos</h2>
        <div className="a-grid">
          <Field
            label="Mensaje predeterminado"
            as="textarea"
            rows={3}
            maxLength={500}
            hint="El invitado puede escribir su nombre en la invitación y se agregará al final del mensaje."
            value={values.message}
            onChange={(v) => setField('message', v)}
          />
          <div className="a-grid a-grid-2">
            <Field label="Título de la sección" value={values.title} onChange={(v) => setField('title', v)} maxLength={120} />
            <Field label="Texto del botón" value={values.buttonText} onChange={(v) => setField('buttonText', v)} maxLength={60} />
          </div>
          <Field label="Descripción" as="textarea" rows={2} value={values.description} onChange={(v) => setField('description', v)} maxLength={600} />
          <Field label="Fecha límite (texto)" hint="Ejemplo: Antes del 31 de octubre" value={values.deadline} onChange={(v) => setField('deadline', v)} maxLength={120} />
        </div>
      </section>

      <section className="a-card">
        <h2 className="a-card-title">Enlace generado</h2>
        {url ? (
          <>
            <code style={{ display: 'block', wordBreak: 'break-all', fontSize: '0.82rem', color: 'var(--a-muted)' }}>{url}</code>
            <a className="a-btn a-btn-secondary" style={{ marginTop: '0.75rem' }} href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={15} aria-hidden="true" /> Probar en WhatsApp
            </a>
          </>
        ) : (
          <p className="a-hint">Escribe un número válido para generar el enlace.</p>
        )}
      </section>

      <SaveBar status={save.status} message={save.message} dirty={form.dirty} onSave={onSave} onReset={form.reset} />
    </>
  );
}
