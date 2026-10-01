import { motion, useReducedMotion } from 'framer-motion';

const container = {
  hidden: {},
  visible: ({ stagger = 0.06, delay = 0 } = {}) => ({ transition: { staggerChildren: stagger, delayChildren: delay } }),
};

const word = {
  hidden: { opacity: 0, y: '0.6em', filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Titulo que aparece palabra por palabra (desenfoque a enfoque).
 * Mantiene el texto completo accesible para lectores de pantalla.
 */
export default function AnimatedText({ id, text = '', as = 'h2', className, stagger = 0.06, delay = 0, immediate = false }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.h2;
  const words = String(text).split(/\s+/).filter(Boolean);

  if (reduce) {
    const Plain = as;
    return <Plain id={id} className={className}>{text}</Plain>;
  }

  const trigger = immediate ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once: true, amount: 0.6 } };

  return (
    <Tag
      id={id}
      className={className}
      aria-label={text}
      initial="hidden"
      {...trigger}
      variants={container}
      custom={{ stagger, delay }}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em' }}>
          <motion.span style={{ display: 'inline-block' }} variants={word}>
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
