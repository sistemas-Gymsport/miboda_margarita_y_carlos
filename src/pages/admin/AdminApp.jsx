import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../hooks/useAuth';
import WeddingLoader from '../../components/WeddingLoader';
import AdminLayout from '../../layouts/AdminLayout';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import ContentPage from './ContentPage';
import EventPage from './EventPage';
import SchedulePage from './SchedulePage';
import LocationsPage from './LocationsPage';
import GalleryPage from './GalleryPage';
import WhatsappPage from './WhatsappPage';
import GiftsPage from './GiftsPage';
import BankPage from './BankPage';
import DesignPage from './DesignPage';
import SettingsPage from './SettingsPage';
import '../../styles/admin.css';

function RequireAuth({ children }) {
  const { status, retry } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <WeddingLoader fullscreen label="Verificando sesión" />;
  if (status === 'error') {
    return (
      <div className="a-empty" style={{ margin: '4rem auto', maxWidth: 420 }}>
        <p>No pudimos conectar con el servidor. Puede estar iniciándose; inténtalo en unos segundos.</p>
        <button type="button" className="a-btn a-btn-primary" onClick={retry}>
          Intentar nuevamente
        </button>
      </div>
    );
  }
  if (status !== 'authenticated') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function AdminApp() {
  useEffect(() => {
    document.title = 'Panel | Invitación de boda';
    document.body.classList.add('admin');
    return () => document.body.classList.remove('admin');
  }, []);

  return (
    <AuthProvider>
      <div className="admin">
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="contenido" element={<ContentPage />} />
            <Route path="evento" element={<EventPage />} />
            <Route path="itinerario" element={<SchedulePage />} />
            <Route path="ubicaciones" element={<LocationsPage />} />
            <Route path="galeria" element={<GalleryPage />} />
            <Route path="whatsapp" element={<WhatsappPage />} />
            <Route path="regalos" element={<GiftsPage />} />
            <Route path="banco" element={<BankPage />} />
            <Route path="diseno" element={<DesignPage />} />
            <Route path="configuracion" element={<SettingsPage />} />
            <Route path="preview" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}
