import { Link } from 'react-router-dom';
import { ArrowUp, Lock } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import Ornament from '../components/Ornament';
import RevealSection from '../components/RevealSection';
import FloralCorner from '../components/decor/FloralCorner';
import GoldRings from '../components/decor/GoldRings';
import { formatLongDate } from '../utils/date';
import styles from './FooterSection.module.css';

/** Mensaje final en papel marfil con flores, anillos y los nombres en oro. */
export default function FooterSection({ wedding, content, showClosing = true }) {
  return (
    <footer className={styles.footer}>
      {showClosing ? (
        <div className={styles.closing}>
          <FloralCorner corner="tl" />
          <FloralCorner corner="tr" delay={0.2} />
          <FloralCorner corner="bl" delay={0.4} />
          <FloralCorner corner="br" delay={0.6} />

          <div className={styles.content}>
            <RevealSection as="p" className={styles.eyebrow}>
              {content.closingEyebrow}
            </RevealSection>
            <AnimatedText as="p" text={content.closingMessage} className={styles.message} />
            <Ornament className={styles.ornament} />
            <RevealSection delay={0.2}>
              <GoldRings className={styles.rings} />
            </RevealSection>
            <RevealSection as="p" className={`${styles.names} script gold-text gold-shimmer`} delay={0.35}>
              {wedding.partnerOne} &amp; {wedding.partnerTwo}
            </RevealSection>
            <RevealSection as="p" className={styles.date} delay={0.5}>
              {formatLongDate(wedding.weddingDate, wedding.timezone)}
            </RevealSection>
            {content.closingSignature ? (
              <RevealSection as="p" className={`${styles.signature} script gold-text`} delay={0.65}>
                {content.closingSignature}
              </RevealSection>
            ) : null}
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
