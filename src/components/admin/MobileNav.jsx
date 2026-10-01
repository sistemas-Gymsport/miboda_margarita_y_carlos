import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu } from 'lucide-react';
import { MOBILE_PRIMARY, NAV_ITEMS } from './navItems';
import { NavList } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

/** Navegacion inferior para movil con hoja de "Mas opciones". */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const primary = NAV_ITEMS.filter((item) => MOBILE_PRIMARY.includes(item.to));

  return (
    <>
      <nav className="a-bottom-nav" aria-label="Navegación principal">
        {primary.map(({ to, short, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `a-bottom-link${isActive ? ' active' : ''}`}>
            <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
            {short}
          </NavLink>
        ))}
        <button type="button" className="a-bottom-link" onClick={() => setOpen(true)} aria-expanded={open} aria-haspopup="dialog">
          <Menu size={20} strokeWidth={1.7} aria-hidden="true" />
          Más
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div className="a-sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              className="a-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Todas las secciones"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="a-sheet-handle" aria-hidden="true" />
              <NavList onNavigate={() => setOpen(false)} />
              <button type="button" className="a-btn a-btn-ghost" style={{ width: '100%', marginTop: '0.75rem' }} onClick={logout}>
                <LogOut size={16} aria-hidden="true" /> Cerrar sesión
              </button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
