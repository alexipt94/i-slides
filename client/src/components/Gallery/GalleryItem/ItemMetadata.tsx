import { GalleryItem } from '../../../types/gallery';
import styles from './styles/shared.module.css';

interface ItemMetadataProps {
  item: GalleryItem;
}

export const ItemMetadata = ({ item }: ItemMetadataProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className={styles.metadata}>
      <span className={styles.date}>
        {formatDate(item.updatedAt)}
      </span>
      {item.author && (
        <span className={styles.author}>
          {item.author}
        </span>
      )}
    </div>
  );
};