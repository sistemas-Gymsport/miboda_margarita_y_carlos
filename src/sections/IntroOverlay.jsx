import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './IntroOverlay.module.css';

const ease = [0.22, 1, 0.36, 1];
const AUTO_CLOSE_MS = 5200;

const reveal = (delay) => ({
  initial: { opacity: 0, y: 18, filter: 'blur(14px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.4, ease, delay } },
});

/**
 * Introduccion: nombres que pasan de desenfoque a enfoque, lineas que se dibujan
 * y una cortina que revela la invitacion. Se puede omitir con un clic o tecla.
 */
export default function IntroOverlay({ wedding, content, dateLabel, onFinish }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.classList.add('is-locked');
    const timer = setTimeout(onFinish, reduce ? 2200 : AUTO_CLOSE_MS);
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
          : { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1.25, ease: [0.76, 0, 0.24, 1] } }
      }
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div className={styles.petals} aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className={styles.petal} style={{ '--i': i }} />
        ))}
      </div>

      <motion.div
        className={styles.content}
        exit={reduce ? undefined : { y: -60, opacity: 0, transition: { duration: 0.8, ease } }}
      >
        <motion.p className={styles.eyebrow} {...reveal(0.2)}>
          {content.introEyebrow}
        </motion.p>

        <motion.span className={styles.name} {...reveal(0.5)}>
          {wedding.partnerOne}
        </motion.span>

        <div className={styles.ampersandRow} aria-hidden="true">
          <motion.span
            className={styles.line}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, transition: { duration: 1.4, ease, delay: 1 } }}
            style={{ originX: 1 }}
          />
          <motion.span className={styles.ampersand} {...reveal(0.9)}>
            &amp;
          </motion.span>
          <motion.span
            className={styles.line}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, transition: { duration: 1.4, ease, delay: 1 } }}
            style={{ originX: 0 }}
          />
        </div>

        <motion.span className={styles.name} {...reveal(1.2)}>
          {wedding.partnerTwo}
        </motion.span>

        {dateLabel ? (
          <motion.p className={styles.date} {...reveal(1.7)}>
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1, ease, delay: 2.3 } }}
          autoFocus
        >
          {content.introButton}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
