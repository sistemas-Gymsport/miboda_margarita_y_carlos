import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { ACCEPT_ATTR, MAX_IMAGE_MB, validateImages } from '../../utils/imageValidation';
import styles from './ImageUploader.module.css';

/** Zona para arrastrar o seleccionar fotografias (validacion de tipo y peso incluida). */
export default function ImageUploader({ onFiles, multiple = true, disabled = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  const handle = (fileList) => {
    const { valid, errors: found } = validateImages(fileList);
    setErrors(found);
    if (valid.length) onFiles(multiple ? valid : valid.slice(0, 1));
  };

  return (
    <div>
      <div
        className={`${styles.zone} ${dragging ? styles.dragging : ''} ${disabled ? styles.disabled : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) handle(e.dataTransfer.files);
        }}
      >
        <ImagePlus size={28} strokeWidth={1.4} aria-hidden="true" />
        <p className={styles.title}>Arrastra tus fotografías aquí</p>
        <p className={styles.hint}>
          JPG, PNG o WEBP · máximo {MAX_IMAGE_MB} MB por imagen · se recomienda formato cuadrado o vertical 9:16
        </p>
        <button type="button" className="a-btn a-btn-primary" onClick={() => inputRef.current?.click()} disabled={disabled}>
          Seleccionar fotografías
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple={multiple}
          hidden
          onChange={(e) => {
            handle(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {errors.length ? (
        <div className="a-alert is-error" role="alert" style={{ marginTop: '0.75rem', flexDirection: 'column', gap: '0.2rem' }}>
          {errors.map((err) => (
            <span key={err}>{err}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
