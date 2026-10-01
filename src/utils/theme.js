/** Paletas predeterminadas (el administrador puede personalizarlas despues). */
export const PALETTES = {
  olivo: {
    name: 'Olivo elegante',
    colors: {
      colorBackground: '#F7F5EF', colorSurface: '#EEEBE1', colorPrimary: '#5B6342', colorSecondary: '#8C9270',
      colorAccent: '#B59B6A', colorText: '#2C2E24', colorMuted: '#6E705F', colorButton: '#5B6342',
      colorButtonText: '#F7F5EF', colorLine: '#C9B892', heroOverlay: '#1E2117',
    },
  },
  champagne: {
    name: 'Champagne',
    colors: {
      colorBackground: '#FBF8F3', colorSurface: '#F3ECE1', colorPrimary: '#8A6F4D', colorSecondary: '#B89C78',
      colorAccent: '#C8A96E', colorText: '#2F2A24', colorMuted: '#7A6F63', colorButton: '#8A6F4D',
      colorButtonText: '#FFFDF9', colorLine: '#D9C4A0', heroOverlay: '#2A2118',
    },
  },
  terracota: {
    name: 'Terracota',
    colors: {
      colorBackground: '#FAF5F0', colorSurface: '#F1E6DC', colorPrimary: '#A0583C', colorSecondary: '#C58B6C',
      colorAccent: '#C99A5B', colorText: '#33241D', colorMuted: '#7D6559', colorButton: '#A0583C',
      colorButtonText: '#FFF9F4', colorLine: '#DDB79C', heroOverlay: '#2B1A13',
    },
  },
  rosa: {
    name: 'Rosa antiguo',
    colors: {
      colorBackground: '#FBF6F5', colorSurface: '#F3E7E5', colorPrimary: '#9A6B6E', colorSecondary: '#C29A9B',
      colorAccent: '#B8956A', colorText: '#33282A', colorMuted: '#7E6C6E', colorButton: '#9A6B6E',
      colorButtonText: '#FFFAF9', colorLine: '#DEC2BF', heroOverlay: '#2A1D1F',
    },
  },
  noche: {
    name: 'Azul noche',
    colors: {
      colorBackground: '#F4F5F8', colorSurface: '#E6E9F0', colorPrimary: '#1F2A44', colorSecondary: '#53607E',
      colorAccent: '#B4975A', colorText: '#1A2033', colorMuted: '#5F667A', colorButton: '#1F2A44',
      colorButtonText: '#F4F5F8', colorLine: '#C7B489', heroOverlay: '#0D1322',
    },
  },
  marfil: {
    name: 'Marfil',
    colors: {
      colorBackground: '#FFFDF8', colorSurface: '#F6F1E7', colorPrimary: '#3A3631', colorSecondary: '#8E867A',
      colorAccent: '#B9A27A', colorText: '#26231F', colorMuted: '#77716A', colorButton: '#3A3631',
      colorButtonText: '#FFFDF8', colorLine: '#D8CCB6', heroOverlay: '#1B1916',
    },
  },
};

export const COLOR_FIELDS = [
  { key: 'colorBackground', label: 'Fondo principal', cssVar: '--color-background' },
  { key: 'colorSurface', label: 'Fondo secundario', cssVar: '--color-surface' },
  { key: 'colorText', label: 'Texto principal', cssVar: '--color-text' },
  { key: 'colorMuted', label: 'Texto secundario', cssVar: '--color-muted' },
  { key: 'colorPrimary', label: 'Color principal', cssVar: '--color-primary' },
  { key: 'colorSecondary', label: 'Color secundario', cssVar: '--color-secondary' },
  { key: 'colorAccent', label: 'Color de acento', cssVar: '--color-accent' },
  { key: 'colorButton', label: 'Botones', cssVar: '--color-button' },
  { key: 'colorButtonText', label: 'Texto de botones', cssVar: '--color-button-text' },
  { key: 'colorLine', label: 'Líneas decorativas', cssVar: '--color-line' },
  { key: 'heroOverlay', label: 'Overlay de portada', cssVar: '--color-overlay' },
];

export const HEADING_FONTS = {
  'Cormorant Garamond': { query: 'ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500', fallback: 'serif' },
  'Playfair Display': { query: 'ital,wght@0,400;0,500;0,600;1,400;1,500', fallback: 'serif' },
  'Bodoni Moda': { query: 'ital,wght@0,400;0,500;0,600;1,400;1,500', fallback: 'serif' },
  Cinzel: { query: 'wght@400;500;600', fallback: 'serif' },
  'DM Serif Display': { query: 'ital@0;1', fallback: 'serif' },
};

export const BODY_FONTS = {
  Inter: { query: 'wght@300;400;500;600', fallback: 'sans-serif' },
  Montserrat: { query: 'wght@300;400;500;600', fallback: 'sans-serif' },
  Lato: { query: 'wght@300;400;700', fallback: 'sans-serif' },
  Manrope: { query: 'wght@300;400;500;600', fallback: 'sans-serif' },
};

export function googleFontsUrl(heading, body) {
  const families = [];
  const h = HEADING_FONTS[heading];
  const b = BODY_FONTS[body];
  if (h) families.push(`family=${encodeURIComponent(heading).replace(/%20/g, '+')}:${h.query}`);
  if (b) families.push(`family=${encodeURIComponent(body).replace(/%20/g, '+')}:${b.query}`);
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

function loadFonts(heading, body) {
  const href = googleFontsUrl(heading, body);
  let link = document.getElementById('theme-fonts');
  if (!link) {
    link = document.createElement('link');
    link.id = 'theme-fonts';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.getAttribute('href') !== href) link.setAttribute('href', href);
}

/** Aplica el tema como variables CSS en :root y carga las fuentes elegidas. */
export function applyTheme(theme, target = document.documentElement) {
  if (!theme) return;
  COLOR_FIELDS.forEach(({ key, cssVar }) => {
    if (theme[key]) target.style.setProperty(cssVar, theme[key]);
  });
  target.style.setProperty('--overlay-opacity', String(theme.heroOverlayOpacity ?? 0.45));

  const heading = HEADING_FONTS[theme.fontHeading] ? theme.fontHeading : 'Cormorant Garamond';
  const body = BODY_FONTS[theme.fontBody] ? theme.fontBody : 'Manrope';
  target.style.setProperty('--font-heading', `'${heading}', ${HEADING_FONTS[heading].fallback}`);
  target.style.setProperty('--font-body', `'${body}', ${BODY_FONTS[body].fallback}`);

  loadFonts(heading, body);
  if (target === document.documentElement) {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.colorBackground);
  }
}
