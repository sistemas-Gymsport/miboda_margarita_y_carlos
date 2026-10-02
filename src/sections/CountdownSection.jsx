import { AnimatePresence, motion } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import RevealSection from '../components/RevealSection';
import ElegantButton from '../components/ElegantButton';
import FloralCorner from '../components/decor/FloralCorner';
import { useCountdown } from '../hooks/useCountdown';
import { formatLongDate, formatTime, googleCalendarUrl } from '../utils/date';
import styles from './CountdownSection.module.css';

function Unit({ value, label }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className={styles.unit}>
      <div className={styles.value} aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            initial={{ y: '-60%', opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '60%', opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

/** Cuenta regresiva basada en weddingDate (PostgreSQL). Se actualiza si el admin cambia la fecha. */
export default function CountdownSection({ wedding, content, ceremony }) {
  const { total, days, hours, minutes, seconds } = useCountdown(wedding.weddingDate);
  const names = `${wedding.partnerOne} & ${wedding.partnerTwo}`;
  const calendarUrl = googleCalendarUrl({
    title: `Boda de ${names}`,
    startIso: wedding.weddingDate,
    location: ceremony ? `${ceremony.name}, ${ceremony.address}` : '',
    details: content.heroSubtitle || '',
  });

  return (
    <section className={styles.section} aria-labelledby="countdown-title">
      <FloralCorner corner="tl" />
      <FloralCorner corner="br" delay={0.3} />
      <div className={styles.inner}>
        <SectionHeading id="countdown-title" eyebrow={content.countdownEyebrow} title={total > 0 ? content.countdownTitle : content.countdownFinished} />

        {total > 0 ? (
          <RevealSection className={styles.grid} delay={0.1}>
            <p className="sr-only" aria-live="off">
              {`${days} ${content.countdownDays}, ${hours} ${content.countdownHours}, ${minutes} ${content.countdownMinutes}`}
            </p>
            <Unit value={days} label={content.countdownDays} />
            <Unit value={hours} label={content.countdownHours} />
            <Unit value={minutes} label={content.countdownMinutes} />
            <Unit value={seconds} label={content.countdownSeconds} />
          </RevealSection>
        ) : null}

        <RevealSection className={styles.footer} delay={0.25}>
          <p className={styles.date}>{formatLongDate(wedding.weddingDate, wedding.timezone)}</p>
          <p className={styles.time}>{formatTime(wedding.eventTime)}</p>
          {calendarUrl && total > 0 ? (
            <ElegantButton href={calendarUrl} icon={CalendarPlus} variant="outline">
              Agregar al calendario
            </ElegantButton>
          ) : null}
        </RevealSection>
      </div>
    </section>
  );
}
