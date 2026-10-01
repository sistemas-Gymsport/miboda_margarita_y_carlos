import { ChevronDown } from 'lucide-react';
import Field from './Field';
import SaveBar from './SaveBar';
import { CONTENT_GROUPS } from './contentGroups';
import { useAdminData } from '../../hooks/useAdminData';
import { useFormState } from '../../hooks/useFormState';
import { useSaveStatus } from '../../hooks/useSaveStatus';
import { adminService } from '../../services/adminService';

/** Editor de todos los textos de la invitacion, agrupados por seccion. */
export default function ContentEditor() {
  const { data, update } = useAdminData();
  const form = useFormState(data.content);
  const save = useSaveStatus();

  const onSave = () =>
    save.run(async () => {
      const content = await adminService.updateContent(form.changes);
      update('content', content);
    });

  return (
    <>
      {CONTENT_GROUPS.map((group, index) => (
        <details key={group.title} className="a-details" open={index === 0}>
          <summary>
            {group.title}
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <div className="a-details-body">
            {group.fields.map((field) => (
              <Field
                key={field.key}
                label={field.label}
                hint={field.hint}
                as={field.multiline ? 'textarea' : 'input'}
                rows={field.rows}
                maxLength={2000}
                value={form.values[field.key]}
                onChange={(value) => form.setField(field.key, value)}
              />
            ))}
          </div>
        </details>
      ))}
      <SaveBar status={save.status} message={save.message} dirty={form.dirty} onSave={onSave} onReset={form.reset} />
    </>
  );
}
