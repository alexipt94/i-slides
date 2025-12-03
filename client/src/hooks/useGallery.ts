import { useCallback, useState } from 'react';
import { ContextMenuState, FolderItem, GalleryItem, PresentationItem } from '../types/gallery';

// Моковые данные для демонстрации
const mockPresentations: PresentationItem[] = [
  {
    id: 'pres-1',
    name: 'Квартальный отчет Q1',
    type: 'presentation',
    parentId: null,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    author: 'Иван Петров',
    thumbnail: 'https://via.placeholder.com/120x80/3b82f6/ffffff?text=Q1',
    slideCount: 24,
    size: 2457600,
  },
  {
    id: 'pres-2',
    name: 'Презентация для инвесторов',
    type: 'presentation',
    parentId: 'folder-1',
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-03-25T16:20:00Z',
    author: 'Анна Сидорова',
    thumbnail: 'https://via.placeholder.com/120x80/10b981/ffffff?text=INV',
    slideCount: 18,
    size: 1887436,
  },
  {
    id: 'pres-3',
    name: 'Обучение новых сотрудников',
    type: 'presentation',
    parentId: null,
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-28T13:10:00Z',
    author: 'Петр Иванов',
    thumbnail: 'https://via.placeholder.com/120x80/8b5cf6/ffffff?text=NEW',
    slideCount: 32,
    size: 3145728,
  },
];

const mockFolders: FolderItem[] = [
  {
    id: 'folder-1',
    name: 'Рабочие проекты',
    type: 'folder',
    parentId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-25T16:20:00Z',
    author: 'Иван Петров',
    isExpanded: true,
    childrenCount: 3,
  },
  {
    id: 'folder-2',
    name: 'Архив 2023',
    type: 'folder',
    parentId: null,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-10T11:30:00Z',
    author: 'Система',
    isExpanded: false,
    childrenCount: 12,
  },
];

