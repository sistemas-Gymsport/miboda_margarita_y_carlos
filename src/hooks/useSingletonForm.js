import { useAdminData } from './useAdminData';
import { useFormState } from './useFormState';
import { useSaveStatus } from './useSaveStatus';

/** Formulario para un registro unico de la boda (whatsapp, giftRegistry, bankInfo, theme...). */
export function useSingletonForm(key, saveFn, defaults = {}) {
  const { data, update } = useAdminData();
  const form = useFormState({ ...defaults, ...(data[key] || {}) });
  const save = useSaveStatus();

  const onSave = () =>
    save.run(async () => {
      const saved = await saveFn(form.changes);
      update(key, (prev) => ({ ...(prev || {}), ...saved }));
    });

  return { form, save, onSave, data };
}
