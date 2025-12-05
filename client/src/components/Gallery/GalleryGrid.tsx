import { ReactNode } from 'react';
import styles from './GalleryGrid.module.css';

interface GalleryGridProps {
  children: ReactNode;
  isEmpty?: boolean;
}

export const GalleryGrid = ({ children, isEmpty = false }: GalleryGridProps) => {
  if (isEmpty) {
    return (
      <div className={styles.emptyGrid}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>📂</div>
          <h3>Папка пуста</h3>
          <p>Создайте новую презентацию или перетащите файлы сюда</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {children}
    </div>
  );
};