export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([
    ...mockFolders,
    ...mockPresentations.filter(p => !p.parentId),
  ]);
  
  const [folders, setFolders] = useState<FolderItem[]>(mockFolders);
  const [presentations, setPresentations] = useState<PresentationItem[]>(mockPresentations);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: 'Все презентации' }
  ]);

  // Получить элементы для текущей папки
  const getItemsForCurrentFolder = useCallback(() => {
    if (!currentFolderId) {
      return items.filter(item => !item.parentId);
    }
    
    const folder = folders.find(f => f.id === currentFolderId);
    if (!folder) return [];
    
    return [
      folder,
      ...presentations.filter(p => p.parentId === currentFolderId),
    ];
  }, [currentFolderId, items, folders, presentations]);

  // Переключение выбора элемента
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  // Выделить все элементы
  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  // Снять выделение
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Переключить состояние папки (свернуть/развернуть)
  const toggleFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, isExpanded: !folder.isExpanded };
      }
      return folder;
    }));
  }, []);

  // Создать новую папку
  const createFolder = useCallback((name: string, parentId: string | null = null) => {
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Текущий пользователь',
      isExpanded: true,
      childrenCount: 0,
    };
    
    setFolders(prev => [...prev, newFolder]);
    if (!parentId || parentId === currentFolderId) {
      setItems(prev => [...prev, newFolder]);
    }
    
    return newFolder;
  }, [currentFolderId]);

  // Создать новую презентацию
  const createPresentation = useCallback((name: string, parentId: string | null = null) => {
    const newPresentation: PresentationItem = {
      id: `pres-${Date.now()}`,
      name,
      type: 'presentation',
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Текущий пользователь',
      slideCount: 1,
      size: 102400,
    };
    
    setPresentations(prev => [...prev, newPresentation]);
    if (!parentId || parentId === currentFolderId) {
      setItems(prev => [...prev, newPresentation]);
    }
    
    return newPresentation;
  }, [currentFolderId]);

  // Удалить элементы
  const deleteItems = useCallback((ids: string[]) => {
    setFolders(prev => prev.filter(folder => !ids.includes(folder.id)));
    setPresentations(prev => prev.filter(pres => !ids.includes(pres.id)));
    setItems(prev => prev.filter(item => !ids.includes(item.id)));
    clearSelection();
  }, [clearSelection]);

  // Переименовать элемент
  const renameItem = useCallback((id: string, newName: string) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === id) {
        return { ...folder, name: newName, updatedAt: new Date().toISOString() };
      }
      return folder;
    }));
    
    setPresentations(prev => prev.map(pres => {
      if (pres.id === id) {
        return { ...pres, name: newName, updatedAt: new Date().toISOString() };
      }
      return pres;
    }));
    
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, name: newName, updatedAt: new Date().toISOString() };
      }
      return item;
    }));
  }, []);

  // Переместить элементы в папку
  const moveItems = useCallback((itemIds: string[], targetFolderId: string | null) => {
    setFolders(prev => prev.map(folder => {
      if (itemIds.includes(folder.id)) {
        return { ...folder, parentId: targetFolderId, updatedAt: new Date().toISOString() };
      }
      return folder;
    }));
    
    setPresentations(prev => prev.map(pres => {
      if (itemIds.includes(pres.id)) {
        return { ...pres, parentId: targetFolderId, updatedAt: new Date().toISOString() };
      }
      return pres;
    }));
    
    // Обновляем список видимых элементов
    if (targetFolderId !== currentFolderId) {
      setItems(prev => prev.filter(item => !itemIds.includes(item.id)));
    }
    
    clearSelection();
  }, [currentFolderId, clearSelection]);

  // Обработка контекстного меню
  const handleContextMenu = useCallback((e: React.MouseEvent, item: GalleryItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      itemId: item.id,
      itemType: item.type,
    });
  }, []);

  // Закрыть контекстное меню
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Обработка действия из контекстного меню
  const handleContextMenuAction = useCallback((action: string, itemId: string) => {
    closeContextMenu();
    
    switch (action) {
      case 'open':
        console.log('Открыть', itemId);
        break;
      case 'rename':
        const newName = prompt('Введите новое название:');
        if (newName) renameItem(itemId, newName);
        break;
      case 'delete':
        if (window.confirm('Удалить выбранный элемент?')) {
          deleteItems([itemId]);
        }
        break;
      case 'new_presentation':
        const presName = prompt('Введите название презентации:');
        if (presName) createPresentation(presName, itemId);
        break;
      case 'new_folder':
        const folderName = prompt('Введите название папки:');
        if (folderName) createFolder(folderName, itemId);
        break;
      case 'collapse_all':
      case 'expand_all':
        // Логика сворачивания/разворачивания всех вложенных папок
        break;
      default:
        console.log('Действие:', action, 'для элемента:', itemId);
    }
  }, [closeContextMenu, renameItem, deleteItems, createPresentation, createFolder]);

  // Обработка массовых действий
  const handleBulkAction = useCallback((action: string) => {
    const selectedArray = Array.from(selectedIds);
    
    switch (action) {
      case 'delete':
        if (window.confirm(`Удалить ${selectedArray.length} элементов?`)) {
          deleteItems(selectedArray);
        }
        break;
      case 'move':
        const targetFolder = prompt('Введите ID целевой папки (оставьте пустым для корня):');
        moveItems(selectedArray, targetFolder || null);
        break;
      case 'copy':
        console.log('Копировать элементы:', selectedArray);
        break;
      default:
        console.log('Массовое действие:', action);
    }
  }, [selectedIds, deleteItems, moveItems]);

  // Перейти в папку
  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
    
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setBreadcrumbs([
        { id: null, name: 'Все презентации' },
        { id: folderId, name: folder.name }
      ]);
    } else {
      setBreadcrumbs([{ id: null, name: 'Все презентации' }]);
    }
  }, [folders]);

  return {
    // Состояние
    items: getItemsForCurrentFolder(),
    selectedIds,
    contextMenu,
    currentFolderId,
    breadcrumbs,
    
    // Действия с элементами
    toggleSelection,
    selectAll,
    clearSelection,
    toggleFolder,
    createFolder,
    createPresentation,
    deleteItems,
    renameItem,
    moveItems,
    
    // Контекстное меню
    handleContextMenu,
    closeContextMenu,
    handleContextMenuAction,
    
    // Массовые действия
    handleBulkAction,
    
    // Навигация
    navigateToFolder,
  };
};