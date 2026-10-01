import PageHeader from '../../components/admin/PageHeader';
import LocationEditor from '../../components/admin/LocationEditor';

export default function LocationsPage() {
  return (
    <>
      <PageHeader title="Ubicaciones" description="Ceremonia, recepción y cualquier otro lugar. Cada uno puede tener su propio enlace de Google Maps." />
      <LocationEditor />
    </>
  );
}
