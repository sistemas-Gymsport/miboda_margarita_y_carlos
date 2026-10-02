/** Definicion de los textos editables agrupados por seccion de la invitacion. */
export const CONTENT_GROUPS = [
  {
    title: 'Introducción',
    fields: [
      { key: 'introEyebrow', label: 'Frase superior' },
      { key: 'introButton', label: 'Texto del botón' },
    ],
  },
  {
    title: 'Portada',
    fields: [
      { key: 'heroEyebrow', label: 'Título en caligrafía', hint: 'Ejemplo: Nuestra Boda' },
      { key: 'heroSubtitle', label: 'Subtítulo' },
      { key: 'heroDateText', label: 'Fecha personalizada', hint: 'Déjalo vacío para mostrar la fecha configurada automáticamente.' },
      { key: 'heroConfirmText', label: 'Texto sobre los teléfonos', hint: 'Los teléfonos se configuran en WhatsApp.' },
      { key: 'heroClosing', label: 'Despedida en caligrafía', hint: 'Ejemplo: Te esperamos' },
      { key: 'heroScrollHint', label: 'Indicador de desplazamiento' },
    ],
  },
  {
    title: 'Mensaje principal',
    fields: [
      { key: 'storyEyebrow', label: 'Antetítulo' },
      { key: 'storyTitle', label: 'Título' },
      { key: 'storyMessage', label: 'Mensaje', multiline: true, rows: 6, hint: 'Cada salto de línea crea un párrafo nuevo.' },
      { key: 'storyQuote', label: 'Frase final' },
    ],
  },
  {
    title: 'Cuenta regresiva',
    fields: [
      { key: 'countdownEyebrow', label: 'Antetítulo' },
      { key: 'countdownTitle', label: 'Título' },
      { key: 'countdownDays', label: 'Etiqueta días' },
      { key: 'countdownHours', label: 'Etiqueta horas' },
      { key: 'countdownMinutes', label: 'Etiqueta minutos' },
      { key: 'countdownSeconds', label: 'Etiqueta segundos' },
      { key: 'countdownFinished', label: 'Mensaje al terminar' },
    ],
  },
  {
    title: 'Itinerario',
    fields: [
      { key: 'scheduleEyebrow', label: 'Antetítulo' },
      { key: 'scheduleTitle', label: 'Título' },
      { key: 'scheduleSubtitle', label: 'Subtítulo', multiline: true, rows: 2 },
    ],
  },
  {
    title: 'Ubicaciones',
    fields: [
      { key: 'locationsEyebrow', label: 'Antetítulo' },
      { key: 'locationsTitle', label: 'Título' },
    ],
  },
  {
    title: 'Galería',
    fields: [
      { key: 'galleryEyebrow', label: 'Antetítulo' },
      { key: 'galleryTitle', label: 'Título' },
      { key: 'gallerySubtitle', label: 'Subtítulo', multiline: true, rows: 2 },
    ],
  },
  {
    title: 'Código de vestimenta',
    fields: [
      { key: 'dressCodeEyebrow', label: 'Antetítulo' },
      { key: 'dressCodeTitle', label: 'Estilo', hint: 'Ejemplo: Formal, Etiqueta, Cóctel' },
      { key: 'dressCodeDescription', label: 'Descripción', multiline: true, rows: 3 },
      { key: 'dressCodeWomen', label: 'Sugerencia para ellas' },
      { key: 'dressCodeMen', label: 'Sugerencia para ellos' },
      { key: 'dressCodeNote', label: 'Nota' },
    ],
  },
  {
    title: 'Mensaje final y pie de página',
    fields: [
      { key: 'closingEyebrow', label: 'Antetítulo' },
      { key: 'closingMessage', label: 'Mensaje final', multiline: true, rows: 2 },
      { key: 'closingSignature', label: 'Despedida' },
      { key: 'footerNote', label: 'Texto del pie de página' },
    ],
  },
];
