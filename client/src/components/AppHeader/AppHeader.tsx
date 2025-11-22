import { useSettings, useUser } from '../../contexts/AppContext';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styles from './AppHeader.module.css';

export function AppHeader() {
  const { user } = useUser();
  const { settings } = useSettings();

  return (
    <header className={styles.header} data-theme={settings.theme}>
      <div className={styles.logo}>
        <h1>i-slides 🚀</h1>
        <span className={styles.subtitle}>Интерактивные презентации</span>
      </div>
      
      <div className={styles.controls}>
        <ThemeToggle />
        
        {user && (
          <div className={styles.user}>
            <div className={styles.avatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className={styles.name}>{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}