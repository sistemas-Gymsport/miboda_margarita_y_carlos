/**
 * Genera de forma segura el enlace de WhatsApp.
 * - Limpia lada y telefono (solo digitos).
 * - Evita duplicar la lada si el telefono ya la incluye.
 * - Codifica el mensaje con encodeURIComponent.
 * Devuelve null si el numero no es valido.
 */
export function normalizeWhatsappNumber(countryCode, phone) {
  const code = String(countryCode ?? '').replace(/\D/g, '').slice(0, 4);
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return null;
  const full = code && !(digits.length > 10 && digits.startsWith(code)) ? `${code}${digits}` : digits;
  return full.length >= 10 && full.length <= 15 ? full : null;
}

export function buildWhatsappUrl({ countryCode, phone, message }) {
  const number = normalizeWhatsappNumber(countryCode, phone);
  if (!number) return null;
  const text = String(message ?? '').trim();
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
