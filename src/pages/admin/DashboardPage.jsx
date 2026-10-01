import { Link } from 'react-router-dom';
import { CircleAlert, CircleCheck, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import { NAV_ITEMS } from '../../components/admin/navItems';
import { useAdminData } from '../../hooks/useAdminData';
import { useCountdown } from '../../hooks/useCountdown';
import { formatLongDate, formatTime } from '../../utils/date';
import { normalizeWhatsappNumber } from '../../utils/whatsapp';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { data } = useAdminData();
  const { wedding, gallery, schedule, locations, whatsapp, giftRegistry, bankInfo } = data;
  const { days } = useCountdown(wedding.weddingDate);

  const checklist = [
    { ok: gallery.length > 0, text: 'Sube al menos una fotografía', to: '/admin/galeria' },
    { ok: Boolean(wedding.mainImage), text: 'Elige la fotografía principal', to: '/admin/galeria' },
    { ok: Boolean(whatsapp && normalizeWhatsappNumber(whatsapp.countryCode, whatsapp.phone)), text: 'Configura el número de WhatsApp', to: '/admin/whatsapp' },
    { ok: locations.every((l) => l.mapUrl), text: 'Agrega los enlaces de Google Maps', to: '/admin/ubicaciones' },
    { ok: !giftRegistry?.enabled || Boolean(giftRegistry.url), text: 'Agrega el enlace de la mesa de regalos', to: '/admin/regalos' },
  ];
  const pending = checklist.filter((c) => !c.ok);

  const stats = [
    { label: 'Días para la boda', value: days },
    { label: 'Fotografías', value: gallery.length },
    { label: 'Momentos en itinerario', value: schedule.length },
    { label: 'Ubicaciones', value: locations.length },
  ];

  return (
    <>
      <PageHeader
        title={`${wedding.partnerOne} & ${wedding.partnerTwo}`}
        description={`${formatLongDate(wedding.weddingDate, wedding.timezone)} · ${formatTime(wedding.eventTime)}`}
        actions={
          <a className="a-btn a-btn-primary" href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} aria-hidden="true" /> Vista previa
          </a>
        }
      />

      <div className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={`a-card ${styles.stat}`}>
            <span className={styles.value}>{s.value}</span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>

      <section className="a-card" aria-labelledby="checklist-title">
        <h2 id="checklist-title" className="a-card-title">
          Lista de verificación
          {pending.length ? <span className="a-badge is-warning">{pending.length} pendientes</span> : <span className="a-badge is-success">Todo listo</span>}
        </h2>
        <ul className={styles.checklist}>
          {checklist.map((item) => (
            <li key={item.text} className={item.ok ? styles.done : ''}>
              {item.ok ? <CircleCheck size={18} aria-hidden="true" /> : <CircleAlert size={18} aria-hidden="true" />}
              {item.ok ? <span>{item.text}</span> : <Link to={item.to}>{item.text}</Link>}
            </li>
          ))}
        </ul>
        <p className="a-hint" style={{ marginTop: '0.75rem' }}>
          Datos bancarios: {bankInfo?.enabled ? 'visibles en la invitación' : 'ocultos'}.
        </p>
      </section>

      <section className="a-card" aria-labelledby="shortcuts-title">
        <h2 id="shortcuts-title" className="a-card-title">
          Accesos rápidos
        </h2>
        <div className={styles.shortcuts}>
          {NAV_ITEMS.slice(1).map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={styles.shortcut}>
              <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
