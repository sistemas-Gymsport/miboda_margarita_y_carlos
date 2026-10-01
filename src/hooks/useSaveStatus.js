import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';

/**
 * Estado de guardado discreto: idle | saving | saved | error.
 * run(fn) ejecuta la operacion y actualiza el estado; "Guardado" desaparece solo.
 */
export function useSaveStatus() {
  const { expire } = useAuth();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const run = useCallback(
    async (fn) => {
      clearTimeout(timer.current);
      setStatus('saving');
      setMessage('');
      try {
        const result = await fn();
        setStatus('saved');
        timer.current = setTimeout(() => setStatus('idle'), 2500);
        return result;
      } catch (error) {
        if (error.status === 401) expire();
        setStatus('error');
        setMessage(error.message || 'No se pudo guardar');
        return undefined;
      }
    },
    [expire]
  );

  return { status, message, run, isSaving: status === 'saving' };
}
