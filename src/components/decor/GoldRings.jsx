import { useId } from 'react';
import { motion } from 'framer-motion';
import styles from './Decor.module.css';

const ease = [0.22, 1, 0.36, 1];

function Ring({ cx, cy, rx, ry, rotate, gold, light }) {
  const t = `rotate(${rotate} ${cx} ${cy})`;
  return (
    <g transform={t}>
      <ellipse cx={cx} cy={cy + 3} rx={rx + 2} ry={ry + 2} fill="none" stroke="#6B4E12" strokeWidth="13" opacity="0.35" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={`url(#${gold})`} strokeWidth="12" />
      <ellipse cx={cx} cy={cy - 2} rx={rx - 4} ry={ry - 4} fill="none" stroke={light} strokeWidth="1.4" opacity="0.8" />
      <ellipse cx={cx} cy={cy + 1} rx={rx + 5.5} ry={ry + 5.5} fill="none" stroke="#8C6A1E" strokeWidth="0.8" opacity="0.6" />
    </g>
  );
}

/**
 * Dos anillos dorados entrelazados con brillo que recorre el metal.
 * play=false los deja ocultos hasta que se active la animacion.
 */
export default function GoldRings({ className = '', play = true, delay = 0 }) {
  const uid = useId().replace(/:/g, '');
  const gold = `g${uid}`;
  const shine = `sh${uid}`;
  const mask = `m${uid}`;
  const front = `f${uid}`;

  const ringA = { cx: 104, cy: 84, rx: 66, ry: 44, rotate: -9 };
  const ringB = { cx: 166, cy: 92, rx: 56, ry: 38, rotate: 8 };
  const state = play ? 'visible' : 'hidden';

  const slide = (x) => ({
    initial: 'hidden',
    animate: state,
    variants: {
      hidden: { x, y: -20, opacity: 0, rotate: x < 0 ? -12 : 12 },
      visible: { x: 0, y: 0, opacity: 1, rotate: 0, transition: { duration: 1.8, ease, delay } },
    },
  });

  return (
    <svg viewBox="0 0 260 170" className={`${styles.rings} ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7A5A17" />
          <stop offset="0.22" stopColor="#D9B24C" />
          <stop offset="0.42" stopColor="#FFF1B8" />
          <stop offset="0.58" stopColor="#C99A2E" />
          <stop offset="0.8" stopColor="#8C6A1E" />
          <stop offset="1" stopColor="#E8C766" />
        </linearGradient>
        <linearGradient id={shine} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={mask}>
          {[ringA, ringB].map((r) => (
            <ellipse key={r.cx} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} fill="none" stroke="#fff" strokeWidth="12" transform={`rotate(${r.rotate} ${r.cx} ${r.cy})`} />
          ))}
        </mask>
        {/* Zona donde el anillo A pasa por delante del B (efecto entrelazado) */}
        <clipPath id={front}>
          <rect x="150" y="30" width="36" height="34" />
        </clipPath>
      </defs>

      <motion.ellipse
        cx="135"
        cy="152"
        rx="95"
        ry="8"
        fill="#5A4210"
        opacity="0"
        animate={play ? { opacity: 0.12 } : { opacity: 0 }}
        transition={{ duration: 1.4, delay: delay + 1 }}
        style={{ filter: 'blur(6px)' }}
      />

      <motion.g {...slide(-70)}>
        <Ring {...ringA} gold={gold} light="#FFF3C4" />
      </motion.g>
      <motion.g {...slide(70)}>
        <Ring {...ringB} gold={gold} light="#FFF3C4" />
      </motion.g>
      <motion.g {...slide(-70)} clipPath={`url(#${front})`}>
        <Ring {...ringA} gold={gold} light="#FFF3C4" />
      </motion.g>

      {/* Brillo que recorre los anillos */}
      <g mask={`url(#${mask})`}>
        <motion.rect
          y="0"
          width="70"
          height="170"
          fill={`url(#${shine})`}
          initial={{ x: -90 }}
          animate={play ? { x: 300 } : { x: -90 }}
          transition={{ duration: 1.8, ease: 'easeInOut', delay: delay + 1.9, repeat: Infinity, repeatDelay: 4.5 }}
        />
      </g>
    </svg>
  );
}
