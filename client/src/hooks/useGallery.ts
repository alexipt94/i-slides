import { useCallback, useEffect, useState } from 'react';
import { useNotifications } from '../contexts/AppContext';
import {
  BreadcrumbItem,
  FolderItem,
  GalleryItem,
  PresentationItem
} from '../types/gallery';

// Вспомогательные функции
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Моковые данные (временно, до подключения API)
const mockFolders: FolderItem[] = [
  {
    id: 'folder-1',
    name: 'Рабочие проекты',
    type: 'folder',
    parentId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-25T16:20:00Z',
    author: 'Иван Петров',
    isExpanded: false,
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
  {
    id: 'folder-3',
    name: 'Личные',
    type: 'folder',
    parentId: null,
    createdAt: '2024-02-15T14:30:00Z',
    updatedAt: '2024-03-28T09:15:00Z',
    author: 'Текущий пользователь',
    isExpanded: false,
    childrenCount: 5,
  },
];

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
    thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=INV',
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
    thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=NEW',
    slideCount: 32,
  },
  {
    id: 'pres-4',
    name: 'План развития на 2024',
    type: 'presentation',
    parentId: 'folder-1',
    createdAt: '2024-02-28T15:45:00Z',
    updatedAt: '2024-03-22T11:20:00Z',
    author: 'Иван Петров',
    thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=2024',
    slideCount: 42,
  },
  {
    id: 'pres-5',
    name: 'Результаты A/B тестирования',
    type: 'presentation',
    parentId: 'folder-3',
    createdAt: '2024-03-15T13:30:00Z',
    updatedAt: '2024-03-27T17:05:00Z',
    author: 'Анна Сидорова',
    thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=AB-test',
    slideCount: 28,
  },
  {
    id: 'pres-6',
    name: 'Презентация продукта X',
    type: 'presentation',
    parentId: null,
    createdAt: '2024-03-10T16:20:00Z',
    updatedAt: '2024-03-26T10:40:00Z',
    author: 'Петр Иванов',
    thumbnail: 'https://api.dicebear.com/7.x/shapes/svg?seed=Product-X',
    slideCount: 36,
  },
];

