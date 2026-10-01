import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const DEFAULT_META = {
  title: 'Nuestra boda | Invitación',
  description: 'Nos casamos y queremos compartir este día contigo. Consulta todos los detalles de nuestra boda.',
  image: '/og-default.png',
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function ogImageUrl(url) {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/f_jpg,q_auto,c_fill,g_auto,w_1200,h_630/');
}

/**
 * En el build intenta obtener nombres, fecha y foto principal desde la API para que
 * WhatsApp/Facebook muestren una vista previa personalizada (no ejecutan JavaScript).
 * Si la API no responde, se usan valores por defecto.
 */
function invitationMetaPlugin(env) {
  return {
    name: 'invitation-meta',
    async transformIndexHtml(html, ctx) {
      const meta = { ...DEFAULT_META };
      // Si VITE_API_URL es relativa (proxy de Vercel), usar VITE_META_API_URL con la URL absoluta de Render.
      const api = env.VITE_META_API_URL || env.VITE_API_URL;

      if (!ctx.server && api && /^https?:\/\//.test(api)) {
        try {
          const res = await fetch(`${api.replace(/\/$/, '')}/public/invitation`, { signal: AbortSignal.timeout(60000) });
          const { data } = await res.json();
          const names = `${data.wedding.partnerOne} & ${data.wedding.partnerTwo}`;
          meta.title = data.wedding.seoTitle || `${names} | Nuestra boda`;
          meta.description = data.wedding.seoDescription || meta.description;
          if (data.wedding.mainImage?.url) meta.image = ogImageUrl(data.wedding.mainImage.url);
          console.log(`[invitation-meta] Metadatos generados para ${names}`);
        } catch (error) {
          console.warn(`[invitation-meta] No se pudo consultar la API (${error.message}); se usan metadatos por defecto.`);
        }
      }

      const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '');
      const image = meta.image.startsWith('/') && siteUrl ? `${siteUrl}${meta.image}` : meta.image;

      return html
        .replaceAll('%%TITLE%%', escapeHtml(meta.title))
        .replaceAll('%%DESCRIPTION%%', escapeHtml(meta.description))
        .replaceAll('%%OG_IMAGE%%', escapeHtml(image))
        .replaceAll('%%SITE_URL%%', escapeHtml(siteUrl || '/'));
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), invitationMetaPlugin(env)],
    server: { port: 5173 },
    build: {
      target: 'es2020',
      sourcemap: false,
      chunkSizeWarningLimit: 700,
    },
  };
});
