import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import RevealSection from '../components/RevealSection';
import styles from './DressCodeSection.module.css';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.15 }, opacity: { duration: 0.2, delay: 0.2 + i * 0.15 } },
  }),
};

function Figure({ paths, label }) {
  return (
    <figure className={styles.figure}>
      <motion.svg viewBox="0 0 100 160" className={styles.svg} aria-hidden="true" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
        {paths.map((d, i) => (
          <motion.path key={d} d={d} variants={draw} custom={i} />
        ))}
      </motion.svg>
      {label ? <figcaption className={styles.caption}>{label}</figcaption> : null}
    </figure>
  );
}

// Siluetas minimalistas en linea fina
const DRESS = [
  'M42 18c2 6 14 6 16 0',
  'M42 18c-2 8-6 14-6 22h28c0-8-4-14-6-22',
  'M36 40l-2 6h32l-2-6',
  'M34 46C28 80 18 120 12 152h76C82 120 72 80 66 46',
  'M50 46v106',
];
const SUIT = [
  'M38 14h24l6 10-18 10-18-10z',
  'M32 24L20 34v116h60V34L68 24',
  'M50 34l-8 40 8 10 8-10z',
  'M50 84v66',
  'M20 34l-6 70h10',
  'M80 34l6 70H76',
];

/** Codigo de vestimenta con ilustraciones minimalistas que se dibujan. */
export default function DressCodeSection({ content }) {
  return (
    <section className={styles.section} aria-labelledby="dress-title">
      <SectionHeading id="dress-title" eyebrow={content.dressCodeEyebrow} title={content.dressCodeTitle} />

      <div className={styles.figures}>
        <Figure paths={DRESS} label={content.dressCodeWomen} />
        <span className={styles.separator} aria-hidden="true" />
        <Figure paths={SUIT} label={content.dressCodeMen} />
      </div>

      {content.dressCodeDescription ? (
        <RevealSection as="p" className={styles.description}>
          {content.dressCodeDescription}
        </RevealSection>
      ) : null}
      {content.dressCodeNote ? (
        <RevealSection as="p" className={styles.note} delay={0.15}>
          {content.dressCodeNote}
        </RevealSection>
      ) : null}
    </section>
  );
}
