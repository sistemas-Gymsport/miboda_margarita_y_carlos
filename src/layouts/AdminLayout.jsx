import { Outlet, useLocation } from 'react-router-dom';
import { Eye } from 'lucide-react';
import Sidebar from '../components/admin/Sidebar';
import MobileNav from '../components/admin/MobileNav';
import { NAV_ITEMS } from '../components/admin/navItems';
import WeddingLoader from '../components/WeddingLoader';
import { AdminDataProvider, useAdminData } from '../hooks/useAdminData';

function AdminContent() {
  const { status, error, reload } = useAdminData();

  if (status === 'loading') return <WeddingLoader label="Cargando la invitación" />;
  if (status === 'error') {
    return (
      <div className="a-empty">
        <p>{error?.message || 'No se pudo cargar la información.'}</p>
        <button type="button" className="a-btn a-btn-primary" onClick={reload}>
          Intentar nuevamente
        </button>
      </div>
    );
  }
  return <Outlet />;
}

/** Estructura del panel: sidebar en escritorio, navegacion inferior en movil. */
export default function AdminLayout() {
  const { pathname } = useLocation();
  const current = [...NAV_ITEMS].reverse().find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`));

  return (
    <AdminDataProvider>
      <div className="a-shell">
        <Sidebar />
        <div className="a-main">
          <div className="a-topbar">
            <p className="a-topbar-title">{current?.label || 'Panel'}</p>
            <a className="a-btn a-btn-secondary a-btn-sm" href="/" target="_blank" rel="noopener noreferrer">
              <Eye size={16} aria-hidden="true" /> Vista previa
            </a>
          </div>
          <main className="a-content">
            <AdminContent />
          </main>
        </div>
        <MobileNav />
      </div>
    </AdminDataProvider>
  );
}
