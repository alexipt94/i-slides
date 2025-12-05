import { animated, useSpring } from '@react-spring/web';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FolderItem as FolderItemType, GalleryItem } from '../../../types/gallery';
import { BaseItem } from './BaseItem';
import { CounterBadge } from './CounterBadge';
import { FolderChildGrid } from './FolderChildGrid';
import styles from './styles/folder.module.css';
import shared from './styles/shared.module.css';

interface FolderItemProps {
  item: FolderItemType;
  isSelected: boolean;
  isDragging?: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onFolderToggle: (folderId: string) => void;
  children?: GalleryItem[];
}

export const FolderItem = ({
  item,
  isSelected,
  isDragging = false,
  onSelect,
  onRename,
  onFolderToggle,
  children = [],
}: FolderItemProps) => {
  const [prevCount, setPrevCount] = useState(item.childrenCount);
  const [animation, setAnimation] = useState<'add' | 'remove' | null>(null);

  // Анимация разворачивания/сворачивания
  const expandAnimation = useSpring({
    height: item.isExpanded ? 'auto' : '0px',
    opacity: item.isExpanded ? 1 : 0,
    config: { tension: 300, friction: 30 }
  });

  // Анимация счетчика
  useEffect(() => {
    if (item.childrenCount !== prevCount) {
      const type = item.childrenCount > prevCount ? 'add' : 'remove';
      setAnimation(type);
      setPrevCount(item.childrenCount);

      const timer = setTimeout(() => setAnimation(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [item.childrenCount, prevCount]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFolderToggle(item.id);
  };

  const renderContent = () => (
    <div className={styles.folderContent}>
      <div className={styles.folderStats}>
        <CounterBadge
          count={item.childrenCount}
          animation={animation}
          type={item.type}
        />
        
        <div className={styles.folderMeta}>
          <span className={shared.metaItem}>
            <span className={shared.metaIcon}>👤</span>
            <span>{item.author || 'Вы'}</span>
          </span>
          <span className={shared.metaItem}>
            <span className={shared.metaIcon}>📅</span>
            <span>
              {new Date(item.updatedAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </span>
        </div>
      </div>

      <button
        className={styles.toggleButton}
        onClick={handleToggle}
        aria-expanded={item.isExpanded}
        aria-label={item.isExpanded ? 'Свернуть папку' : 'Развернуть папку'}
      >
        <ChevronRight
          className={`${styles.toggleIcon} ${item.isExpanded ? styles.expanded : ''}`}
          size={20}
        />
        <span className={styles.toggleText}>
          {item.isExpanded ? 'Свернуть' : 'Развернуть'}
        </span>
      </button>
    </div>
  );

  return (
    <>
      <BaseItem
        item={item}
        isSelected={isSelected}
        isDragging={isDragging}
        onSelect={onSelect}
        onRename={onRename}
        renderContent={renderContent}
      >
        <animated.div
          style={expandAnimation}
          className={styles.childrenContainer}
        >
          {item.isExpanded && children.length > 0 && (
            <FolderChildGrid items={children} />
          )}
          
          {item.isExpanded && children.length === 0 && (
            <div className={styles.emptyFolder}>
              <p>Папка пуста</p>
              <small>Перетащите сюда презентации или создайте новые</small>
            </div>
          )}
        </animated.div>
      </BaseItem>
    </>
  );
};