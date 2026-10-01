import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cldUrl } from '../utils/cloudinary';
import styles from './Lightbox.module.css';

const SWIPE = 60;

/** Visor de fotografias accesible: teclado, gestos y foco controlado. */
export default function Lightbox({ images, index, onChange, onClose }) {
  const closeRef = useRef(null);
  const image = images[index];
  const total = images.length;

  const go = useCallback((dir) => onChange((index + dir + total) % total), [index, total, onChange]);

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    document.body.classList.add('is-locked');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
      previous?.focus?.();
    };
  }, [go, onClose]);

  return (
    <motion.div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de fotografías"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      onClick={onClose}
    >
      <button ref={closeRef} type="button" className={`${styles.control} ${styles.close}`} onClick={onClose} aria-label="Cerrar visor">
        <X size={22} strokeWidth={1.3} />
      </button>

      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={image.id}
            className={styles.image}
            src={cldUrl(image.url, { width: 2400 })}
            alt={image.alt || `Fotografía ${index + 1}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE) go(1);
              else if (info.offset.x > SWIPE) go(-1);
            }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {total > 1 ? (
        <>
          <button type="button" className={`${styles.control} ${styles.prev}`} onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Fotografía anterior">
            <ChevronLeft size={26} strokeWidth={1.2} />
          </button>
          <button type="button" className={`${styles.control} ${styles.next}`} onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Fotografía siguiente">
            <ChevronRight size={26} strokeWidth={1.2} />
          </button>
          <p className={styles.counter} aria-live="polite">
            {String(index + 1).padStart(2, '0')} <span>/</span> {String(total).padStart(2, '0')}
          </p>
        </>
      ) : null}
    </motion.div>
  );
}
