import PageHeader from '../../components/admin/PageHeader';
import GalleryManager from '../../components/admin/GalleryManager';

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Galería"
        description="Las fotografías se guardan en Cloudinary y se optimizan automáticamente. La marcada con estrella es la fotografía principal de la portada."
      />
      <GalleryManager />
    </>
  );
}
