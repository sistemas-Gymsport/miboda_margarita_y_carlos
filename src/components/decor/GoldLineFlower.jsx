import { useId } from 'react';
import { motion } from 'framer-motion';
import styles from './Decor.module.css';

const PATHS = [
  'M60 230 C58 190 63 150 60 96',
  'M60 170 C40 160 26 140 24 118 C42 124 56 140 60 170',
  'M60 140 C78 132 92 112 94 92 C76 98 64 116 60 140',
  'M60 96 C38 88 30 62 44 42 C50 56 56 60 60 60 C64 60 70 56 76 42 C90 62 82 88 60 96 Z',
  'M44 42 C48 30 55 24 60 22 C65 24 72 30 76 42',
  'M50 66 C54 56 66 56 70 66',
  'M60 22 C58 34 58 46 60 60',
];

/** Flor dibujada con linea dorada que se traza al entrar en pantalla. */
export default function GoldLineFlower({ className = '', delay = 0, flip = false }) {
  const id = `gl${useId().replace(/:/g, '')}`;
  return (
    <motion.svg
      viewBox="0 0 120 240"
      className={`${styles.lineFlower} ${className}`}
      style={flip ? { scaleX: -1 } : undefined}
      aria-hidden="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B8862B" />
          <stop offset="0.5" stopColor="#F2D67E" />
          <stop offset="1" stopColor="#A87A22" />
        </linearGradient>
      </defs>
      {PATHS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="1.1"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { pathLength: { duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.18 }, opacity: { duration: 0.3, delay: delay + i * 0.18 } },
            },
          }}
        />
      ))}
    </motion.svg>
  );
}
