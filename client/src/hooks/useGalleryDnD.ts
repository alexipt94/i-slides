import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useCallback, useState } from 'react';
import { GalleryItem } from '../types/gallery';

interface UseGalleryDnDProps {
  items: GalleryItem[];
  onItemMove: (draggedId: string, targetFolderId: string | null) => void;
}

export const useGalleryDnD = ({ items, onItemMove }: UseGalleryDnDProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);
    const item = items.find(item => item.id === id);
    setActiveItem(item || null);
  }, [items]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const draggedId = active.id as string;
      const targetId = over.id as string;
      const targetItem = items.find(item => item.id === targetId);
      
      // Проверяем, можно ли перетащить в цель
      if (targetItem?.type === 'folder') {
        onItemMove(draggedId, targetId);
      } else {
        onItemMove(draggedId, null);
      }
    }
    
    setActiveId(null);
    setActiveItem(null);
    setDragOverId(null);
  }, [items, onItemMove]);

  const handleDragOver = useCallback((id: string | null) => {
    setDragOverId(id);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveItem(null);
    setDragOverId(null);
  }, []);

  return {
    activeId,
    activeItem,
    dragOverId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragCancel,
  };
};