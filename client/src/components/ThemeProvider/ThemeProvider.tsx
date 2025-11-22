import { useEffect } from 'react';
import { useSettings } from '../../contexts/AppContext';

// Этот компонент гарантирует, что тема будет применена к документу
// даже если контекст еще не полностью инициализирован
export function ThemeProvider() {
  const { settings } = useSettings();

  useEffect(() => {
    // Применяем тему к корневому элементу документа
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Также добавляем класс для плавных переходов после загрузки
    setTimeout(() => {
      document.body.classList.add('theme-loaded');
    }, 100);
  }, [settings.theme]);

  return null;
}