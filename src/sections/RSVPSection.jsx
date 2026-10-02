import { useId, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import RevealSection from '../components/RevealSection';
import ElegantButton from '../components/ElegantButton';
import FloralCorner from '../components/decor/FloralCorner';
import { buildWhatsappUrl } from '../utils/whatsapp';
import styles from './RSVPSection.module.css';

/**
 * Confirmacion por WhatsApp. El invitado puede escribir su nombre aqui
 * (se agrega al mensaje) o completarlo directamente en WhatsApp.
 */
export default function RSVPSection({ whatsapp }) {
  const inputId = useId();
  const [name, setName] = useState('');

  const url = useMemo(() => {
    if (!whatsapp) return null;
    const base = whatsapp.message || 'Confirmo asistencia a nombre de: ';
    const message = name.trim() ? `${base.trimEnd()} ${name.trim()}` : base;
    return buildWhatsappUrl({ countryCode: whatsapp.countryCode, phone: whatsapp.phone, message });
  }, [whatsapp, name]);

  if (!whatsapp) return null;

  return (
    <section className={styles.section} aria-labelledby="rsvp-title">
      <FloralCorner corner="tr" />
      <FloralCorner corner="bl" delay={0.3} />
      <div className={styles.card}>
        <SectionHeading id="rsvp-title" title={whatsapp.title} subtitle={whatsapp.description} />

        {whatsapp.deadline ? (
          <RevealSection as="p" className={styles.deadline}>
            {whatsapp.deadline}
          </RevealSection>
        ) : null}

        {url ? (
          <RevealSection
            as="form"
            className={styles.form}
            delay={0.15}
            onSubmit={(e) => {
              e.preventDefault();
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
          >
            <label htmlFor={inputId} className={styles.label}>
              Tu nombre (opcional)
            </label>
            <input
              id={inputId}
              className={styles.input}
              type="text"
              autoComplete="name"
              maxLength={80}
              placeholder="Escribe tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <ElegantButton type="submit" icon={MessageCircle} className={styles.button}>
              {whatsapp.buttonText || 'Confirmar asistencia'}
            </ElegantButton>
          </RevealSection>
        ) : (
          <p className={styles.pending}>Muy pronto podrás confirmar tu asistencia desde aquí.</p>
        )}
      </div>
    </section>
  );
}
