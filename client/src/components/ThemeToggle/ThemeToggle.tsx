import { useSettings } from '../../contexts/AppContext';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { settings, updateSettings } = useSettings();

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  const getThemeIcon = () => {
    switch (settings.theme) {
      case 'dark':
        return '☀️';
      case 'auto':
        return '⚙️';
      default:
        return '🌙';
    }
  };

  const getThemeText = () => {
    switch (settings.theme) {
      case 'dark':
        return 'Светлая тема';
      case 'auto':
        return 'Авто тема';
      default:
        return 'Темная тема';
    }
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span className={styles.icon}>
        {getThemeIcon()}
      </span>
      <span className={styles.text}>
        {getThemeText()}
      </span>
    </button>
  );
}