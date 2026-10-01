import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import RevealSection from '../components/RevealSection';
import styles from './StorySection.module.css';

const draw = {
  hidden: { pathLength: 0 },
  visible: (i) => ({ pathLength: 1, transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.25 } }),
};

/** Mensaje principal de bienvenida con ilustracion botanica abstracta que se dibuja. */
export default function StorySection({ content }) {
  const paragraphs = String(content.storyMessage || '').split(/\n+/).filter(Boolean);

  return (
    <section id="contenido" className={styles.section} aria-labelledby="story-title">
      <motion.svg
        className={styles.branch}
        viewBox="0 0 120 260"
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {[
          'M60 255C60 180 58 110 62 10',
          'M61 200c-18-6-30-22-32-42 18 4 30 20 32 42z',
          'M60 150c18-8 28-24 28-44-18 6-28 22-28 44z',
          'M61 100c-16-6-26-20-28-38 16 4 26 18 28 38z',
          'M62 55c14-6 22-18 22-34-14 6-22 18-22 34z',
        ].map((d, i) => (
          <motion.path key={d} d={d} variants={draw} custom={i} />
        ))}
      </motion.svg>

      <div className={styles.inner}>
        <SectionHeading id="story-title" eyebrow={content.storyEyebrow} title={content.storyTitle} />

        <div className={styles.message}>
          {paragraphs.map((p, i) => (
            <RevealSection as="p" key={i} delay={i * 0.15}>
              {p}
            </RevealSection>
          ))}
        </div>

        {content.storyQuote ? (
          <RevealSection as="blockquote" className={styles.quote} delay={0.3}>
            {content.storyQuote}
          </RevealSection>
        ) : null}
      </div>
    </section>
  );
}
