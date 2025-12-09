import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  FolderItem as FolderItemType,
  GalleryItem,
  PresentationItem as PresentationItemType
} from '../../../types/gallery';
import { FolderItem } from './FolderItem';
import { PresentationItem } from './PresentationItem';

interface DraggableGalleryItemProps {
  item: GalleryItem;
  isSelected: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onFolderToggle: (folderId: string) => void;
}

export const DraggableGalleryItem = ({
  item,
  isSelected,
  isDragging = false,
  isDropTarget = false,
  onSelect,
  onRename,
  onFolderToggle,
}: DraggableGalleryItemProps) => {
  // Используем useDraggable для возможности перетаскивания
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging: isDndDragging,
  } = useDraggable({
    id: item.id,
    data: {
      type: item.type,
      item,
    },
  });

  // Используем useDroppable только для папок (чтобы в них можно было бросать)
  const {
    setNodeRef: setDroppableRef,
    isOver,
  } = useDroppable({
    id: item.id,
    disabled: item.type !== 'folder', // ✅ Только папки могут принимать элементы
    data: {
      accepts: ['presentation', 'folder'],
    },
  });

  // Объединяем ref для draggable и droppable
  const setRefs = (node: HTMLElement | null) => {
    setDraggableRef(node);
    if (item.type === 'folder') {
      setDroppableRef(node);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDndDragging ? 0.5 : 1,
    zIndex: isDndDragging ? 1000 : 'auto',
    transition: isDndDragging ? 'none' : 'transform 0.2s ease',
  };

  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      {...listeners}
      data-item-id={item.id}
      data-item-type={item.type}
      data-dragging={isDndDragging}
      data-drop-target={isDropTarget || isOver}
    >
      {item.type === 'folder' ? (
        <FolderItem
          item={item as FolderItemType}
          isSelected={isSelected}
          isDragging={isDragging || isDndDragging}
          isDropTarget={isDropTarget || isOver}
          onSelect={() => onSelect(item.id)}
          onRename={(newName: string) => onRename(item.id, newName)}
          onFolderToggle={() => onFolderToggle(item.id)}
        />
      ) : (
        <PresentationItem
          item={item as PresentationItemType}
          isSelected={isSelected}
          isDragging={isDragging || isDndDragging}
          isDropTarget={isDropTarget}
          onSelect={() => onSelect(item.id)}
          onRename={(newName: string) => onRename(item.id, newName)}
        />
      )}
    </div>
  );
};