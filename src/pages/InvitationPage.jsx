import { useEffect, useState } from 'react';
import WeddingLoader from '../components/WeddingLoader';
import ErrorState from '../components/ErrorState';
import InvitationLayout from '../layouts/InvitationLayout';
import { useInvitation } from '../hooks/useInvitation';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { applyTheme } from '../utils/theme';

/** Pagina publica: maneja carga (incluido cold start), error y exito. */
export default function InvitationPage() {
  const { data, status, error, isWaking, retry } = useInvitation();
  const [slow, setSlow] = useState(false);

  useDocumentMeta(data);

  useEffect(() => {
    if (data?.theme) applyTheme(data.theme);
  }, [data?.theme]);

  useEffect(() => {
    if (status !== 'loading') return undefined;
    setSlow(false);
    const timer = setTimeout(() => setSlow(true), 3500);
    return () => clearTimeout(timer);
  }, [status]);

  if (status === 'error' && !data) {
    return (
      <ErrorState
        message={error?.status === 404 ? 'La invitación aún no está disponible.' : undefined}
        onRetry={retry}
      />
    );
  }

  if (!data) {
    return (
      <WeddingLoader
        fullscreen
        label="Preparando la invitación"
        hint={isWaking || slow ? 'Un momento, estamos cuidando cada detalle' : undefined}
      />
    );
  }

  return <InvitationLayout invitation={data} />;
}
