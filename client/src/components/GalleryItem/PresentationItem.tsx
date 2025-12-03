import { GalleryItem, PresentationItem as PresentationItemType } from '../../types/gallery';
import { BaseItem } from './BaseItem';
import styles from './GalleryItem.module.css';

interface PresentationItemProps {
  item: PresentationItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, item: GalleryItem) => void;
  onDragStart: (e: React.DragEvent, item: GalleryItem) => void;
  onDrop: (e: React.DragEvent, item: GalleryItem) => void;
  onDragOver: (e: React.DragEvent) => void;
  onActionsClick: (e: React.MouseEvent, item: GalleryItem) => void;
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

// Функция форматирования размера
const formatSize = (bytes?: number) => {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} МБ`;
};

// Функция форматирования времени
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const PresentationItem = ({
  item,
  isSelected,
  onSelect,
  onContextMenu,
  onDragStart,
  onDrop,
  onDragOver,
  onActionsClick,
}: PresentationItemProps) => {
  const handleActionsClick = (e?: React.MouseEvent) => {
    if (e) {
      onActionsClick(e, item);
    }
  };

  return (
    <BaseItem
      item={item}
      isSelected={isSelected}
      onContextMenu={onContextMenu}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {/* Основная строка презентации */}
      <div className={styles.presentationMainRow}>
        {/* Чекбокс выбора */}
        <div className={styles.presentationCheckbox}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(item.id)}
            className={styles.checkbox}
            aria-label={`Выбрать "${item.name}"`}
          />
        </div>

        {/* Миниатюра */}
        <div className={styles.presentationThumbnail}>
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={`Миниатюра "${item.name}"`}
              className={styles.thumbnailImage}
              loading="lazy"
            />
          ) : (
            <div className={styles.thumbnailPlaceholder}>
              <div className={styles.slideIcon}>📊</div>
              <div className={styles.slideCount}>{item.slideCount}</div>
              <span className={styles.slideLabel}>слайдов</span>
            </div>
          )}
        </div>

        {/* Основная информация */}
        <div className={styles.presentationInfo}>
          {/* Заголовок и статистика в одной строке */}
          <div className={styles.presentationHeader}>
            <h4 className={styles.presentationName} title={item.name}>
              {item.name}
            </h4>
            
            <div className={styles.presentationStats}>
              <span className={styles.statItem}>
                <span className={styles.statIcon}>📊</span>
                <span className={styles.statValue}>{item.slideCount}</span>
                <span className={styles.statLabel}>слайдов</span>
              </span>
              {item.size && (
                <span className={styles.statItem}>
                  <span className={styles.statIcon}>💾</span>
                  <span className={styles.statValue}>{formatSize(item.size)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Детальная информация */}
          <div className={styles.presentationDetails}>
            {/* Автор */}
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                {item.author?.[0]?.toUpperCase() || '?'}
              </div>
              <div className={styles.authorDetails}>
                <div className={styles.authorName}>{item.author || 'Неизвестный автор'}</div>
                <div className={styles.authorRole}>Создатель</div>
              </div>
            </div>

            {/* Даты */}
            <div className={styles.dateInfo}>
              <div className={styles.dateItem}>
                <span className={styles.dateIcon}>📅</span>
                <div className={styles.dateDetails}>
                  <div className={styles.dateLabel}>Создано</div>
                  <div className={styles.dateValue}>
                    {formatDate(item.createdAt)}
                    <span className={styles.dateTime}> {formatTime(item.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className={styles.dateItem}>
                <span className={styles.dateIcon}>✏️</span>
                <div className={styles.dateDetails}>
                  <div className={styles.dateLabel}>Изменено</div>
                  <div className={styles.dateValue}>
                    {formatDate(item.updatedAt)}
                    <span className={styles.dateTime}> {formatTime(item.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка меню - справа отдельно */}
        <div className={styles.presentationActions}>
          <button
            className={styles.actionsButton}
            onClick={handleActionsClick}
            aria-label="Действия с презентацией"
            title="Действия с презентацией"
            type="button"
          >
            ⋮
          </button>
        </div>
      </div>
    </BaseItem>
  );
};