import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Estado de formulario con deteccion de cambios.
 * Si cambia el valor inicial (por ejemplo tras recargar datos) se reinicia.
 */
export function useFormState(initial) {
  const [values, setValues] = useState(initial || {});
  const baseline = useRef(initial || {});
  const serialized = JSON.stringify(initial || {});

  useEffect(() => {
    baseline.current = JSON.parse(serialized);
    setValues(JSON.parse(serialized));
  }, [serialized]);

  const setField = useCallback((key, value) => setValues((prev) => ({ ...prev, [key]: value })), []);
  const setMany = useCallback((patch) => setValues((prev) => ({ ...prev, ...patch })), []);
  const reset = useCallback(() => setValues(baseline.current), []);

  const changes = useMemo(() => {
    const diff = {};
    Object.keys(values).forEach((key) => {
      if (JSON.stringify(values[key]) !== JSON.stringify(baseline.current[key])) diff[key] = values[key];
    });
    return diff;
  }, [values]);


  return { values, setField, setMany, reset, changes, dirty: Object.keys(changes).length > 0 };
}
