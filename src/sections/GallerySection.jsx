import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import CldImage from '../components/CldImage';
import Lightbox from '../components/Lightbox';
import styles from './GallerySection.module.css';

const ease = [0.22, 1, 0.36, 1];

const reveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 },
  visible: (index = 0) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    transition: { duration: 1.3, ease, delay: (index % 3) * 0.12 },
  }),
};

/** Asigna un formato editorial segun la orientacion real y la posicion de cada foto. */
function tileShape(image, index) {
  const ratio = image.width && image.height ? image.width / image.height : 1;
  if (ratio > 1.25) return index % 3 === 0 ? styles.wide : styles.landscape;
  if (ratio < 0.85) return styles.portrait;
  return index % 5 === 0 ? styles.feature : styles.square;
}

/** Galeria editorial con revelado por mascara y visor a pantalla completa. */
export default function GallerySection({ images, content }) {
  const [active, setActive] = useState(null);
  if (!images?.length) return null;

  return (
    <section className={styles.section} aria-labelledby="gallery-title">
      <SectionHeading id="gallery-title" eyebrow={content.galleryEyebrow} title={content.galleryTitle} subtitle={content.gallerySubtitle} />

      <ul className={styles.grid}>
        {images.map((image, index) => (
          <motion.li
            key={image.id}
            className={`${styles.tile} ${tileShape(image, index)}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* La mascara va en un hijo: el clip-path en el elemento observado impide que IntersectionObserver lo detecte. */}
            <motion.div className={styles.reveal} variants={reveal} custom={index}>
              <button
                type="button"
                className={styles.open}
                onClick={() => setActive(index)}
                aria-label={`Ver fotografía ${index + 1}${image.alt ? `: ${image.alt}` : ''}`}
              >
                <CldImage
                  src={image.url}
                  alt={image.alt || `Fotografía ${index + 1} de la pareja`}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  widths={[400, 700, 1000]}
                  width={1000}
                  className={styles.image}
                />
                <span className={styles.shade} aria-hidden="true" />
              </button>
            </motion.div>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {active !== null ? (
          <Lightbox images={images} index={active} onChange={setActive} onClose={() => setActive(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
