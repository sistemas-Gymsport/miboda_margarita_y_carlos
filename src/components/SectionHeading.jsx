import AnimatedText from './AnimatedText';
import Ornament from './Ornament';
import RevealSection from './RevealSection';
import styles from './SectionHeading.module.css';

/** Encabezado comun de seccion: antetitulo, titulo animado, ornamento y subtitulo. */
export default function SectionHeading({ eyebrow, title, subtitle, id, light = false, align = 'center' }) {
  return (
    <header className={`${styles.heading} ${light ? styles.light : ''} ${align === 'left' ? styles.left : ''}`}>
      {eyebrow ? (
        <RevealSection as="p" className={styles.eyebrow}>
          {eyebrow}
        </RevealSection>
      ) : null}
      {title ? <AnimatedText id={id} text={title} as="h2" className={styles.title} /> : null}
      <Ornament className={styles.ornament} color={light ? 'currentColor' : undefined} />
      {subtitle ? (
        <RevealSection as="p" className={styles.subtitle} delay={0.2}>
          {subtitle}
        </RevealSection>
      ) : null}
    </header>
  );
}
