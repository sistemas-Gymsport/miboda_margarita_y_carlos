import { useEffect, useState } from 'react';

const WIDE = '(min-width: 640px)';

const current = () => (typeof window !== 'undefined' && window.matchMedia(WIDE).matches ? 3 : 2);

/** Numero de columnas de la galeria segun el ancho de pantalla (2 en movil, 3 en adelante). */
export function useColumnCount() {
  const [columns, setColumns] = useState(current);

  useEffect(() => {
    const mql = window.matchMedia(WIDE);
    const update = () => setColumns(current());
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return columns;
}
