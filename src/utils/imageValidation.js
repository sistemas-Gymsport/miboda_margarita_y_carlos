export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPT_ATTR = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
export const MAX_IMAGE_MB = 8;

/** Valida tipo MIME, extension y peso antes de subir. Devuelve { valid, errors }. */
export function validateImages(fileList) {
  const valid = [];
  const errors = [];
  Array.from(fileList || []).forEach((file) => {
    const extOk = /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!ACCEPTED_TYPES.includes(file.type) || !extOk) {
      errors.push(`"${file.name}" no es JPG, PNG o WEBP.`);
    } else if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      errors.push(`"${file.name}" pesa más de ${MAX_IMAGE_MB} MB.`);
    } else {
      valid.push(file);
    }
  });
  return { valid, errors };
}
