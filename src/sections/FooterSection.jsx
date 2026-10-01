import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUp, Lock } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import CldImage from '../components/CldImage';
import Ornament from '../components/Ornament';
import RevealSection from '../components/RevealSection';
import { formatLongDate } from '../utils/date';
import styles from './FooterSection.module.css';

/** Mensaje final con nombres, fecha y fotografia de fondo con parallax suave. */
export default function FooterSection({ wedding, content, image, showClosing = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '0%']);

  return (
    <footer ref={ref} className={styles.footer}>
      {showClosing ? (
        <div className={styles.closing}>
          {image ? (
            <motion.div className={styles.media} style={{ y }} aria-hidden="true">
              <CldImage src={image.url} alt="" sizes="100vw" widths={[640, 1080, 1600]} width={1600} className={styles.image} />
            </motion.div>
          ) : null}
          <div className={styles.overlay} aria-hidden="true" />

          <div className={styles.content}>
            <RevealSection as="p" className={styles.eyebrow}>
              {content.closingEyebrow}
            </RevealSection>
            <AnimatedText as="p" text={content.closingMessage} className={styles.message} />
            <Ornament color="currentColor" className={styles.ornament} />
            <RevealSection as="p" className={styles.signature} delay={0.2}>
              {content.closingSignature}
            </RevealSection>
            <RevealSection as="p" className={styles.names} delay={0.35}>
              {wedding.partnerOne} <span>&amp;</span> {wedding.partnerTwo}
            </RevealSection>
            <RevealSection as="p" className={styles.date} delay={0.5}>
              {formatLongDate(wedding.weddingDate, wedding.timezone)}
            </RevealSection>
          </div>
        </div>
      ) : null}

      <div className={styles.bottom}>
        <p>{content.footerNote}</p>
        <div className={styles.actions}>
          {/* Acceso discreto al panel: si ya hay sesion, /admin entra directo. */}
          <Link to="/admin" className={styles.lock} aria-label="Iniciar sesión en el panel" title="Administración">
            <Lock size={14} strokeWidth={1.4} />
          </Link>
          <a href="#top" className={styles.top} aria-label="Volver al inicio">
            <ArrowUp size={16} strokeWidth={1.4} />
          </a>
        </div>
      </div>
    </footer>
  );
}
