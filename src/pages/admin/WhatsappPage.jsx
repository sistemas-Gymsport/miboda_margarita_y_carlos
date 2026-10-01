import PageHeader from '../../components/admin/PageHeader';
import WhatsappEditor from '../../components/admin/WhatsappEditor';

export default function WhatsappPage() {
  return (
    <>
      <PageHeader title="WhatsApp" description="Los invitados confirmarán su asistencia con un mensaje prellenado a este número." />
      <WhatsappEditor />
    </>
  );
}
