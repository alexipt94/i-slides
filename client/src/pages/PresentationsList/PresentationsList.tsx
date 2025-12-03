import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';
import { BulkActions } from '../../components/BulkActions/BulkActions';
import { ContextMenu } from '../../components/ContextMenu/ContextMenu';
import { FolderItem } from '../../components/GalleryItem/FolderItem';
import { PresentationItem } from '../../components/GalleryItem/PresentationItem';
import { IconButton } from '../../components/IconButton/IconButton';
import { useGallery } from '../../hooks/useGallery';
import { FolderItem as FolderItemType, GalleryItem } from '../../types/gallery';
import styles from './PresentationsList.module.css';

export const PresentationsList = () => {
  const {
    items,
    selectedIds,
    contextMenu,
    breadcrumbs,
    currentFolderId,
    toggleSelection,
    clearSelection,
    toggleFolder,
    handleContextMenu,
    closeContextMenu,
    handleContextMenuAction,
    handleBulkAction,
    navigateToFolder,
    createFolder,
    createPresentation,
    moveItems,
  } = useGallery();

  // Обработка начала перетаскивания
  const handleDragStart = (e: React.DragEvent, item: GalleryItem) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: item.type,
      id: item.id,
      name: item.name
    }));
  };

  // Обработка отпускания при перетаскивании
  const handleDrop = (e: React.DragEvent, targetItem: GalleryItem) => {
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (draggedId && targetItem.type === 'folder') {
      moveItems([draggedId], targetItem.id);
    }
  };

  // Обработка наведения при перетаскивании
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Обработка клика по кнопке действий
  const handleActionsClick = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    handleContextMenu(e, item);
  };

  // Создать новую папку
  const handleCreateFolder = () => {
    const name = prompt('Введите название новой папки:');
    if (name) {
      createFolder(name, currentFolderId);
    }
  };

  // Создать новую презентацию
  const handleCreatePresentation = () => {
    const name = prompt('Введите название новой презентации:');
    if (name) {
      createPresentation(name, currentFolderId);
    }
  };

  // Получить вложенные элементы для папки
  const getChildItems = (folderId: string): GalleryItem[] => {
    return items.filter(item => item.type === 'presentation' && item.parentId === folderId);
  };

  return (
    <div className={styles.presentationsList}>
      {/* Шапка с кнопками создания */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Мои презентации</h1>
          <Breadcrumbs 
            items={breadcrumbs}
            onNavigate={navigateToFolder}
            currentItem={currentFolderId ? items.find(i => i.id === currentFolderId)?.name : undefined}
          />
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.createButton}
            onClick={handleCreatePresentation}
            title="Создать новую презентацию"
            type="button"
          >
            <span className={styles.createIcon}>✨</span>
            <span className={styles.createText}>Создать презентацию</span>
          </button>
          
          <IconButton
            icon="📁"
            onClick={handleCreateFolder}
            ariaLabel="Создать новую папку"
            className={styles.createFolderButton}
            variant="secondary"
          />
        </div>
      </div>

      {/* Основной контент - список на всю ширину */}
      <div className={styles.content}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📂</div>
            <h3>Папка пуста</h3>
            <p>Создайте новую презентацию или папку, чтобы начать работу</p>
            <div className={styles.emptyActions}>
              <button 
                className={styles.emptyButton}
                onClick={handleCreatePresentation}
                type="button"
              >
                🆕 Создать презентацию
              </button>
              <button 
                className={`${styles.emptyButton} ${styles.secondary}`}
                onClick={handleCreateFolder}
                type="button"
              >
                📁 Создать папку
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.itemsList}>
            {items.map((item) => {
              const isSelected = selectedIds.has(item.id);

              if (item.type === 'folder') {
                const folder = item as FolderItemType;
                return (
                  <div key={folder.id} className={styles.gridItem}>
                    <FolderItem
                      item={folder}
                      isSelected={isSelected}
                      onSelect={toggleSelection}
                      onContextMenu={handleContextMenu}
                      onDragStart={handleDragStart}
                      onDrop={(e) => handleDrop(e, folder)}
                      onDragOver={handleDragOver}
                      onActionsClick={handleActionsClick}
                      onToggleExpand={() => toggleFolder(folder.id)}
                    >
                      {getChildItems(folder.id).map((child) => (
                        <div key={child.id} className={styles.childItem}>
                          <PresentationItem
                            item={child as any}
                            isSelected={selectedIds.has(child.id)}
                            onSelect={toggleSelection}
                            onContextMenu={handleContextMenu}
                            onDragStart={handleDragStart}
                            onDrop={(e) => handleDrop(e, child)}
                            onDragOver={handleDragOver}
                            onActionsClick={handleActionsClick}
                          />
                        </div>
                      ))}
                    </FolderItem>
                  </div>
                );
              }

              return (
                <div key={item.id} className={styles.gridItem}>
                  <PresentationItem
                    item={item as any}
                    isSelected={isSelected}
                    onSelect={toggleSelection}
                    onContextMenu={handleContextMenu}
                    onDragStart={handleDragStart}
                    onDrop={(e) => handleDrop(e, item)}
                    onDragOver={handleDragOver}
                    onActionsClick={handleActionsClick}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Контекстное меню и массовые действия */}
      {contextMenu && (
        <ContextMenu
          menu={contextMenu}
          onClose={closeContextMenu}
          onAction={handleContextMenuAction}
          itemType={contextMenu.itemType}
        />
      )}

      <BulkActions
        selectedCount={selectedIds.size}
        onAction={handleBulkAction}
        onClearSelection={clearSelection}
        isVisible={selectedIds.size > 0}
      />
    </div>
  );
};