export const useGallery = () => {
  const { addNotification } = useNotifications();
  
  // Основные состояния
  const [folders, setFolders] = useState<FolderItem[]>(mockFolders);
  const [presentations, setPresentations] = useState<PresentationItem[]>(mockPresentations);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: 'Все презентации' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Получение элементов для текущей папки
  const getItemsForCurrentFolder = useCallback((): GalleryItem[] => {
    if (!currentFolderId) {
      // Корень - показываем все папки и презентации без parentId
      const rootFolders = folders.filter(f => f.parentId === null);
      const rootPresentations = presentations.filter(p => p.parentId === null);
      return [...rootFolders, ...rootPresentations];
    }

    // Конкретная папка - показываем папку и ее содержимое
    const currentFolder = folders.find(f => f.id === currentFolderId);
    if (!currentFolder) return [];

    const childPresentations = presentations.filter(p => p.parentId === currentFolderId);
    return [currentFolder, ...childPresentations];
  }, [currentFolderId, folders, presentations]);

  // Получение дочерних элементов для папки (для разворачивания)
  const getChildItems = useCallback((folderId: string): GalleryItem[] => {
    return presentations.filter(p => p.parentId === folderId);
  }, [presentations]);

  // Управление выделением
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

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Управление папками
  const toggleFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, isExpanded: !folder.isExpanded };
      }
      return folder;
    }));
  }, []);

  // Создание элементов
  const createFolder = useCallback((name: string, parentId: string | null = null) => {
    if (!name.trim()) {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Введите название папки'
      });
      return null;
    }

    const newFolder: FolderItem = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: 'folder',
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Текущий пользователь',
      isExpanded: false,
      childrenCount: 0,
    };

    setFolders(prev => [...prev, newFolder]);

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

    addNotification({
      type: 'success',
      title: 'Папка создана',
      message: `Папка "${name}" успешно создана`
    });

    return newFolder;
  }, [addNotification]);

  const createPresentation = useCallback((name: string, parentId: string | null = null) => {
    if (!name.trim()) {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Введите название презентации'
      });
      return null;
    }

    const newPresentation: PresentationItem = {
      id: `pres-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: 'presentation',
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Текущий пользователь',
      thumbnail: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}`,
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

    addNotification({
      type: 'success',
      title: 'Презентация создана',
      message: `Презентация "${name}" успешно создана`
    });

    return newPresentation;
  }, [addNotification]);

  // Удаление элементов (исправленный счетчик)
  const deleteItems = useCallback((ids: string[]) => {
    // Фильтруем удаляемые элементы
    const itemsToDelete = ids;
    
    // Получаем родительские папки для обновления счетчиков
    const parentFolders = new Map<string, number>();
    
    // Считаем сколько элементов удаляется из каждой папки
    presentations.forEach(pres => {
      if (itemsToDelete.includes(pres.id) && pres.parentId) {
        parentFolders.set(pres.parentId, (parentFolders.get(pres.parentId) || 0) + 1);
      }
    });
    
    folders.forEach(folder => {
      if (itemsToDelete.includes(folder.id) && folder.parentId) {
        parentFolders.set(folder.parentId, (parentFolders.get(folder.parentId) || 0) + 1);
      }
    });

    // Удаляем элементы
    setFolders(prev => prev.filter(folder => !ids.includes(folder.id)));
    setPresentations(prev => prev.filter(pres => !ids.includes(pres.id)));

    // Обновляем счетчики родительских папок
    parentFolders.forEach((count, folderId) => {
      setFolders(prev => prev.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            childrenCount: Math.max(0, folder.childrenCount - count),
            updatedAt: new Date().toISOString()
          };
        }
        return folder;
      }));
    });

    // Очищаем выделение
    clearSelection();

    addNotification({
      type: 'success',
      title: 'Элементы удалены',
      message: `Удалено ${ids.length} элементов`
    });
  }, [presentations, folders, clearSelection, addNotification]);

  // Переименование
  const renameItem = useCallback((id: string, newName: string) => {
    if (!newName.trim()) {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: 'Введите новое название'
      });
      return;
    }

    let itemType = '';
    
    // Обновляем папки
    setFolders(prev => prev.map(folder => {
      if (folder.id === id) {
        itemType = 'папку';
        return { 
          ...folder, 
          name: newName, 
          updatedAt: new Date().toISOString() 
        };
      }
      return folder;
    }));

    // Обновляем презентации
    setPresentations(prev => prev.map(pres => {
      if (pres.id === id) {
        itemType = 'презентацию';
        return { 
          ...pres, 
          name: newName, 
          updatedAt: new Date().toISOString() 
        };
      }
      return pres;
    }));

    addNotification({
      type: 'success',
      title: 'Переименование',
      message: `${itemType} успешно переименована`
    });
  }, [addNotification]);

  // Перемещение элементов (ОЧЕНЬ ВАЖНО - исправленная версия)
  const moveItems = useCallback((itemIds: string[], targetFolderId: string | null): boolean => {
    // ✅ ОСНОВНОЕ ИСПРАВЛЕНИЕ: НЕ перемещаем если targetFolderId === null
    // Элемент должен остаться на месте, если не брошен в папку
    if (targetFolderId === null) {
      console.log('Отмена перемещения: элемент не был брошен в папку');
      return false;
    }

    // Проверяем, что targetFolderId существует и это действительно папка
    const targetFolder = folders.find(f => f.id === targetFolderId);
  if (!targetFolder) {
    console.log('Отмена перемещения: папка не найдена', targetFolderId);
    addNotification({
      type: 'error',
      title: 'Ошибка перемещения',
      message: 'Целевая папка не найдена'
    });
    return false;
  }

    // Получаем информацию о перемещаемых элементах
    const movedItems = {
      folders: [] as FolderItem[],
      presentations: [] as PresentationItem[]
    };

    // Фильтруем элементы и собираем информацию
    itemIds.forEach(id => {
      const folder = folders.find(f => f.id === id);
      if (folder) movedItems.folders.push(folder);
      
      const presentation = presentations.find(p => p.id === id);
      if (presentation) movedItems.presentations.push(presentation);
    });

    // Обновляем родительские папки (старые родители)
    const oldParentIds = new Set<string>();
    
    movedItems.folders.forEach(folder => {
      if (folder.parentId) oldParentIds.add(folder.parentId);
    });
    
    movedItems.presentations.forEach(presentation => {
      if (presentation.parentId) oldParentIds.add(presentation.parentId);
    });

    // Обновляем счетчики старых родительских папок
    oldParentIds.forEach(parentId => {
      const movedFromThisFolder = [
        ...movedItems.folders.filter(f => f.parentId === parentId),
        ...movedItems.presentations.filter(p => p.parentId === parentId)
      ].length;

      setFolders(prev => prev.map(folder => {
        if (folder.id === parentId) {
          return {
            ...folder,
            childrenCount: Math.max(0, folder.childrenCount - movedFromThisFolder),
            updatedAt: new Date().toISOString()
          };
        }
        return folder;
      }));
    });

    // Обновляем элементы - устанавливаем новый parentId
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

    setPresentations(prev => prev.map(pres => {
      if (itemIds.includes(pres.id)) {
        return {
          ...pres,
          parentId: targetFolderId,
          updatedAt: new Date().toISOString()
        };
      }
      return pres;
    }));

    // Обновляем счетчик целевой папки
    const totalMovedItems = movedItems.folders.length + movedItems.presentations.length;
    setFolders(prev => prev.map(folder => {
      if (folder.id === targetFolderId) {
        return {
          ...folder,
          childrenCount: folder.childrenCount + totalMovedItems,
          updatedAt: new Date().toISOString()
        };
      }
      return folder;
    }));

    // Очищаем выделение
    clearSelection();

    // Уведомление
    addNotification({
      type: 'success',
      title: 'Перемещение',
      message: `Перемещено ${totalMovedItems} элементов в папку "${targetFolder.name}"`
    });

    return true;
  }, [folders, presentations, clearSelection, addNotification]);

  // Функция для перемещения одного элемента (используется в GalleryContainer)
  const handleItemMove = useCallback((draggedId: string, targetFolderId: string | null) => {
    console.log('handleItemMove called:', { draggedId, targetFolderId });
    
    if (targetFolderId === null) {
      console.log('Отмена перемещения: targetFolderId равен null');
      addNotification({
        type: 'info',
        title: 'Перемещение отменено',
        message: 'Перетащите элемент в папку для перемещения'
      });
      return false;
    }

    // Вызываем moveItems для перемещения одного элемента
    const success = moveItems([draggedId], targetFolderId);
    return success;
  }, [moveItems, addNotification]);

  // Контекстное меню
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    itemId: string;
    itemType: 'presentation' | 'folder';
  } | null>(null);

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
        if (newName) {
          renameItem(itemId, newName);
        }
        break;

      case 'delete':
        if (window.confirm('Удалить выбранный элемент?')) {
          deleteItems([itemId]);
        }
        break;

      case 'new_presentation':
        const presName = prompt('Введите название презентации:');
        if (presName) {
          createPresentation(presName, itemId);
        }
        break;

      case 'new_folder':
        const folderName = prompt('Введите название папки:');
        if (folderName) {
          createFolder(folderName, itemId);
        }
        break;

      case 'move':
        const targetFolderId = prompt('Введите ID папки для перемещения (оставьте пустым для корня):');
        moveItems([itemId], targetFolderId || null);
        break;

      default:
        console.log('Действие:', action, 'для элемента:', itemId);
    }
  }, [closeContextMenu, renameItem, deleteItems, createPresentation, createFolder, moveItems]);

  // Массовые операции
  const handleBulkAction = useCallback((action: string) => {
    const selectedArray = Array.from(selectedIds);

    switch (action) {
      case 'delete':
        if (window.confirm(`Удалить ${selectedArray.length} элементов?`)) {
          deleteItems(selectedArray);
        }
        break;

      case 'move':
        const targetFolderId = prompt('Введите ID целевой папки:');
        if (targetFolderId) {
          moveItems(selectedArray, targetFolderId);
        } else {
          addNotification({
            type: 'info',
            title: 'Перемещение отменено',
            message: 'Не указана целевая папка'
          });
        }
        break;

      case 'copy':
        addNotification({
          type: 'info',
          title: 'Копирование',
          message: 'Функция копирования будет доступна в следующем обновлении'
        });
        break;

      default:
        console.log('Массовое действие:', action);
    }
  }, [selectedIds, deleteItems, moveItems, addNotification]);

  // Навигация по папкам
  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
    
    if (folderId) {
      const folder = folders.find(f => f.id === folderId);
      if (folder) {
        setBreadcrumbs([
          { id: null, name: 'Все презентации' },
          { id: folderId, name: folder.name }
        ]);
      }
    } else {
      setBreadcrumbs([{ id: null, name: 'Все презентации' }]);
    }
  }, [folders]);

  // Загрузка содержимого папки (для API)
  const loadFolderContents = useCallback(async (folderId: string) => {
    setIsLoading(true);
    try {
      // TODO: Заменить на реальный API вызов
      // const response = await fetch(`/api/folders/${folderId}/contents`);
      // const data = await response.json();
      
      // Временно используем моковые данные
      const childPresentations = presentations.filter(p => p.parentId === folderId);
      
      // Обновляем состояние папки
      setFolders(prev => prev.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            childrenCount: childPresentations.length,
            updatedAt: new Date().toISOString()
          };
        }
        return folder;
      }));

      return childPresentations;
    } catch (error) {
      console.error('Ошибка загрузки содержимого папки:', error);
      addNotification({
        type: 'error',
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить содержимое папки'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [presentations, addNotification]);

  // Инициализация (загрузка данных при монтировании)
  useEffect(() => {
    // TODO: Заменить на реальный API вызов
    // const loadInitialData = async () => {
    //   setIsLoading(true);
    //   try {
    //     const [foldersRes, presentationsRes] = await Promise.all([
    //       fetch('/api/folders'),
    //       fetch('/api/presentations')
    //     ]);
    //     
    //     const foldersData = await foldersRes.json();
    //     const presentationsData = await presentationsRes.json();
    //     
    //     setFolders(foldersData);
    //     setPresentations(presentationsData);
    //   } catch (error) {
    //     console.error('Ошибка загрузки данных:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // 
    // loadInitialData();
    
    // Временно используем моковые данные
    console.log('Загружены моковые данные галереи');
  }, []);

  return {
    // Состояния
    items: getItemsForCurrentFolder(),
    folders,
    presentations,
    selectedIds,
    contextMenu,
    currentFolderId,
    breadcrumbs,
    isLoading,
    
    // Функции
    getChildItems,
    toggleSelection,
    selectAll,
    clearSelection,
    toggleFolder,
    createFolder,
    createPresentation,
    deleteItems,
    renameItem,
    moveItems,
    handleItemMove, // ✅ Добавляем эту функцию для GalleryContainer
    handleContextMenu,
    closeContextMenu,
    handleContextMenuAction,
    handleBulkAction,
    navigateToFolder,
    loadFolderContents,
    
    // Вспомогательные функции
    formatDate,
  };
};