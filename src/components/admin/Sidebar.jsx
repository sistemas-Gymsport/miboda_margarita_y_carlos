import { Link, NavLink } from 'react-router-dom';
import { Home, LogOut, User } from 'lucide-react';
import { NAV_ITEMS } from './navItems';
import { useAuth } from '../../hooks/useAuth';

export function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="9" cy="14" r="5.5" />
      <circle cx="15" cy="14" r="5.5" />
    </svg>
  );
}

export function NavList({ onNavigate }) {
  return (
    <nav className="a-nav" aria-label="Secciones del panel">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `a-nav-link${isActive ? ' active' : ''}`} onClick={onNavigate}>
          <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

/** Barra lateral (escritorio). */
export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="a-sidebar">
      <NavLink to="/admin" className="a-brand">
        <span className="a-brand-mark">
          <BrandMark />
        </span>
        <span>
          <strong>Invitación</strong>
          <small>Panel de administración</small>
        </span>
      </NavLink>
      <NavList />
      <div className="a-sidebar-footer">
        <span className="a-user">
          <User size={16} aria-hidden="true" /> {user?.username}
        </span>
        <Link to="/" className="a-btn a-btn-ghost" style={{ justifyContent: 'flex-start' }}>
          <Home size={16} aria-hidden="true" /> Ir a la invitación
        </Link>
        <button type="button" className="a-btn a-btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={logout}>
          <LogOut size={16} aria-hidden="true" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
