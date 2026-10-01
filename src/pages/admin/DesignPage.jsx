import PageHeader from '../../components/admin/PageHeader';
import ThemeEditor from '../../components/admin/ThemeEditor';

export default function DesignPage() {
  return (
    <>
      <PageHeader title="Diseño" description="Colores y tipografía de la invitación. La vista previa se actualiza mientras editas." />
      <ThemeEditor />
    </>
  );
}
