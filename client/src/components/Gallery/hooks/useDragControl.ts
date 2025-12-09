import { useEffect } from 'react';

export const useDragControl = (isDragging: boolean) => {
  useEffect(() => {
    if (isDragging) {
      // Блокируем скролл страницы при перетаскивании
      document.body.style.overflow = 'hidden';
      document.body.style.userSelect = 'none';
      
      // Добавляем обработчик для Escape
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          // Можно добавить логику отмены перетаскивания
          document.dispatchEvent(new Event('drag-cancel'));
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.userSelect = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isDragging]);
};