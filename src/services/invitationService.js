import { api } from './api';

const CACHE_KEY = 'wedding-invitation:v1';

/** Lee la ultima invitacion guardada para mostrarla al instante mientras despierta el backend. */
export function readCachedInvitation() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCachedInvitation(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* almacenamiento no disponible: se ignora */
  }
}

export async function fetchInvitation({ onRetry } = {}) {
  const data = await api.get('/public/invitation', { retries: 3, timeout: 45000, onRetry });
  writeCachedInvitation(data);
  return data;
}
