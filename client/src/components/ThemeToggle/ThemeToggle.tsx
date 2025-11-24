import { useSettings } from '../../contexts/AppContext';
import styles from './ThemeToggle.module.css';

export const ThemeToggle = () => {
  const { settings, updateSettings } = useSettings();

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    
    console.log('🔄 Switching theme from', settings.theme, 'to', newTheme);
    updateSettings({ theme: newTheme });
  };

  const getThemeIcon = () => {
    if (settings.theme === 'auto') {
      return '⚙️';
    }
    return settings.theme === 'light' ? '☀️' : '🌙';
  };

  const getThemeText = () => {
    if (settings.theme === 'auto') {
      return 'Авто';
    }
    return settings.theme === 'light' ? 'Светлая' : 'Темная';
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Текущая тема: ${getThemeText()}. Нажмите для смены.`}
      title={`Текущая тема: ${getThemeText()}`}
    >
      <span className={styles.icon}>
        {getThemeIcon()}
      </span>
      <span className={styles.text}>
        {getThemeText()}
      </span>
    </button>
  );
};