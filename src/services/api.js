/**
 * Cliente HTTP central. Todas las URLs del backend salen de aqui.
 * - credentials: 'include' para la cookie HTTP-only del panel.
 * - Reintentos con espera exponencial (1s, 2s, 4s) para tolerar el cold start de Render.
 */
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

const RETRY_DELAYS = [1000, 2000, 4000];
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function attempt(path, { method, body, headers, timeout }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const isForm = body instanceof FormData;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      signal: controller.signal,
    });

    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(payload?.message || 'No pudimos completar la solicitud', response.status, payload);
    }
    return payload?.data ?? payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const message =
      error.name === 'AbortError'
        ? 'El servidor tardó demasiado en responder'
        : 'No hay conexión con el servidor';
    throw new ApiError(message, 0);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @param {string} path Ruta relativa a la API (ej. "/public/invitation")
 * @param {object} options method, body, retries, timeout, onRetry(intento, espera)
 */
export async function request(path, options = {}) {
  const { method = 'GET', body, headers, retries = 0, timeout = 30000, onRetry } = options;
  let lastError;

  for (let i = 0; i <= retries; i += 1) {
    try {
      return await attempt(path, { method, body, headers, timeout });
    } catch (error) {
      lastError = error;
      const retryable = error.status === 0 || RETRYABLE_STATUS.has(error.status);
      if (!retryable || i === retries) break;
      const delay = RETRY_DELAYS[Math.min(i, RETRY_DELAYS.length - 1)];
      onRetry?.(i + 1, delay);
      await wait(delay);
    }
  }
  throw lastError;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

/** Despierta el backend lo antes posible (no consulta la base de datos). */
export function warmUpApi() {
  fetch(`${API_URL}/health`, { method: 'GET', mode: 'cors' }).catch(() => {});
}
