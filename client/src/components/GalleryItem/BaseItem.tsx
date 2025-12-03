import { ReactNode } from 'react';
import { GalleryItem } from '../../types/gallery';
import styles from './GalleryItem.module.css';

interface BaseItemProps {
  item: GalleryItem;
  isSelected: boolean;
  onContextMenu: (e: React.MouseEvent, item: GalleryItem) => void;
  onDragStart: (e: React.DragEvent, item: GalleryItem) => void;
  onDrop: (e: React.DragEvent, item: GalleryItem) => void;
  onDragOver: (e: React.DragEvent) => void;
  children: ReactNode;
  isExpanded?: boolean;
}

export const BaseItem = ({
  item,
  isSelected,
  onContextMenu,
  onDragStart,
  onDrop,
  onDragOver,
  children,
  isExpanded = true,
}: BaseItemProps) => {
  const isFolder = item.type === 'folder';
  
  return (
    <div
      className={`${styles.itemContainer} ${isSelected ? styles.selected : ''} ${isFolder ? styles.folder : ''}`}
      draggable={!isSelected}
      onDragStart={(e) => onDragStart(e, item)}
      onDrop={(e) => onDrop(e, item)}
      onDragOver={onDragOver}
      onContextMenu={(e) => onContextMenu(e, item)}
      data-item-id={item.id}
      data-item-type={item.type}
      data-expanded={isFolder ? isExpanded : undefined}
    >
      <div className={styles.itemContent}>
        {children}
      </div>
    </div>
  );
};