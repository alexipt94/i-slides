import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers'; // ✅ Импортируем модификатор
import { useState } from 'react';
import { GalleryItem } from '../../types/gallery';
import styles from './GalleryContainer.module.css';
import { DragPreview } from './GalleryItem/DragPreview';
import { DraggableGalleryItem } from './GalleryItem/DraggableGalleryItem';

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
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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
    
    const item = items.find(item => item.id === id);
    setActiveItem(item || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    if (over) {
      const overItem = items.find(item => item.id === over.id);
      // Только папки могут быть drop-целями
      if (overItem?.type === 'folder') {
        setDragOverId(over.id as string);
      } else {
        setDragOverId(null);
      }
    } else {
      setDragOverId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const draggedId = active.id as string;
      const targetId = over.id as string;
      const targetItem = items.find(item => item.id === targetId);
      
      // Перемещаем только в папки
      if (targetItem?.type === 'folder') {
        onItemMove(draggedId, targetId);
      } else {
        // Если бросили не на папку - перемещаем в корень
        onItemMove(draggedId, null);
      }
    }
    
    // Сбрасываем состояния
    setActiveId(null);
    setActiveItem(null);
    setDragOverId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveItem(null);
    setDragOverId(null);
  };

  return (
    <div className={styles.container}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToWindowEdges]} // ✅ Ограничиваем границами окна
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className={styles.grid}>
          {items.map((item) => (
            <DraggableGalleryItem
              key={item.id}
              item={item}
              isSelected={selectedIds.has(item.id)}
              isDragging={activeId === item.id}
              isDropTarget={dragOverId === item.id}
              onSelect={onItemSelect}
              onRename={onItemRename}
              onFolderToggle={onFolderToggle}
            />
          ))}
        </div>

        <DragOverlay>
          {activeItem && (
            <div style={{
              transform: 'rotate(3deg) scale(1.05)',
              cursor: 'grabbing',
              opacity: 0.9,
            }}>
              <DragPreview item={activeItem} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};