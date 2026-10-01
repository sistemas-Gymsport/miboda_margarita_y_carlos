import { useRef, useState } from 'react';
import { GripVertical, RefreshCw, Star, Trash2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import SortableList from './SortableList';
import ConfirmDialog from './ConfirmDialog';
import SaveStatus from './SaveStatus';
import WeddingLoader from '../WeddingLoader';
import { useAdminData } from '../../hooks/useAdminData';
import { useSaveStatus } from '../../hooks/useSaveStatus';
import { adminService } from '../../services/adminService';
import { cldUrl } from '../../utils/cloudinary';
import { ACCEPT_ATTR, validateImages } from '../../utils/imageValidation';
import styles from './GalleryManager.module.css';

function GalleryTile({ image, index, handleProps, onSetMain, onReplace, onDelete, onAlt }) {
  const fileRef = useRef(null);
  const [alt, setAlt] = useState(image.alt);

  return (
    <figure className={styles.tile}>
      <div className={styles.thumb}>
        <img src={cldUrl(image.url, { width: 480, height: 480, crop: 'limit' })} alt={image.alt || `Fotografía ${index + 1}`} loading="lazy" />
        <button type="button" className={styles.drag} {...handleProps}>
          <GripVertical size={16} />
        </button>
        {image.isMain ? <span className={styles.mainBadge}>Principal</span> : null}
        <span className={styles.position}>{index + 1}</span>
      </div>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={`a-icon-btn ${image.isMain ? 'is-active' : ''}`}
          onClick={onSetMain}
          disabled={image.isMain}
          aria-label={image.isMain ? 'Es la fotografía principal' : 'Usar como fotografía principal'}
          title="Fotografía principal"
        >
          <Star size={16} fill={image.isMain ? 'currentColor' : 'none'} />
        </button>
        <button type="button" className="a-icon-btn" onClick={() => fileRef.current?.click()} aria-label="Sustituir fotografía" title="Sustituir">
          <RefreshCw size={16} />
        </button>
        <span className="a-spacer" />
        <button type="button" className="a-icon-btn is-danger" onClick={onDelete} aria-label="Eliminar fotografía" title="Eliminar">
          <Trash2 size={16} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT_ATTR}
          hidden
          onChange={(e) => {
            const { valid, errors } = validateImages(e.target.files);
            e.target.value = '';
            if (errors.length) window.alert(errors.join('\n'));
            if (valid[0]) onReplace(valid[0]);
          }}
        />
      </div>

      <figcaption>
        <label className="sr-only" htmlFor={`alt-${image.id}`}>
          Texto alternativo
        </label>
        <input
          id={`alt-${image.id}`}
          className={`a-input ${styles.alt}`}
          placeholder="Describe la foto (accesibilidad)"
          value={alt}
          maxLength={180}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={() => alt !== image.alt && onAlt(alt)}
        />
      </figcaption>
    </figure>
  );
}

/** Galeria: subir, sustituir, eliminar, ordenar, texto alternativo e imagen principal. */
export default function GalleryManager() {
  const { data, update } = useAdminData();
  const save = useSaveStatus();
  const [busy, setBusy] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const images = data.gallery;

  const syncGallery = (gallery) => {
    update('gallery', gallery);
    update('wedding', (w) => ({ ...w, mainImage: gallery.find((g) => g.isMain) || gallery[0] || null }));
  };

  const withLoader = async (label, fn) => {
    setBusy(label);
    try {
      await save.run(fn);
    } finally {
      setBusy(null);
    }
  };

  const uploadFiles = (files) =>
    withLoader(`Subiendo fotografías`, async () => {
      let current = images;
      for (let i = 0; i < files.length; i += 1) {
        setBusy(files.length > 1 ? `Subiendo fotografía ${i + 1} de ${files.length}` : 'Subiendo fotografía');
        const created = await adminService.gallery.upload([files[i]]);
        current = [...current, ...created];
        syncGallery(current);
      }
    });

  const replace = (id, file) =>
    withLoader('Actualizando fotografía', async () => {
      const updated = await adminService.gallery.replace(id, file);
      syncGallery(images.map((img) => (img.id === id ? updated : img)));
    });

  const setMain = (id) => save.run(async () => syncGallery(await adminService.gallery.setMain(id)));

  const remove = (id) =>
    withLoader('Eliminando fotografía', async () => {
      await adminService.gallery.remove(id);
      syncGallery(await adminService.gallery.list());
    });

  const saveAlt = (id, alt) =>
    save.run(async () => {
      const updated = await adminService.gallery.update(id, { alt });
      update('gallery', (prev) => prev.map((img) => (img.id === id ? updated : img)));
    });

  const reorder = (next) => {
    const previous = images;
    update('gallery', next);
    save.run(async () => {
      try {
        update('gallery', await adminService.gallery.reorder(next.map((img) => img.id)));
      } catch (error) {
        update('gallery', previous);
        throw error;
      }
    });
  };

  return (
    <>
      {busy ? <WeddingLoader overlay label={busy} hint="No cierres esta ventana" /> : null}

      <ImageUploader onFiles={uploadFiles} disabled={Boolean(busy)} />

      <div className={styles.header}>
        <SaveStatus status={save.status} message={save.message} />
        <span className="a-hint">{images.length} fotografías · arrastra para ordenar</span>
      </div>

      {images.length ? (
        <SortableList items={images} onReorder={reorder} layout="grid" className={styles.grid}>
          {(image, handleProps) => (
            <GalleryTile
              key={image.id + image.url}
              image={image}
              index={images.indexOf(image)}
              handleProps={handleProps}
              onSetMain={() => setMain(image.id)}
              onReplace={(file) => replace(image.id, file)}
              onDelete={() => setToDelete(image)}
              onAlt={(alt) => saveAlt(image.id, alt)}
            />
          )}
        </SortableList>
      ) : (
        <div className="a-empty">Aún no hay fotografías. La primera que subas será la fotografía principal.</div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar fotografía"
        message="La fotografía se eliminará de la invitación y de Cloudinary. Esta acción no se puede deshacer."
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </>
  );
}
