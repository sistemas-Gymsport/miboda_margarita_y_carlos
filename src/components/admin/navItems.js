import {
  CalendarClock,
  Gift,
  Images,
  Landmark,
  LayoutDashboard,
  ListOrdered,
  MapPinned,
  MessageCircle,
  Palette,
  Settings,
  Type,
} from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', short: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/admin/contenido', label: 'Contenido', short: 'Textos', icon: Type },
  { to: '/admin/evento', label: 'Evento', short: 'Evento', icon: CalendarClock },
  { to: '/admin/itinerario', label: 'Itinerario', short: 'Itinerario', icon: ListOrdered },
  { to: '/admin/ubicaciones', label: 'Ubicaciones', short: 'Lugares', icon: MapPinned },
  { to: '/admin/galeria', label: 'Galería', short: 'Galería', icon: Images },
  { to: '/admin/whatsapp', label: 'WhatsApp', short: 'WhatsApp', icon: MessageCircle },
  { to: '/admin/regalos', label: 'Mesa de regalos', short: 'Regalos', icon: Gift },
  { to: '/admin/banco', label: 'Datos bancarios', short: 'Banco', icon: Landmark },
  { to: '/admin/diseno', label: 'Diseño', short: 'Diseño', icon: Palette },
  { to: '/admin/configuracion', label: 'Configuración', short: 'Ajustes', icon: Settings },
];

export const MOBILE_PRIMARY = ['/admin', '/admin/contenido', '/admin/galeria', '/admin/diseno'];
