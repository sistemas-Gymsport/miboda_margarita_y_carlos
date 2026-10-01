import PageHeader from '../../components/admin/PageHeader';
import ScheduleEditor from '../../components/admin/ScheduleEditor';

export default function SchedulePage() {
  return (
    <>
      <PageHeader title="Itinerario" description="Agrega, edita y arrastra los momentos para cambiar su orden. Los cambios de orden se guardan al soltar." />
      <ScheduleEditor />
    </>
  );
}
