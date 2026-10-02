import { useId } from 'react';
import { motion } from 'framer-motion';
import styles from './Decor.module.css';

const ease = [0.22, 1, 0.36, 1];

// Petalo de lirio apuntando a la derecha desde el origen.
const PETAL = 'M0 0 C18 -17 64 -24 122 -5 C74 15 24 15 0 0 Z';
const VEIN = 'M8 -1 C42 -6 82 -8 116 -5';

function Lily({ x, y, scale = 1, rotate = 0, angles, delay = 0, ids }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <motion.g
        variants={{
          hidden: { scale: 0.25, rotate: -35, opacity: 0 },
          visible: { scale: 1, rotate: 0, opacity: 1, transition: { duration: 2.2, ease, delay } },
        }}
      >
        {angles.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d={PETAL} fill={`url(#${ids.petal})`} stroke="#D6CEBB" strokeWidth="0.8" />
            <path d={VEIN} fill="none" stroke="#E4DCCB" strokeWidth="0.9" />
            <path d="M14 3 C50 6 86 4 110 -1" fill="none" stroke={`url(#${ids.shade})`} strokeWidth="5" opacity="0.5" />
          </g>
        ))}
        {/* Estambres */}
        {[-30, 10, 50, 90, 130].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 0 C10 -2 22 -2 34 0" fill="none" stroke="#9C9780" strokeWidth="0.9" />
            <ellipse cx="36" cy="0" rx="3.4" ry="1.8" fill="#5F5B48" />
          </g>
        ))}
        <circle r="5" fill="#E7DFC6" />
      </motion.g>
    </g>
  );
}

/** Tallo colgante con un boton; se balancea suavemente. */
function Bud({ x, y, length, bend = 6, size = 1, delay = 0, ids }) {
  const endY = y + length;
  return (
    <motion.g
      className={styles.sway}
      style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${delay}s` }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1.4, delay: delay + 0.4 } } }}
    >
      <motion.path
        d={`M${x} ${y} C${x + bend} ${y + length * 0.4} ${x - bend} ${y + length * 0.7} ${x} ${endY}`}
        fill="none"
        stroke="#A7A38D"
        strokeWidth="1"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 1.6, ease, delay } } }}
      />
      <g transform={`translate(${x} ${endY}) scale(${size})`}>
        <path d="M-4 0 C-4 -3 4 -3 4 0 Z" fill="#6E6A55" />
        <path d="M0 0 C-7 3 -7 14 0 21 C7 14 7 3 0 0 Z" fill={`url(#${ids.bud})`} stroke="#8E8A73" strokeWidth="0.6" />
      </g>
    </motion.g>
  );
}

/**
 * Esquina floral estilo acuarela (lirios blancos, botones colgantes y hojas suaves).
 * corner: tl | tr | bl | br. Las esquinas inferiores se reflejan para que los tallos suban.
 */
export default function FloralCorner({ corner = 'tl', className = '', delay = 0 }) {
  const uid = useId().replace(/:/g, '');
  const ids = { petal: `p${uid}`, shade: `s${uid}`, bud: `b${uid}`, leaf: `l${uid}` };

  return (
    <div className={`${styles.corner} ${styles[corner]} ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 320 320"
        className={styles.cornerSvg}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <defs>
          <radialGradient id={ids.petal} cx="0.15" cy="0.5" r="0.95">
            <stop offset="0" stopColor="#F1EBDD" />
            <stop offset="0.35" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F4EFE4" />
          </radialGradient>
          <linearGradient id={ids.shade} x1="0" x2="1">
            <stop offset="0" stopColor="#D9D2C0" stopOpacity="0.9" />
            <stop offset="1" stopColor="#D9D2C0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={ids.bud} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7E7A63" />
            <stop offset="1" stopColor="#D2CDB6" />
          </linearGradient>
          <linearGradient id={ids.leaf} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#BDB9A3" stopOpacity="0.75" />
            <stop offset="1" stopColor="#E3E0D2" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Hojas en acuarela */}
        <motion.g variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 2, delay } } }}>
          <path d="M20 150 C60 140 110 160 150 210 C100 205 50 185 20 150 Z" fill={`url(#${ids.leaf})`} />
          <path d="M150 20 C150 70 175 115 230 140 C215 95 190 50 150 20 Z" fill={`url(#${ids.leaf})`} />
          <path d="M90 120 C130 110 160 130 190 165" fill="none" stroke="#C9C5B1" strokeWidth="0.8" />
        </motion.g>

        <Bud x={150} y={18} length={95} bend={8} delay={delay + 0.6} ids={ids} />
        <Bud x={198} y={26} length={70} bend={-6} size={0.85} delay={delay + 0.9} ids={ids} />
        <Bud x={238} y={14} length={118} bend={7} size={0.9} delay={delay + 1.1} ids={ids} />
        <Bud x={112} y={138} length={64} bend={-5} size={0.8} delay={delay + 1.3} ids={ids} />
        <Bud x={60} y={150} length={92} bend={6} delay={delay + 1} ids={ids} />

        <Lily x={70} y={64} scale={1.05} angles={[-12, 42, 96, 150, 204, 258, 312]} delay={delay} ids={ids} />
        <Lily x={205} y={60} scale={0.5} rotate={20} angles={[0, 60, 120, 180, 240, 300]} delay={delay + 0.5} ids={ids} />

        {/* Destellos dorados */}
        {[
          [262, 92, 1.6],
          [180, 132, 1.2],
          [120, 196, 1.4],
          [282, 150, 1],
          [214, 182, 0.9],
        ].map(([cx, cy, r], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="#C9A24D"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.7, transition: { duration: 1, delay: delay + 1.6 + i * 0.15 } } }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
