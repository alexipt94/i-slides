import { GalleryItem } from '../../../types/gallery';
import { PresentationItem } from './PresentationItem';
import styles from './styles/folder.module.css';

interface FolderChildGridProps {
  items: GalleryItem[];
}

export const FolderChildGrid = ({ items }: FolderChildGridProps) => {
  return (
    <div className={styles.childGrid}>
      {items.map((item) => (
        <div key={item.id} className={styles.childItem}>
          {item.type === 'presentation' && (
            <PresentationItem
              item={item as any}
              isSelected={false}
              onSelect={() => {}}
              onRename={() => {}}
            />
          )}
        </div>
      ))}
    </div>
  );
};