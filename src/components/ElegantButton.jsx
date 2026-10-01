import { motion } from 'framer-motion';
import styles from './ElegantButton.module.css';

/**
 * Boton/enlace con microinteracciones sutiles (barrido de color y desplazamiento del icono).
 * Si recibe href se renderiza como enlace externo seguro.
 */
export default function ElegantButton({ href, icon: Icon, children, variant = 'solid', className = '', ...rest }) {
  const Component = href ? motion.a : motion.button;
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { type: rest.type || 'button' };

  return (
    <Component
      className={`${styles.button} ${styles[variant]} ${className}`}
      whileTap={{ scale: 0.97 }}
      {...linkProps}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
      {Icon ? <Icon className={styles.icon} size={16} strokeWidth={1.5} aria-hidden="true" /> : null}
    </Component>
  );
}
