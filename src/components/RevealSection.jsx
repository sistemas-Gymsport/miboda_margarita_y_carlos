import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/**
 * Envuelve contenido que aparece suavemente al entrar en pantalla.
 * MotionConfig reducedMotion="user" (en App) desactiva el desplazamiento si el usuario lo prefiere.
 */
export default function RevealSection({ as = 'div', delay = 0, amount = 0.25, className, children, ...rest }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      custom={delay}
      {...rest}
    >
      {children}
    </Component>
  );
}
