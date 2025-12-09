import { Calendar, FileText } from 'lucide-react';
import { PresentationItem as PresentationItemType } from '../../../types/gallery';
import { BaseItem } from './BaseItem';
import { SlidePreview } from './SlidePreview';
import { UserAvatar } from './UserAvatar';
import styles from './styles/presentation.module.css';

interface PresentationItemProps {
  item: PresentationItemType;
  isSelected: boolean;
  isDragging?: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  isDropTarget?: boolean;
}

export const PresentationItem = ({
  item,
  isSelected,
  isDragging = false,
  onSelect,
  onRename,
}: PresentationItemProps) => {
  const renderContent = () => (
    <div className={styles.presentationContent}>
      <SlidePreview
        slideCount={item.slideCount}
        thumbnail={item.thumbnail}
      />
      
      <div className={styles.presentationMeta}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <FileText size={16} />
            <span>{item.slideCount} слайдов</span>
          </span>
          
          {item.lastOpened && (
            <span className={styles.stat}>
              <Calendar size={16} />
              <span>
                Открыто: {new Date(item.lastOpened).toLocaleDateString('ru-RU')}
              </span>
            </span>
          )}
        </div>
        
        <div className={styles.authorSection}>
          <UserAvatar author={item.author} />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>
              {item.author || 'Неизвестный автор'}
            </span>
            <span className={styles.authorRole}>Создатель</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <BaseItem
      item={item}
      isSelected={isSelected}
      isDragging={isDragging}
      onSelect={onSelect}
      onRename={onRename}
      renderContent={renderContent}
    />
  );
};