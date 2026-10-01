import { motion } from 'framer-motion';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay }, opacity: { duration: 0.3, delay } },
  }),
};

/** Separador decorativo: dos lineas finas que se dibujan hacia un rombo central. */
export default function Ornament({ className, width = 180, color = 'var(--color-line)', immediate = false }) {
  const trigger = immediate ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once: true, amount: 0.8 } };
  return (
    <motion.svg
      className={className}
      width={width}
      viewBox="0 0 180 14"
      fill="none"
      aria-hidden="true"
      initial="hidden"
      {...trigger}
      style={{ margin: '0 auto', overflow: 'visible' }}
    >
      <motion.path d="M80 7H4" stroke={color} strokeWidth="0.8" variants={draw} custom={0.1} />
      <motion.path d="M100 7h76" stroke={color} strokeWidth="0.8" variants={draw} custom={0.1} />
      <motion.path d="M90 1.5L95.5 7 90 12.5 84.5 7z" stroke={color} strokeWidth="0.8" variants={draw} custom={0.5} />
      <motion.circle cx="2" cy="7" r="1.2" fill={color} variants={draw} custom={1.2} />
      <motion.circle cx="178" cy="7" r="1.2" fill={color} variants={draw} custom={1.2} />
    </motion.svg>
  );
}
