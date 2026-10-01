import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/adminService';

const AuthContext = createContext(null);

/** Sesion del administrador basada en cookie HTTP-only (el token nunca toca JavaScript). */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | anonymous | error

  const check = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await authService.me();
      setUser(data.user);
      setStatus('authenticated');
    } catch (error) {
      setUser(null);
      setStatus(error.status === 401 ? 'anonymous' : 'error');
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data.user);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {});
    setUser(null);
    setStatus('anonymous');
  }, []);

  const expire = useCallback(() => {
    setUser(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo(() => ({ user, status, login, logout, expire, retry: check }), [user, status, login, logout, expire, check]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
