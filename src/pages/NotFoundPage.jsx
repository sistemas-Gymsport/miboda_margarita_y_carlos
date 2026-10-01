import { Link } from 'react-router-dom';
import Ornament from '../components/Ornament';
import styles from '../components/ErrorState.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>Esta página no existe</h1>
      <Ornament immediate width={140} />
      <p className={styles.message}>Es posible que el enlace esté incompleto.</p>
      <Link to="/" style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
        Ver la invitación
      </Link>
    </main>
  );
}
