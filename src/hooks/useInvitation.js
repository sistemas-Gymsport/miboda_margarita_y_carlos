import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchInvitation, readCachedInvitation } from '../services/invitationService';

/**
 * Carga la invitacion publica.
 * - Si hay una copia en cache local se muestra de inmediato y se actualiza en segundo plano.
 * - Reintentos 1s/2s/4s; isWaking indica que el servidor esta despertando.
 * status: 'loading' | 'success' | 'error'
 */
export function useInvitation() {
  const cached = useRef(readCachedInvitation());
  const [data, setData] = useState(cached.current);
  const [status, setStatus] = useState(cached.current ? 'success' : 'loading');
  const [isWaking, setIsWaking] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    if (!cached.current) setStatus('loading');
    try {
      const fresh = await fetchInvitation({ onRetry: () => setIsWaking(true) });
      cached.current = fresh;
      setData(fresh);
      setStatus('success');
    } catch (err) {
      setError(err);
      // Con copia en cache seguimos mostrando la invitacion.
      if (!cached.current) setStatus('error');
    } finally {
      setIsWaking(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, status, error, isWaking, retry: load };
}
