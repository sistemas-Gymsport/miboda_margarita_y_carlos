import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ScheduleIcon from '../components/ScheduleIcon';
import { formatTime } from '../utils/date';
import styles from './ScheduleSection.module.css';

const ease = [0.22, 1, 0.36, 1];

/** Itinerario: linea de tiempo que se dibuja con el scroll. */
export default function ScheduleSection({ items, content }) {
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });

  if (!items?.length) return null;

  return (
    <section className={styles.section} aria-labelledby="schedule-title">
      <SectionHeading id="schedule-title" eyebrow={content.scheduleEyebrow} title={content.scheduleTitle} subtitle={content.scheduleSubtitle} />

      <div ref={listRef} className={styles.timeline}>
        <div className={styles.track} aria-hidden="true">
          <motion.div className={styles.trackFill} style={{ scaleY: progress }} />
        </div>

        <ol className={styles.list}>
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              className={`${styles.item} ${index % 2 ? styles.right : styles.left}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease }}
            >
              <motion.div
                className={styles.marker}
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.8, ease, delay: 0.15 }}
              >
                <ScheduleIcon name={item.icon} size={20} />
              </motion.div>
              <div className={styles.card}>
                <time className={styles.time}>{formatTime(item.time)}</time>
                <h3 className={styles.title}>{item.title}</h3>
                {item.description ? <p className={styles.description}>{item.description}</p> : null}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
