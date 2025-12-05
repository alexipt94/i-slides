import { useCallback, useState } from 'react';
import { ContextMenuState, FolderItem, GalleryItem, PresentationItem } from '../types/gallery';

const mockPresentations: PresentationItem[] = [
  {
    id: 'pres-1',
    name: 'Квартальный отчет Q1',
    type: 'presentation',
    parentId: null,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
    author: 'Иван Петров',
    thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=Q1-report',
    slideCount: 24,
  },
  {
    id: 'pres-2',
    name: 'Презентация для инвесторов',
    type: 'presentation',
    parentId: 'folder-1',
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-03-25T16:20:00Z',
    author: 'Анна Сидорова',
    thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=Investors',
    slideCount: 18,
  },
  {
    id: 'pres-3',
    name: 'Обучение новых сотрудников',
    type: 'presentation',
    parentId: null,
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-28T13:10:00Z',
    author: 'Петр Иванов',
    thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=Training',
    slideCount: 32,
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
  const [folders, setFolders] = useState<FolderItem[]>(mockFolders);
  const [presentations, setPresentations] = useState<PresentationItem[]>(mockPresentations);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: 'Все презентации' }
  ]);

  const getItemsForCurrentFolder = useCallback(() => {
    if (!currentFolderId) {
      return [
        ...folders.filter(f => !f.parentId),
        ...presentations.filter(p => !p.parentId),
      ];
    }

    const folder = folders.find(f => f.id === currentFolderId);
    if (!folder) return [];

    return [
      folder,
      ...presentations.filter(p => p.parentId === currentFolderId),
    ];
  }, [currentFolderId, folders, presentations]);

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

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, isExpanded: !folder.isExpanded };
      }
      return folder;
    }));
  }, []);

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
    return newFolder;
  }, []);

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
    };
    
    setPresentations(prev => [...prev, newPresentation]);
    
    // Обновляем счетчик родительской папки
    if (parentId) {
      setFolders(prev => prev.map(folder => {
        if (folder.id === parentId) {
          return { 
            ...folder, 
            childrenCount: folder.childrenCount + 1,
            updatedAt: new Date().toISOString()
          };
        }
        return folder;
      }));
    }
    
    return newPresentation;
  }, []);

  const deleteItems = useCallback((ids: string[]) => {
    // Удаляем папки
    setFolders(prev => prev.filter(folder => !ids.includes(folder.id)));
    
    // Удаляем презентации
    const deletedPresentations = presentations.filter(p => ids.includes(p.id));
    setPresentations(prev => prev.filter(pres => !ids.includes(pres.id)));
    
    // Обновляем счетчики родительских папок
    deletedPresentations.forEach(pres => {
      if (pres.parentId) {
        setFolders(prev => prev.map(folder => {
          if (folder.id === pres.parentId) {
            return { 
              ...folder, 
              childrenCount: Math.max(0, folder.childrenCount - 1),
              updatedAt: new Date().toISOString()
            };
          }
          return folder;
        }));
      }
    });
    
    clearSelection();
  }, [presentations, clearSelection]);

  const renameItem = useCallback((id: string, newName: string) => {
    // Переименовываем папки
    setFolders(prev => prev.map(folder => {
      if (folder.id === id) {
        return { ...folder, name: newName, updatedAt: new Date().toISOString() };
      }
      return folder;
    }));
    
    // Переименовываем презентации
    setPresentations(prev => prev.map(pres => {
      if (pres.id === id) {
        return { ...pres, name: newName, updatedAt: new Date().toISOString() };
      }
      return pres;
    }));
  }, []);

  const moveItems = useCallback((itemIds: string[], targetFolderId: string | null) => {
    // Проверяем, что не перемещаем папку саму в себя
    if (itemIds.includes(targetFolderId || '')) {
      console.warn('Cannot move folder into itself');
      return;
    }
  
    // Обновляем parentId у перемещаемых элементов
    setPresentations(prev => {
      const updated = [...prev];
      const movedPresentations: PresentationItem[] = [];
  
      itemIds.forEach(itemId => {
        const index = updated.findIndex(p => p.id === itemId);
        if (index !== -1) {
          const oldPresentation = updated[index];
          const oldParentId = oldPresentation.parentId;
          
          // Обновляем счетчики старой папки
          if (oldParentId) {
            setFolders(folders => folders.map(f => {
              if (f.id === oldParentId) {
                return { 
                  ...f, 
                  childrenCount: Math.max(0, f.childrenCount - 1),
                  updatedAt: new Date().toISOString()
                };
              }
              return f;
            }));
          }
          
          // Обновляем счетчики новой папки
          if (targetFolderId) {
            setFolders(folders => folders.map(f => {
              if (f.id === targetFolderId) {
                return { 
                  ...f, 
                  childrenCount: f.childrenCount + 1,
                  updatedAt: new Date().toISOString()
                };
              }
              return f;
            }));
          }
          
          movedPresentations.push(oldPresentation);
          updated[index] = { 
            ...oldPresentation, 
            parentId: targetFolderId,
            updatedAt: new Date().toISOString()
          };
        }
      });
  
      return updated;
    });
  
    // Также обновляем папки если нужно
    setFolders(prev => prev.map(folder => {
      if (itemIds.includes(folder.id)) {
        return { 
          ...folder, 
          parentId: targetFolderId,
          updatedAt: new Date().toISOString()
        };
      }
      return folder;
    }));
  
    clearSelection();
  }, [clearSelection]);

  const handleContextMenu = useCallback((e: React.MouseEvent, item: GalleryItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      itemId: item.id,
      itemType: item.type,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

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
      default:
        console.log('Действие:', action, 'для элемента:', itemId);
    }
  }, [closeContextMenu, renameItem, deleteItems, createPresentation, createFolder]);

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
    items: getItemsForCurrentFolder(),
    folders,
    presentations,
    selectedIds,
    contextMenu,
    currentFolderId,
    breadcrumbs,
    toggleSelection,
    clearSelection,
    toggleFolder,
    createFolder,
    createPresentation,
    deleteItems,
    renameItem,
    moveItems,
    handleContextMenu,
    closeContextMenu,
    handleContextMenuAction,
    handleBulkAction,
    navigateToFolder,
  };
};