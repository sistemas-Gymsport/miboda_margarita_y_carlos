import { useEffect } from 'react';
import { cldUrl } from '../utils/cloudinary';

function setMeta(selector, attr, value) {
  if (!value) return;
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Actualiza titulo y metadatos con los datos dinamicos de la invitacion. */
export function useDocumentMeta(invitation) {
  useEffect(() => {
    if (!invitation) return;
    const { wedding } = invitation;
    const names = `${wedding.partnerOne} & ${wedding.partnerTwo}`;
    const title = wedding.seoTitle || `${names} | Nuestra boda`;
    const description = wedding.seoDescription;
    const image = wedding.mainImage?.url
      ? cldUrl(wedding.mainImage.url, { width: 1200, height: 630, crop: 'fill', gravity: 'auto' })
      : null;

    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[name="twitter:image"]', 'content', image);
  }, [invitation]);
}
