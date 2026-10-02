import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FloralCorner from '../components/decor/FloralCorner';
import GoldRings from '../components/decor/GoldRings';
import styles from './IntroOverlay.module.css';

const ease = [0.22, 1, 0.36, 1];
const AUTO_CLOSE_MS = 7200;

const fade = (delay) => ({
  initial: { opacity: 0, y: 14, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.4, ease, delay } },
});

// Revelado de izquierda a derecha, como si la caligrafia se escribiera.
const write = (delay, duration = 2) => ({
  initial: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 1 },
  animate: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration, ease: [0.65, 0, 0.35, 1], delay } },
});

/**
 * Introduccion inspirada en la invitacion impresa: flores que florecen en las esquinas,
 * anillos dorados que se entrelazan, "Nuestra Boda" escrito a mano y los nombres en oro.
 */
export default function IntroOverlay({ wedding, content, dateLabel, onFinish }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.classList.add('is-locked');
    const timer = setTimeout(onFinish, reduce ? 2500 : AUTO_CLOSE_MS);
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') onFinish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [onFinish, reduce]);

  return (
    <motion.div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Invitación de boda de ${wedding.partnerOne} y ${wedding.partnerTwo}`}
      onClick={onFinish}
      initial={{ opacity: 1 }}
      exit={
        reduce
          ? { opacity: 0, transition: { duration: 0.6 } }
          : { opacity: 0, scale: 1.08, filter: 'blur(6px)', transition: { duration: 1.3, ease: [0.65, 0, 0.35, 1] } }
      }
    >
      <FloralCorner corner="tl" delay={0} />
      <FloralCorner corner="tr" delay={0.25} />
      <FloralCorner corner="bl" delay={0.5} />
      <FloralCorner corner="br" delay={0.75} />

      <div className={styles.content}>
        <GoldRings className={styles.rings} delay={0.6} />

        <motion.p className={`${styles.title} script`} {...write(1.9, 1.8)}>
          {content.heroEyebrow || 'Nuestra Boda'}
        </motion.p>

        <motion.p className={`${styles.names} script gold-text gold-shimmer`} {...write(3, 2.2)}>
          {wedding.partnerOne} &amp; {wedding.partnerTwo}
        </motion.p>

        {dateLabel ? (
          <motion.p className={styles.date} {...fade(4.6)}>
            {dateLabel}
          </motion.p>
        ) : null}

        <motion.button
          type="button"
          className={styles.open}
          onClick={(e) => {
            e.stopPropagation();
            onFinish();
          }}
          {...fade(5)}
          autoFocus
        >
          {content.introButton}
        </motion.button>
      </div>

      {/* Destellos dorados flotando */}
      <div className={styles.sparkles} aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
    </motion.div>
  );
}
