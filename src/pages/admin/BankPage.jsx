import PageHeader from '../../components/admin/PageHeader';
import Field from '../../components/admin/Field';
import Toggle from '../../components/admin/Toggle';
import SaveBar from '../../components/admin/SaveBar';
import { useSingletonForm } from '../../hooks/useSingletonForm';
import { adminService } from '../../services/adminService';

const digits = (max) => (v) => v.replace(/\D/g, '').slice(0, max);

export default function BankPage() {
  const { form, save, onSave } = useSingletonForm('bankInfo', adminService.updateBank, {
    enabled: false,
    title: 'Datos bancarios',
    description: '',
    bankName: '',
    beneficiary: '',
    accountNumber: '',
    clabe: '',
    cardNumber: '',
  });
  const { values, setField } = form;

  return (
    <>
      <PageHeader title="Datos bancarios" description="Sección opcional. Los campos vacíos no se muestran en la invitación." />
      <section className="a-card">
        <Toggle
          label="Mostrar datos bancarios"
          description="Si está desactivado, la sección no aparece en la invitación."
          checked={values.enabled}
          onChange={(v) => setField('enabled', v)}
        />
        <div className="a-grid a-grid-2" style={{ marginTop: '0.75rem' }}>
          <Field className="a-span-2" label="Título" value={values.title} onChange={(v) => setField('title', v)} maxLength={120} />
          <Field className="a-span-2" label="Texto" as="textarea" rows={3} value={values.description} onChange={(v) => setField('description', v)} maxLength={600} />
          <Field label="Banco" value={values.bankName} onChange={(v) => setField('bankName', v)} maxLength={80} />
          <Field label="Beneficiario" value={values.beneficiary} onChange={(v) => setField('beneficiary', v)} maxLength={120} />
          <Field label="Número de cuenta" value={values.accountNumber} onChange={(v) => setField('accountNumber', v)} maxLength={40} />
          <Field label="CLABE" inputMode="numeric" hint="18 dígitos" value={values.clabe} onChange={(v) => setField('clabe', digits(18)(v))} />
          <Field label="Número de tarjeta" inputMode="numeric" value={values.cardNumber} onChange={(v) => setField('cardNumber', digits(19)(v))} />
        </div>
      </section>
      <SaveBar status={save.status} message={save.message} dirty={form.dirty} onSave={onSave} onReset={form.reset} />
    </>
  );
}
