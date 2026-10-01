import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import InvitationPage from './pages/InvitationPage';
import WeddingLoader from './components/WeddingLoader';
import NotFoundPage from './pages/NotFoundPage';

// El panel se descarga solo cuando se visita /admin (no pesa en la invitacion).
const AdminApp = lazy(() => import('./pages/admin/AdminApp'));

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="/" element={<InvitationPage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<WeddingLoader fullscreen label="Abriendo el panel" />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MotionConfig>
  );
}
