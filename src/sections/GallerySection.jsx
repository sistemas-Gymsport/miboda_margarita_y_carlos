import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import CldImage from '../components/CldImage';
import Lightbox from '../components/Lightbox';
import { useColumnCount } from '../hooks/useColumnCount';
import styles from './GallerySection.module.css';

const ease = [0.22, 1, 0.36, 1];

const reveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 },
  visible: (column = 0) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    transition: { duration: 1.3, ease, delay: column * 0.12 },
  }),
};

/** Proporcion real de la foto (ancho / alto); 1 si Cloudinary no informo dimensiones. */
const ratioOf = (image) => (image.width && image.height ? image.width / image.height : 1);

/**
 * Reparte las fotos en columnas respetando el orden: cada foto va a la columna mas corta.
 * Asi cada imagen conserva su formato original (cuadrado, 9:16, etc.) sin recortes.
 */
function distribute(images, count) {
  const columns = Array.from({ length: count }, () => ({ height: 0, items: [] }));
  images.forEach((image, index) => {
    const target = columns.reduce((min, col) => (col.height < min.height ? col : min), columns[0]);
    target.items.push({ image, index });
    target.height += 1 / ratioOf(image);
  });
  return columns.map((col) => col.items);
}

/** Galeria tipo mosaico con revelado por mascara y visor a pantalla completa. */
export default function GallerySection({ images, content }) {
  const [active, setActive] = useState(null);
  const columnCount = useColumnCount();
  const columns = useMemo(() => distribute(images || [], columnCount), [images, columnCount]);

  if (!images?.length) return null;

  return (
    <section className={styles.section} aria-labelledby="gallery-title">
      <SectionHeading id="gallery-title" eyebrow={content.galleryEyebrow} title={content.galleryTitle} subtitle={content.gallerySubtitle} />

      <div className={styles.grid} style={{ '--columns': columnCount }}>
        {columns.map((items, columnIndex) => (
          <ul key={columnIndex} className={styles.column}>
            {items.map(({ image, index }) => (
              <motion.li
                key={image.id}
                className={styles.tile}
                style={{ aspectRatio: ratioOf(image) }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                {/* La mascara va en un hijo: el clip-path en el elemento observado impide que IntersectionObserver lo detecte. */}
                <motion.div className={styles.reveal} variants={reveal} custom={columnIndex}>
                  <button
                    type="button"
                    className={styles.open}
                    onClick={() => setActive(index)}
                    aria-label={`Ver fotografía ${index + 1}${image.alt ? `: ${image.alt}` : ''}`}
                  >
                    <CldImage
                      src={image.url}
                      alt={image.alt || `Fotografía ${index + 1} de la pareja`}
                      sizes={`(min-width: 640px) ${Math.round(100 / columnCount)}vw, 50vw`}
                      widths={[400, 700, 1000, 1400]}
                      width={1000}
                      className={styles.image}
                    />
                    <span className={styles.shade} aria-hidden="true" />
                  </button>
                </motion.div>
              </motion.li>
            ))}
          </ul>
        ))}
      </div>

      <AnimatePresence>
        {active !== null ? (
          <Lightbox images={images} index={active} onChange={setActive} onClose={() => setActive(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
