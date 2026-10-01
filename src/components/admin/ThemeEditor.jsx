import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import ColorPicker from './ColorPicker';
import Field from './Field';
import SaveBar from './SaveBar';
import { useSingletonForm } from '../../hooks/useSingletonForm';
import { adminService } from '../../services/adminService';
import { BODY_FONTS, COLOR_FIELDS, HEADING_FONTS, PALETTES, applyTheme } from '../../utils/theme';
import styles from './ThemeEditor.module.css';

const headingOptions = Object.keys(HEADING_FONTS).map((f) => ({ value: f, label: f }));
const bodyOptions = Object.keys(BODY_FONTS).map((f) => ({ value: f, label: f }));

/** Vista previa en vivo con las variables CSS del tema aplicadas a un contenedor aislado. */
function ThemePreview({ theme, names }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) applyTheme(theme, ref.current);
  }, [theme]);

  return (
    <div ref={ref} className={styles.preview} aria-label="Vista previa del diseño">
      <div className={styles.previewHero}>
        <span className={styles.previewEyebrow}>Nos casamos</span>
        <span className={styles.previewNames}>{names}</span>
      </div>
      <div className={styles.previewBody}>
        <span className={styles.previewTitle}>Itinerario</span>
        <span className={styles.previewLine} />
        <p className={styles.previewText}>Cada momento pensado para compartirlo contigo.</p>
        <div className={styles.previewCard}>
          <span className={styles.previewAccent}>1:30 PM</span>
          <span className={styles.previewCardTitle}>Ceremonia</span>
        </div>
        <span className={styles.previewButton}>Confirmar asistencia</span>
      </div>
    </div>
  );
}

/** Editor de diseno: paletas predeterminadas, colores personalizados, overlay y fuentes. */
export default function ThemeEditor() {
  const { form, save, onSave, data } = useSingletonForm('theme', adminService.updateTheme);
  const { values, setField, setMany } = form;
  const names = `${data.wedding.partnerOne} & ${data.wedding.partnerTwo}`;

  const setColor = (key, value) => setMany({ [key]: value, palette: 'custom' });

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.controls}>
          <section className="a-card">
            <h2 className="a-card-title">Paletas</h2>
            <p className="a-card-desc">Elige una base y después personaliza cualquier color.</p>
            <div className={styles.palettes}>
              {Object.entries(PALETTES).map(([key, palette]) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.palette} ${values.palette === key ? styles.paletteActive : ''}`}
                  onClick={() => setMany({ ...palette.colors, palette: key })}
                  aria-pressed={values.palette === key}
                >
                  <span className={styles.paletteSwatches} aria-hidden="true">
                    {['colorBackground', 'colorSurface', 'colorPrimary', 'colorAccent', 'colorText'].map((c) => (
                      <span key={c} style={{ background: palette.colors[c] }} />
                    ))}
                  </span>
                  <span className={styles.paletteName}>
                    {palette.name}
                    {values.palette === key ? <Check size={14} aria-hidden="true" /> : null}
                  </span>
                </button>
              ))}
            </div>
            {values.palette === 'custom' ? <p className="a-hint" style={{ marginTop: '0.75rem' }}>Paleta personalizada</p> : null}
          </section>

          <section className="a-card">
            <h2 className="a-card-title">Colores</h2>
            <div className={styles.colors}>
              {COLOR_FIELDS.map(({ key, label }) => (
                <ColorPicker key={key} label={label} value={values[key] || '#000000'} onChange={(v) => setColor(key, v)} />
              ))}
            </div>
            <div className="a-field" style={{ marginTop: '1rem' }}>
              <label className="a-label" htmlFor="overlay-opacity">
                Intensidad del overlay de portada: {Math.round((values.heroOverlayOpacity ?? 0.45) * 100)}%
              </label>
              <input
                id="overlay-opacity"
                type="range"
                min="0"
                max="0.9"
                step="0.05"
                value={values.heroOverlayOpacity ?? 0.45}
                onChange={(e) => setField('heroOverlayOpacity', Number(e.target.value))}
                style={{ accentColor: 'var(--a-primary)' }}
              />
              <span className="a-hint">Oscurece la fotografía principal para que los nombres se lean con claridad.</span>
            </div>
          </section>

          <section className="a-card">
            <h2 className="a-card-title">Tipografía</h2>
            <div className="a-grid a-grid-2">
              <Field label="Títulos" as="select" options={headingOptions} value={values.fontHeading} onChange={(v) => setField('fontHeading', v)} />
              <Field label="Texto" as="select" options={bodyOptions} value={values.fontBody} onChange={(v) => setField('fontBody', v)} />
            </div>
          </section>
        </div>

        <aside className={styles.previewWrap}>
          <ThemePreview theme={values} names={names} />
        </aside>
      </div>

      <SaveBar status={save.status} message={save.message} dirty={form.dirty} onSave={onSave} onReset={form.reset} />
    </>
  );
}
