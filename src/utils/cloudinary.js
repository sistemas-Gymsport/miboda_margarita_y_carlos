/**
 * Utilidades para entregar imagenes optimizadas desde Cloudinary (f_auto, q_auto, tamanos limitados).
 * Solo transforma URLs de Cloudinary; cualquier otra URL se devuelve tal cual.
 */
const isCloudinary = (url) => typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes('/upload/');

export function cldUrl(url, { width, height, crop = 'limit', gravity, quality = 'auto' } = {}) {
  if (!isCloudinary(url)) return url;
  const parts = ['f_auto', `q_${quality}`, `c_${crop}`];
  if (width) parts.push(`w_${Math.round(width)}`);
  if (height) parts.push(`h_${Math.round(height)}`);
  if (gravity) parts.push(`g_${gravity}`);
  return url.replace('/upload/', `/upload/${parts.join(',')}/`);
}

export function cldSrcSet(url, widths = [480, 800, 1200, 1600], options = {}) {
  if (!isCloudinary(url)) return undefined;
  return widths.map((w) => `${cldUrl(url, { ...options, width: w, height: options.height ? Math.round((options.height / options.width) * w) : undefined })} ${w}w`).join(', ');
}

/** Imagen diminuta y desenfocada para usar como fondo mientras carga la real. */
export function cldPlaceholder(url) {
  if (!isCloudinary(url)) return undefined;
  return url.replace('/upload/', '/upload/f_auto,q_auto:low,w_40,e_blur:800/');
}
