import { GalleryItem } from '../../../types/gallery';
import styles from './styles/shared.module.css';

interface DragPreviewProps {
  item: GalleryItem;
}

export const DragPreview = ({ item }: DragPreviewProps) => {
  return (
    <div className={styles.dragPreview}>
      <div className={styles.dragPreviewContent}>
        <div className={styles.dragPreviewIcon}>
          {item.type === 'folder' ? '📁' : '📊'}
        </div>
        <div className={styles.dragPreviewName}>
          {item.name}
        </div>
      </div>
    </div>
  );
};