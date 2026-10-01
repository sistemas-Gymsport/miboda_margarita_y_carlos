const LOCALE = 'es-MX';

function safeFormat(iso, timeZone, options) {
  try {
    return new Intl.DateTimeFormat(LOCALE, { timeZone, ...options }).format(new Date(iso));
  } catch {
    return new Intl.DateTimeFormat(LOCALE, options).format(new Date(iso));
  }
}

/** "sábado, 14 de noviembre de 2026" */
export function formatLongDate(iso, timeZone) {
  if (!iso) return '';
  return safeFormat(iso, timeZone, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/** Partes para el hero: { day: '14', month: 'NOVIEMBRE', year: '2026', weekday: 'SÁBADO' } */
export function getDateParts(iso, timeZone) {
  if (!iso) return null;
  return {
    day: safeFormat(iso, timeZone, { day: '2-digit' }),
    month: safeFormat(iso, timeZone, { month: 'long' }).toUpperCase(),
    year: safeFormat(iso, timeZone, { year: 'numeric' }),
    weekday: safeFormat(iso, timeZone, { weekday: 'long' }).toUpperCase(),
  };
}

/** "13:30" -> "1:30 PM" */
export function formatTime(time) {
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return time || '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

const pad = (n) => String(n).padStart(2, '0');
const toCalendarStamp = (date) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;

/** Enlace para agregar el evento a Google Calendar. */
export function googleCalendarUrl({ title, startIso, hours = 8, details = '', location = '' }) {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + hours * 3600 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
