import { useState } from 'react';
import { cldPlaceholder, cldSrcSet, cldUrl } from '../utils/cloudinary';
import styles from './CldImage.module.css';

/**
 * Imagen optimizada de Cloudinary (f_auto, q_auto, srcset responsivo).
 * priority=true para la foto principal (sin lazy loading y con fetchpriority alto).
 */
export default function CldImage({
  src,
  alt = '',
  sizes = '100vw',
  widths,
  width = 1200,
  aspect,
  crop,
  priority = false,
  className = '',
  imgClassName = '',
  style,
}) {
  const [loaded, setLoaded] = useState(false);
  if (!src) return null;

  const height = aspect ? Math.round(width / aspect) : undefined;
  const options = crop ? { crop, gravity: 'auto', width, height } : {};
  const placeholder = cldPlaceholder(src);

  return (
    <div
      className={`${styles.frame} ${loaded ? styles.loaded : ''} ${className}`}
      style={{ ...(placeholder ? { backgroundImage: `url(${placeholder})` } : {}), ...style }}
    >
      <img
        className={`${styles.img} ${imgClassName}`}
        src={cldUrl(src, { width, height, crop: crop || 'limit', gravity: crop ? 'auto' : undefined })}
        srcSet={cldSrcSet(src, widths, options)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
