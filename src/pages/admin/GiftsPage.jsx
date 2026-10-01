import { ExternalLink } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import Field from '../../components/admin/Field';
import Toggle from '../../components/admin/Toggle';
import SaveBar from '../../components/admin/SaveBar';
import { useSingletonForm } from '../../hooks/useSingletonForm';
import { adminService } from '../../services/adminService';

export default function GiftsPage() {
  const { form, save, onSave } = useSingletonForm('giftRegistry', adminService.updateGifts, {
    enabled: true,
    title: 'Mesa de regalos',
    description: '',
    url: '',
    buttonText: 'Ver mesa de regalos',
  });
  const { values, setField } = form;
  const urlInvalid = values.url && !/^https?:\/\//i.test(values.url);

  return (
    <>
      <PageHeader title="Mesa de regalos" description="Enlace a la tienda o mesa de regalos. Si no hay enlace, solo se muestra el mensaje." />
      <section className="a-card">
        <Toggle label="Mostrar mesa de regalos" checked={values.enabled} onChange={(v) => setField('enabled', v)} />
        <div className="a-grid" style={{ marginTop: '0.75rem' }}>
          <Field label="Título" value={values.title} onChange={(v) => setField('title', v)} maxLength={120} />
          <Field label="Descripción" as="textarea" rows={3} value={values.description} onChange={(v) => setField('description', v)} maxLength={800} />
          <Field
            label="Enlace (URL)"
            type="url"
            placeholder="https://mesaderegalos.liverpool.com.mx/..."
            hint={urlInvalid ? 'El enlace debe comenzar con https://' : undefined}
            value={values.url}
            onChange={(v) => setField('url', v.trim())}
          />
          <Field label="Texto del botón" value={values.buttonText} onChange={(v) => setField('buttonText', v)} maxLength={60} />
          {values.url && !urlInvalid ? (
            <a className="a-btn a-btn-secondary" style={{ justifySelf: 'start' }} href={values.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={15} aria-hidden="true" /> Probar enlace
            </a>
          ) : null}
        </div>
      </section>
      <SaveBar status={save.status} message={save.message} dirty={form.dirty && !urlInvalid} onSave={onSave} onReset={form.reset} />
    </>
  );
}
