import { ArrowRight, Gift } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import RevealSection from '../components/RevealSection';
import ElegantButton from '../components/ElegantButton';
import styles from './GiftSection.module.css';

/** Mesa de regalos configurable. */
export default function GiftSection({ gift }) {
  if (!gift) return null;
  return (
    <section className={styles.section} aria-labelledby="gift-title">
      <RevealSection className={styles.icon} aria-hidden="true">
        <Gift size={26} strokeWidth={1.1} />
      </RevealSection>
      <SectionHeading id="gift-title" title={gift.title} />
      {gift.description ? (
        <RevealSection as="p" className={styles.description}>
          {gift.description}
        </RevealSection>
      ) : null}
      {gift.url ? (
        <RevealSection delay={0.2} className={styles.action}>
          <ElegantButton href={gift.url} icon={ArrowRight}>
            {gift.buttonText || 'Ver mesa de regalos'}
          </ElegantButton>
        </RevealSection>
      ) : null}
    </section>
  );
}
