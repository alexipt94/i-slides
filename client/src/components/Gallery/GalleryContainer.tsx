import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import { GalleryItem } from '../../types/gallery';
import styles from './GalleryContainer.module.css';
import { DragPreview } from './GalleryItem/DragPreview';
import { SortableGalleryItem } from './GalleryItem/SortableGalleryItem';

interface GalleryContainerProps {
  items: GalleryItem[];
  selectedIds: Set<string>;
  onItemSelect: (id: string) => void;
  onItemRename: (id: string, newName: string) => void;
  onItemMove: (draggedId: string, targetFolderId: string | null) => void;
  onFolderToggle: (folderId: string) => void;
}

export const GalleryContainer = ({
  items,
  selectedIds,
  onItemSelect,
  onItemRename,
  onItemMove,
  onFolderToggle,
}: GalleryContainerProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);
    setIsDragging(true);
    const item = items.find(item => item.id === id);
    setActiveItem(item || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveItem(null);
    setIsDragging(false);

    if (over && active.id !== over.id) {
      const draggedId = active.id as string;
      const targetId = over.id as string;
      const targetItem = items.find(item => item.id === targetId);
      
      if (targetItem?.type === 'folder') {
        onItemMove(draggedId, targetId);
      } else {
        onItemMove(draggedId, null);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveItem(null);
    setIsDragging(false);
  };

  const itemIds = useMemo(() => items.map(item => item.id), [items]);

  return (
    <div className={styles.container}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext 
          items={itemIds} 
          strategy={verticalListSortingStrategy}
        >
          <div className={`${styles.grid} ${isDragging ? styles.dragging : ''}`}>
            {items.map((item) => (
              <SortableGalleryItem
                key={item.id}
                item={item}
                isSelected={selectedIds.has(item.id)}
                onSelect={onItemSelect}
                onRename={onItemRename}
                onFolderToggle={onFolderToggle}
                isDragging={activeId === item.id}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div style={{ 
              transform: 'rotate(3deg) scale(1.05)',
              cursor: 'grabbing',
              transition: 'transform 0.1s ease'
            }}>
              <DragPreview item={activeItem} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};