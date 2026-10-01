import PageHeader from '../../components/admin/PageHeader';
import ContentEditor from '../../components/admin/ContentEditor';

export default function ContentPage() {
  return (
    <>
      <PageHeader
        title="Contenido"
        description="Edita cualquier palabra de la invitación. Los textos de WhatsApp, regalos y datos bancarios están en sus propias secciones."
      />
      <ContentEditor />
    </>
  );
}
