import { Camera, Car, Clock, Flower2, Moon, Music, Sparkles, UtensilsCrossed, Wine } from 'lucide-react';

/** Anillos minimalistas (no existe en Lucide). */
function RingsIcon({ size = 22, strokeWidth = 1.4, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <circle cx="9" cy="14" r="5.5" />
      <circle cx="15" cy="14" r="5.5" />
      <path d="M15 4.2l1.6 1.7L15 7.8l-1.6-1.9z" strokeLinejoin="round" />
    </svg>
  );
}

export const SCHEDULE_ICONS = {
  rings: { label: 'Anillos', Icon: RingsIcon },
  glass: { label: 'Brindis', Icon: Wine },
  utensils: { label: 'Cena', Icon: UtensilsCrossed },
  music: { label: 'Música', Icon: Music },
  camera: { label: 'Fotografías', Icon: Camera },
  sparkles: { label: 'Destellos', Icon: Sparkles },
  moon: { label: 'Noche', Icon: Moon },
  flower: { label: 'Flor', Icon: Flower2 },
  clock: { label: 'Reloj', Icon: Clock },
  car: { label: 'Traslado', Icon: Car },
};

export default function ScheduleIcon({ name, size = 22, className }) {
  const { Icon } = SCHEDULE_ICONS[name] || SCHEDULE_ICONS.sparkles;
  return <Icon size={size} strokeWidth={1.4} className={className} aria-hidden="true" />;
}
