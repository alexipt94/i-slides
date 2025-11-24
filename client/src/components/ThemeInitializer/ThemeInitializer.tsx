import { useEffect } from 'react';
import { useSettings } from '../../contexts/AppContext';

// Этот компонент гарантирует, что тема применяется до рендера основного контента
export const ThemeInitializer = () => {
  const { settings } = useSettings();

  useEffect(() => {
    // Принудительно применяем тему при каждом изменении
    const root = document.documentElement;
    let actualTheme = settings.theme;
    
    if (settings.theme === 'auto') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    root.setAttribute('data-theme', actualTheme);
    console.log('🎨 ThemeInitializer: Applied theme', { 
      selected: settings.theme, 
      actual: actualTheme 
    });
  }, [settings.theme]);

  return null; // Этот компонент ничего не рендерит
};