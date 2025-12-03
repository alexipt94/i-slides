import { ReactNode } from 'react';
import { FolderItem as FolderItemType, GalleryItem } from '../../types/gallery';
import { BaseItem } from './BaseItem';
import styles from './GalleryItem.module.css';

interface FolderItemProps {
  item: FolderItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, item: GalleryItem) => void;
  onDragStart: (e: React.DragEvent, item: GalleryItem) => void;
  onDrop: (e: React.DragEvent, item: GalleryItem) => void;
  onDragOver: (e: React.DragEvent) => void;
  onActionsClick: (e: React.MouseEvent, item: GalleryItem) => void;
  onToggleExpand: () => void;
  children?: ReactNode;
}

// Функция форматирования даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const FolderItem = ({
  item,
  isSelected,
  onSelect,
  onContextMenu,
  onDragStart,
  onDrop,
  onDragOver,
  onActionsClick,
  onToggleExpand,
  children,
}: FolderItemProps) => {
  const handleActionsClick = (e?: React.MouseEvent) => {
    if (e) {
      onActionsClick(e, item);
    }
  };

  return (
    <>
      <BaseItem
        item={item}
        isSelected={isSelected}
        onContextMenu={onContextMenu}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onDragOver={onDragOver}
        isExpanded={item.isExpanded} // Передаем isExpanded
      >
        {/* Основная строка папки */}
        <div className={styles.folderMainRow}>
          {/* Кнопка стрелки расширения */}
          <button
            className={styles.expandToggleButton}
            onClick={onToggleExpand}
            aria-label={item.isExpanded ? "Свернуть папку" : "Развернуть папку"}
            title={item.isExpanded ? "Свернуть папку" : "Развернуть папку"}
            type="button"
          >
            {item.isExpanded ? '▼' : '▶'}
          </button>

          {/* Чекбокс выбора */}
          <div className={styles.folderCheckbox}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(item.id)}
              className={styles.checkbox}
              aria-label={`Выбрать папку "${item.name}"`}
            />
          </div>

          {/* Иконка папки */}
          <div className={styles.folderIcon}>
            {item.isExpanded ? '📂' : '📁'}
          </div>

          {/* Название папки (кликабельное для сворачивания/разворачивания) */}
          <button
            className={styles.folderNameButton}
            onClick={onToggleExpand}
            title={`${item.isExpanded ? "Свернуть" : "Развернуть"} папку "${item.name}"`}
            type="button"
          >
            <span className={styles.folderNameText}>{item.name}</span>
          </button>

          {/* Количество элементов в круге */}
          <div className={styles.folderItemCount}>
            <span className={styles.countNumber}>{item.childrenCount}</span>
          </div>

          {/* Кнопка меню */}
          <div className={styles.folderActions}>
            <button
              className={styles.actionsButton}
              onClick={handleActionsClick}
              aria-label={`Действия с папкой "${item.name}"`}
              title="Действия с папкой"
              type="button"
            >
              ⋮
            </button>
          </div>
        </div>

        {/* Дополнительная информация (под основной строкой) */}
        <div className={styles.folderDetails}>
          <div className={styles.folderMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📅</span>
              <span className={styles.metaText}>Создано: {formatDate(item.createdAt)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>✏️</span>
              <span className={styles.metaText}>Изменено: {formatDate(item.updatedAt)}</span>
            </div>
            {item.author && (
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>👤</span>
                <span className={styles.metaText}>Автор: {item.author}</span>
              </div>
            )}
          </div>
        </div>
      </BaseItem>

      {/* Дочерние элементы (если папка развернута) */}
      {item.isExpanded && children && (
        <div className={styles.folderChildren}>
          {children}
        </div>
      )}
    </>
  );
};