import { useCallback, useState } from 'react';
import { useAdminData } from './useAdminData';
import { useSaveStatus } from './useSaveStatus';

/**
 * Logica compartida para colecciones ordenables del panel (itinerario, ubicaciones).
 * Mantiene sincronizado el estado global y aplica reordenamiento optimista.
 */
export function useCollectionEditor(key, service) {
  const { data, update } = useAdminData();
  const items = data[key];
  const status = useSaveStatus();
  const [busyId, setBusyId] = useState(null);

  const create = useCallback(
    (payload) =>
      status.run(async () => {
        const created = await service.create(payload);
        update(key, (prev) => [...prev, created]);
        return created;
      }),
    [key, service, status, update]
  );

  const save = useCallback(
    (id, changes) =>
      status.run(async () => {
        setBusyId(id);
        try {
          const saved = await service.update(id, changes);
          update(key, (prev) => prev.map((item) => (item.id === id ? { ...item, ...saved } : item)));
          return saved;
        } finally {
          setBusyId(null);
        }
      }),
    [key, service, status, update]
  );

  const remove = useCallback(
    (id) =>
      status.run(async () => {
        await service.remove(id);
        update(key, (prev) => prev.filter((item) => item.id !== id));
      }),
    [key, service, status, update]
  );

  const reorder = useCallback(
    (next) => {
      const previous = items;
      update(key, next);
      return status.run(async () => {
        try {
          await service.reorder(next.map((item) => item.id));
        } catch (error) {
          update(key, previous);
          throw error;
        }
      });
    },
    [items, key, service, status, update]
  );

  return { items, create, save, remove, reorder, status, busyId };
}
