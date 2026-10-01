import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import CldImage from '../components/CldImage';
import { getDateParts } from '../utils/date';
import styles from './HeroSection.module.css';

const ease = [0.22, 1, 0.36, 1];

/** Portada: fotografia principal con parallax, nombres y fecha. */
export default function HeroSection({ wedding, content, ready }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, reduce ? 1.06 : 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-22%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const parts = getDateParts(wedding.weddingDate, wedding.timezone);
  const image = wedding.mainImage;
  const state = ready ? 'visible' : 'hidden';

  const item = (delay) => ({
    initial: 'hidden',
    animate: state,
    variants: {
      hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.4, ease, delay } },
    },
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <motion.div className={styles.media} style={{ y: imageY, scale: imageScale }}>
        {image ? (
          <CldImage
            src={image.url}
            alt={image.alt || `${wedding.partnerOne} y ${wedding.partnerTwo}`}
            priority
            sizes="100vw"
            widths={[640, 960, 1280, 1920]}
            width={1920}
            className={styles.image}
          />
        ) : (
          <div className={styles.fallback} aria-hidden="true">
            <svg viewBox="0 0 400 400" className={styles.botanical}>
              <path d="M200 380C200 260 150 200 80 160" />
              <path d="M200 380C200 250 260 190 330 150" />
              <path d="M120 186c-30-6-52-30-56-58 30 4 52 26 56 58z" />
              <path d="M290 172c30-8 50-32 52-60-30 6-50 28-52 60z" />
              <path d="M168 230c-24-14-34-42-28-68 24 14 34 40 28 68z" />
              <path d="M236 222c22-16 30-44 22-70-22 16-30 44-22 70z" />
            </svg>
          </div>
        )}
      </motion.div>
      <div className={styles.overlay} aria-hidden="true" />

      <motion.div className={styles.content} style={{ y: contentY, opacity: contentOpacity }}>
        <motion.p className={styles.eyebrow} {...item(0.1)}>
          {content.heroEyebrow}
        </motion.p>

        <h1 id="hero-title" className={styles.names}>
          <motion.span className={styles.name} {...item(0.3)}>
            {wedding.partnerOne}
          </motion.span>
          <motion.span className={styles.amp} {...item(0.55)} aria-label="y">
            &amp;
          </motion.span>
          <motion.span className={styles.name} {...item(0.75)}>
            {wedding.partnerTwo}
          </motion.span>
        </h1>

        <motion.div className={styles.date} {...item(1.05)}>
          {content.heroDateText ? (
            <span className={styles.dateCustom}>{content.heroDateText}</span>
          ) : parts ? (
            <>
              <span>{parts.day}</span>
              <span className={styles.divider} aria-hidden="true" />
              <span>{parts.month}</span>
              <span className={styles.divider} aria-hidden="true" />
              <span>{parts.year}</span>
            </>
          ) : null}
        </motion.div>

        {content.heroSubtitle ? (
          <motion.p className={styles.subtitle} {...item(1.3)}>
            {content.heroSubtitle}
          </motion.p>
        ) : null}
      </motion.div>

      <motion.a href="#contenido" className={styles.scroll} {...item(1.7)}>
        <span>{content.heroScrollHint}</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </motion.a>
    </section>
  );
}
