import { useMemo } from 'react';
import PageHeader from '../../components/admin/PageHeader';
import Field from '../../components/admin/Field';
import Toggle from '../../components/admin/Toggle';
import SaveBar from '../../components/admin/SaveBar';
import { useAdminData } from '../../hooks/useAdminData';
import { useFormState } from '../../hooks/useFormState';
import { useSaveStatus } from '../../hooks/useSaveStatus';
import { useCountdown } from '../../hooks/useCountdown';
import { adminService } from '../../services/adminService';
import { formatLongDate, formatTime } from '../../utils/date';

const COMMON_ZONES = [
  'America/Mexico_City',
  'America/Monterrey',
  'America/Cancun',
  'America/Tijuana',
  'America/Hermosillo',
  'America/Bogota',
  'America/Lima',
  'America/Santiago',
  'America/Argentina/Buenos_Aires',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/Madrid',
];

function timezoneOptions(current) {
  let all = [];
  try {
    all = Intl.supportedValuesOf('timeZone');
  } catch {
    all = [];
  }
  const rest = all.filter((z) => !COMMON_ZONES.includes(z));
  const list = [...COMMON_ZONES, ...rest];
  if (current && !list.includes(current)) list.unshift(current);
  return list.map((z) => ({ value: z, label: z.replace(/_/g, ' ') }));
}

const pickEvent = (w) => ({
  partnerOne: w.partnerOne,
  partnerTwo: w.partnerTwo,
  eventDate: w.eventDate,
  eventTime: w.eventTime,
  timezone: w.timezone,
  introEnabled: w.introEnabled,
});

export default function EventPage() {
  const { data, update } = useAdminData();
  const initial = useMemo(() => pickEvent(data.wedding), [data.wedding]);
  const form = useFormState(initial);
  const save = useSaveStatus();
  const zones = useMemo(() => timezoneOptions(data.wedding.timezone), [data.wedding.timezone]);
  const { days, hours } = useCountdown(data.wedding.weddingDate);

  const onSave = () =>
    save.run(async () => {
      const wedding = await adminService.updateWedding(form.changes);
      update('wedding', wedding);
    });

  const { values, setField } = form;

  return (
    <>
      <PageHeader title="Evento" description="Nombres, fecha, hora y zona horaria. La cuenta regresiva se actualiza automáticamente." />

      <section className="a-card">
        <h2 className="a-card-title">Los novios</h2>
        <div className="a-grid a-grid-2">
          <Field label="Primer nombre" value={values.partnerOne} onChange={(v) => setField('partnerOne', v)} maxLength={60} />
          <Field label="Segundo nombre" value={values.partnerTwo} onChange={(v) => setField('partnerTwo', v)} maxLength={60} />
        </div>
      </section>

      <section className="a-card">
        <h2 className="a-card-title">Fecha y hora</h2>
        <div className="a-grid a-grid-3">
          <Field label="Fecha" type="date" value={values.eventDate} onChange={(v) => setField('eventDate', v)} />
          <Field label="Hora" type="time" value={values.eventTime} onChange={(v) => setField('eventTime', v)} />
          <Field label="Zona horaria" as="select" options={zones} value={values.timezone} onChange={(v) => setField('timezone', v)} />
        </div>
        <p className="a-hint" style={{ marginTop: '1rem' }}>
          Guardado actualmente: {formatLongDate(data.wedding.weddingDate, data.wedding.timezone)}, {formatTime(data.wedding.eventTime)} —
          faltan {days} días y {hours} horas.
        </p>
      </section>

      <section className="a-card">
        <h2 className="a-card-title">Introducción</h2>
        <Toggle
          label="Mostrar animación de entrada"
          description="Pantalla inicial con los nombres antes de revelar la invitación."
          checked={values.introEnabled}
          onChange={(v) => setField('introEnabled', v)}
        />
      </section>

      <SaveBar status={save.status} message={save.message} dirty={form.dirty} onSave={onSave} onReset={form.reset} />
    </>
  );
}
