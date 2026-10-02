import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import FloralCorner from '../components/decor/FloralCorner';
import GoldLineFlower from '../components/decor/GoldLineFlower';
import GoldRings from '../components/decor/GoldRings';
import { getDateParts } from '../utils/date';
import { buildWhatsappUrl } from '../utils/whatsapp';
import styles from './HeroSection.module.css';

const ease = [0.22, 1, 0.36, 1];

/** 2288586706 -> 228-858-6706 */
const formatPhone = (digits) => (digits.length === 10 ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}` : digits);

/** Portada estilo invitacion impresa: marfil, oro, flores y caligrafia. */
export default function HeroSection({ wedding, content, ready, ceremony, whatsapp }) {
  const parts = getDateParts(wedding.weddingDate, wedding.timezone);
  const state = ready ? 'visible' : 'hidden';

  const item = (delay) => ({
    initial: 'hidden',
    animate: state,
    variants: {
      hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.3, ease, delay } },
    },
  });

  const line = (delay, origin) => ({
    initial: 'hidden',
    animate: state,
    style: { originX: origin },
    variants: { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.4, ease, delay } } },
  });

  const phones = whatsapp
    ? [whatsapp.phone, whatsapp.phoneSecondary]
        .filter(Boolean)
        .map((phone) => ({ phone, url: buildWhatsappUrl({ countryCode: whatsapp.countryCode, phone, message: whatsapp.message }) }))
        .filter((p) => p.url)
    : [];

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {ready ? (
        <>
          <FloralCorner corner="tl" />
          <FloralCorner corner="tr" delay={0.2} />
          <FloralCorner corner="bl" delay={0.4} />
          <FloralCorner corner="br" delay={0.6} />
        </>
      ) : null}
      <GoldLineFlower className={`${styles.sideFlower} ${styles.sideLeft}`} delay={0.6} />
      <GoldLineFlower className={`${styles.sideFlower} ${styles.sideRight}`} delay={0.9} flip />

      <div className={styles.content}>
        <GoldRings className={styles.rings} play={ready} />

        <h1 id="hero-title" className={styles.heading}>
          <motion.span className={`${styles.title} script`} {...item(0.5)}>
            {content.heroEyebrow}
          </motion.span>
          <motion.span className={`${styles.names} script gold-text gold-shimmer`} {...item(0.8)}>
            {wedding.partnerOne} <span className={styles.amp}>&amp;</span> {wedding.partnerTwo}
          </motion.span>
        </h1>

        {content.heroSubtitle ? (
          <motion.p className={styles.subtitle} {...item(1.1)}>
            {content.heroSubtitle}
          </motion.p>
        ) : null}

        {content.heroDateText ? (
          <motion.p className={styles.customDate} {...item(1.35)}>
            {content.heroDateText}
          </motion.p>
        ) : parts ? (
          <motion.div className={styles.dateBlock} {...item(1.35)}>
            <div className={styles.dateSide}>
              <motion.span className={styles.dateLine} {...line(1.5, 1)} />
              <span className={styles.dateLabel}>{parts.weekday}</span>
              <motion.span className={styles.dateLine} {...line(1.5, 1)} />
            </div>
            <div className={styles.dateCenter}>
              <span className={styles.day}>{Number(parts.day)}</span>
              <span className={styles.month}>{parts.month}</span>
            </div>
            <div className={styles.dateSide}>
              <motion.span className={styles.dateLine} {...line(1.5, 0)} />
              <span className={styles.dateLabel}>A LAS {wedding.eventTime}</span>
              <motion.span className={styles.dateLine} {...line(1.5, 0)} />
            </div>
          </motion.div>
        ) : null}

        {ceremony?.address ? (
          <motion.p className={styles.address} {...item(1.6)}>
            {ceremony.address}
          </motion.p>
        ) : null}

        {phones.length ? (
          <motion.div className={styles.confirm} {...item(1.85)}>
            <p className={styles.confirmText}>{content.heroConfirmText}</p>
            <div className={styles.pill}>
              <span className={styles.pillIcon} aria-hidden="true">
                <Phone size={16} strokeWidth={1.6} />
              </span>
              <span className={styles.pillNumbers}>
                {phones.map((p, i) => (
                  <span key={p.phone}>
                    {i > 0 ? <span className={styles.slash}>/</span> : null}
                    <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Confirmar por WhatsApp al ${formatPhone(p.phone)}`}>
                      {formatPhone(p.phone)}
                    </a>
                  </span>
                ))}
              </span>
            </div>
          </motion.div>
        ) : null}

        {content.heroClosing ? (
          <motion.p className={`${styles.closing} script gold-text`} {...item(2.1)}>
            {content.heroClosing}
          </motion.p>
        ) : null}
      </div>

      <motion.a href="#contenido" className={styles.scroll} {...item(2.5)}>
        <span>{content.heroScrollHint}</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </motion.a>
    </section>
  );
}
