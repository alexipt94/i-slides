import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { useCallback, useState } from 'react';

interface UseDragAndDropProps {
  onItemMove: (draggedId: string, targetFolderId: string | null) => void;
}

export const useDragAndDrop = ({ onItemMove }: UseDragAndDropProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [wasDropped, setWasDropped] = useState(false);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);
    setWasDropped(false);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    
    if (over) {
      setDragOverId(over.id as string);
    } else {
      setDragOverId(null);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    // ✅ Перемещаем только если отпустили над другим элементом
    if (over && active.id !== over.id) {
      const draggedId = active.id as string;
      const targetId = over.id as string;
      
      // Перемещаем элемент
      onItemMove(draggedId, targetId);
      setWasDropped(true);
    } else {
      // Не над элементом - возвращаем на место
      setWasDropped(true);
    }
    
    // Сбрасываем состояния
    setTimeout(() => {
      setActiveId(null);
      setDragOverId(null);
      setWasDropped(false);
    }, 150);
  }, [onItemMove]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setDragOverId(null);
    setWasDropped(false);
  }, []);

  return {
    activeId,
    dragOverId,
    wasDropped,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
};