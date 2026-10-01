import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ElegantButton from '../components/ElegantButton';
import { formatTime } from '../utils/date';
import styles from './LocationSection.module.css';

const ease = [0.22, 1, 0.36, 1];

function LocationCard({ location, index }) {
  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease, delay: index * 0.12 }}
      aria-labelledby={`location-${location.id}`}
    >
      <span className={styles.corner} aria-hidden="true" />
      <p className={styles.label}>{location.label}</p>
      <h3 id={`location-${location.id}`} className={styles.name}>
        {location.name}
      </h3>

      {location.date || location.time ? (
        <p className={styles.when}>
          <Clock size={15} strokeWidth={1.4} aria-hidden="true" />
          <span>{[location.date, formatTime(location.time)].filter(Boolean).join(' · ')}</span>
        </p>
      ) : null}

      {location.address ? (
        <p className={styles.address}>
          <MapPin size={15} strokeWidth={1.4} aria-hidden="true" />
          <span>{location.address}</span>
        </p>
      ) : null}

      {location.description ? <p className={styles.description}>{location.description}</p> : null}

      {location.mapUrl ? (
        <ElegantButton href={location.mapUrl} icon={MapPin} variant="outline" className={styles.button} aria-label={`${location.buttonText || 'Ver ubicación'}: ${location.name}`}>
          {location.buttonText || 'Ver ubicación'}
        </ElegantButton>
      ) : null}
    </motion.article>
  );
}

/** Ceremonia, recepcion y cualquier otra ubicacion configurada. */
export default function LocationSection({ locations, content }) {
  if (!locations?.length) return null;
  return (
    <section className={styles.section} aria-labelledby="locations-title">
      <SectionHeading id="locations-title" eyebrow={content.locationsEyebrow} title={content.locationsTitle} />
      <div className={`${styles.grid} ${locations.length === 1 ? styles.single : ''}`}>
        {locations.map((location, index) => (
          <LocationCard key={location.id} location={location} index={index} />
        ))}
      </div>
    </section>
  );
}
