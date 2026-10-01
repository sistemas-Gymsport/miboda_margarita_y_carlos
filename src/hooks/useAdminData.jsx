import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from './useAuth';

const AdminDataContext = createContext(null);

/**
 * Carga una sola vez toda la invitacion para el panel y la comparte entre paginas.
 * update(key, value) sincroniza el estado local tras guardar sin volver a pedir todo.
 */
export function AdminDataProvider({ children }) {
  const { expire } = useAuth();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      setData(await adminService.getInvitation());
      setStatus('success');
    } catch (err) {
      if (err.status === 401) expire();
      setError(err);
      setStatus('error');
    }
  }, [expire]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback((key, value) => {
    setData((prev) => (prev ? { ...prev, [key]: typeof value === 'function' ? value(prev[key]) : value } : prev));
  }, []);

  const value = useMemo(() => ({ data, status, error, reload: load, update }), [data, status, error, load, update]);
  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData debe usarse dentro de AdminDataProvider');
  return ctx;
}
