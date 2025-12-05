import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FolderItem as FolderItemType,
  GalleryItem,
  PresentationItem as PresentationItemType
} from '../../../types/gallery';
import { FolderItem } from './FolderItem';
import { PresentationItem } from './PresentationItem';

interface SortableGalleryItemProps {
  item: GalleryItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onFolderToggle: (folderId: string) => void;
  isDragging?: boolean;
}

export const SortableGalleryItem = ({
  item,
  isSelected,
  onSelect,
  onRename,
  onFolderToggle,
  isDragging,
}: SortableGalleryItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isDndDragging,
  } = useSortable({ 
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDndDragging ? 0.4 : 1,
    zIndex: isDndDragging ? 1000 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-dragging={isDndDragging}
    >
      {item.type === 'folder' ? (
        <FolderItem
          item={item as FolderItemType}
          isSelected={isSelected}
          isDragging={isDragging || isDndDragging}
          onSelect={() => onSelect(item.id)}
          onRename={(newName: string) => onRename(item.id, newName)}
          onFolderToggle={() => onFolderToggle(item.id)}
        />
      ) : (
        <PresentationItem
          item={item as PresentationItemType}
          isSelected={isSelected}
          isDragging={isDragging || isDndDragging}
          onSelect={() => onSelect(item.id)}
          onRename={(newName: string) => onRename(item.id, newName)}
        />
      )}
    </div>
  );
};