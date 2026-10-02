import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import RevealSection from '../components/RevealSection';
import CldImage from '../components/CldImage';
import GoldLineFlower from '../components/decor/GoldLineFlower';
import styles from './StorySection.module.css';

const ease = [0.22, 1, 0.36, 1];

/** Mensaje principal con la fotografia principal en un marco de arco dorado. */
export default function StorySection({ content, image, names }) {
  const paragraphs = String(content.storyMessage || '').split(/\n+/).filter(Boolean);

  return (
    <section id="contenido" className={styles.section} aria-labelledby="story-title">
      <div className={styles.inner}>
        <SectionHeading id="story-title" eyebrow={content.storyEyebrow} title={content.storyTitle} />

        {image ? (
          <motion.figure
            className={styles.frame}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease }}
          >
            <GoldLineFlower className={styles.frameFlowerLeft} delay={0.4} />
            <GoldLineFlower className={styles.frameFlowerRight} delay={0.6} flip />
            <div className={styles.arch}>
              <CldImage
                src={image.url}
                alt={image.alt || names}
                sizes="(min-width: 640px) 22rem, 75vw"
                widths={[400, 700, 1000]}
                width={900}
                className={styles.photo}
                style={{ aspectRatio: image.width && image.height ? image.width / image.height : 3 / 4 }}
              />
            </div>
          </motion.figure>
        ) : null}

        <div className={styles.message}>
          {paragraphs.map((p, i) => (
            <RevealSection as="p" key={i} delay={i * 0.15}>
              {p}
            </RevealSection>
          ))}
        </div>

        {content.storyQuote ? (
          <RevealSection as="blockquote" className={`${styles.quote} script gold-text`} delay={0.3}>
            {content.storyQuote}
          </RevealSection>
        ) : null}
      </div>
    </section>
  );
}
