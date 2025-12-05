import { Folder, FolderOpen, Presentation } from 'lucide-react';
import styles from './styles/shared.module.css';

interface ItemThumbnailProps {
  item: {
    type: 'folder' | 'presentation';
    thumbnail?: string;
    isExpanded?: boolean;
  };
  onDoubleClick?: () => void;
}

export const ItemThumbnail = ({ item, onDoubleClick }: ItemThumbnailProps) => {
  if (item.type === 'presentation' && item.thumbnail) {
    return (
      <div className={styles.thumbnailContainer} onDoubleClick={onDoubleClick}>
        <img
          src={item.thumbnail}
          alt="Миниатюра презентации"
          className={styles.thumbnailImage}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className={styles.thumbnailFallback}>
          <Presentation size={32} />
        </div>
      </div>
    );
  }

  if (item.type === 'folder') {
    return (
      <div className={styles.folderThumbnail} onDoubleClick={onDoubleClick}>
        {item.isExpanded ? (
          <FolderOpen size={40} className={styles.folderIconOpen} />
        ) : (
          <Folder size={40} className={styles.folderIconClosed} />
        )}
      </div>
    );
  }

  return (
    <div className={styles.defaultThumbnail} onDoubleClick={onDoubleClick}>
      <Presentation size={32} />
    </div>
  );
};