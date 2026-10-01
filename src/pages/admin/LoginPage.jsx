import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CircleAlert, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Field from '../../components/admin/Field';
import WeddingLoader from '../../components/WeddingLoader';
import { BrandMark } from '../../components/admin/Sidebar';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (status === 'authenticated') return <Navigate to={location.state?.from || '/admin'} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Escribe tu usuario y contraseña.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await login(username.trim(), password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err.status === 0 ? 'El servidor está iniciando. Inténtalo de nuevo en unos segundos.' : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {submitting ? <WeddingLoader overlay label="Iniciando sesión" /> : null}
      <form className={styles.card} onSubmit={onSubmit} noValidate>
        <div className={styles.mark}>
          <BrandMark />
        </div>
        <h1 className={styles.title}>Panel de la invitación</h1>
        <p className={styles.subtitle}>Inicia sesión para editar tu invitación.</p>

        {error ? (
          <div className="a-alert is-error" role="alert">
            <CircleAlert size={16} aria-hidden="true" /> {error}
          </div>
        ) : null}

        <Field label="Usuario" value={username} onChange={setUsername} autoComplete="username" autoFocus required />
        <Field label="Contraseña" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />

        <button type="submit" className="a-btn a-btn-primary" disabled={submitting}>
          <Lock size={16} aria-hidden="true" /> Entrar
        </button>
      </form>
    </div>
  );
}
