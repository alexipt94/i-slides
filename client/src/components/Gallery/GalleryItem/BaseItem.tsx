import { ReactNode, useState } from 'react';
import { GalleryItem } from '../../../types/gallery';
import { InlineEditor } from './InlineEditor';
import { ItemActions } from './ItemActions';
import { ItemMetadata } from './ItemMetadata';
import { ItemSelection } from './ItemSelection';
import { ItemThumbnail } from './ItemThumbnail';
import styles from './styles/base.module.css';

interface BaseItemProps {
  item: GalleryItem;
  isSelected: boolean;
  isDragging?: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  children?: ReactNode;
  renderContent: () => ReactNode;
}

export const BaseItem = ({
  item,
  isSelected,
  isDragging = false,
  onSelect,
  onRename,
  children,
  renderContent,
}: BaseItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameSave = () => {
    if (editedName.trim() && editedName !== item.name) {
      onRename(item.id, editedName.trim());
    }
    setIsEditing(false);
  };

  const handleNameCancel = () => {
    setEditedName(item.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  return (
    <div
      className={`
        ${styles.container}
        ${isSelected ? styles.selected : ''}
        ${isDragging ? styles.dragging : ''}
        ${item.type === 'folder' ? styles.folder : styles.presentation}
      `}
      data-item-id={item.id}
      data-item-type={item.type}
    >
      <div className={styles.header}>
        <ItemSelection
          isSelected={isSelected}
          onSelect={() => onSelect(item.id)}
          itemType={item.type}
        />
        
        <ItemThumbnail
          item={item}
          onDoubleClick={handleNameClick}
        />

        <div className={styles.titleSection}>
          {isEditing ? (
            <InlineEditor
              value={editedName}
              onChange={setEditedName}
              onSave={handleNameSave}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <h3
              className={styles.title}
              onClick={handleNameClick}
              title={item.name}
            >
              {item.name}
            </h3>
          )}
          
          <ItemMetadata item={item} />
        </div>

        <ItemActions item={item} />
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>

      {children}
    </div>
  );
};