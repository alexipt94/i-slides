import { useCallback } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';
import { BulkActions } from '../../components/BulkActions/BulkActions';
import { ContextMenu } from '../../components/ContextMenu/ContextMenu';
import { GalleryContainer } from '../../components/Gallery/GalleryContainer';
import { IconButton } from '../../components/IconButton/IconButton';
import { useGallery } from '../../hooks/useGallery';
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
    closeContextMenu,
    handleContextMenuAction,
    handleBulkAction,
    navigateToFolder,
    createFolder,
    createPresentation,
    moveItems,
    renameItem,
    handleItemMove, 
  } = useGallery();

  const handleCreateFolder = () => {
    const name = prompt('Введите название новой папки:');
    if (name) {
      createFolder(name, currentFolderId);
    }
  };

  const handleCreatePresentation = () => {
    const name = prompt('Введите название новой презентации:');
    if (name) {
      createPresentation(name, currentFolderId);
    }
  };

  //const handleItemMove = useCallback((draggedId: string, targetFolderId: string | null) => {
  //  moveItems([draggedId], targetFolderId);
  //}, [moveItems]);

  const handleItemRename = useCallback((id: string, newName: string) => {
    renameItem(id, newName);
  }, [renameItem]);

  return (
    <div className={styles.presentationsList}>
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

      <div className={styles.content}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📂</div>
            <h3>Папка пуста</h3>
            <p>Создайте новую презентацию или перетащите файлы сюда</p>
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
          <GalleryContainer
          items={items}
          selectedIds={selectedIds}
          onItemSelect={toggleSelection}
          onItemRename={renameItem}
          onItemMove={handleItemMove} // ✅ Передаем handleItemMove
          onFolderToggle={toggleFolder}
        />
        )}
      </div>

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