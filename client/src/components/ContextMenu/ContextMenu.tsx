import { useEffect, useRef } from 'react';
import { ContextMenuState, ItemType } from '../../types/gallery';
import styles from './ContextMenu.module.css';

interface ContextMenuProps {
  menu: ContextMenuState | null;
  onClose: () => void;
  onAction: (action: string, itemId: string) => void;
  itemType: ItemType;
}

// Тип для элементов меню
interface MenuItem {
  id: string;
  label?: string;
  icon?: string;
  className?: string;
}

export const ContextMenu = ({ menu, onClose, onAction, itemType }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!menu) return null;

  const menuStyle = {
    top: menu.y,
    left: menu.x,
  };

  const getMenuItems = (): MenuItem[] => {
    const commonItems: MenuItem[] = [
      { id: 'open', label: 'Открыть', icon: '📂' },
      { id: 'rename', label: 'Переименовать', icon: '✏️' },
      { id: 'copy', label: 'Создать копию', icon: '📋' },
      { id: 'move', label: 'Переместить', icon: '↔️' },
      { id: 'divider' },
      { id: 'delete', label: 'Удалить', icon: '🗑️', className: styles.danger },
    ];

    if (itemType === 'folder') {
      const folderItems: MenuItem[] = [
        { id: 'new_presentation', label: 'Новая презентация', icon: '🆕' },
        { id: 'new_folder', label: 'Новая папка', icon: '📁' },
        { id: 'collapse_all', label: 'Свернуть все', icon: '⬆️' },
        { id: 'expand_all', label: 'Развернуть все', icon: '⬇️' },
        { id: 'divider' },
        ...commonItems
      ];
      return folderItems;
    }

    return commonItems;
  };

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={menuStyle}
      role="menu"
      aria-label="Контекстное меню"
    >
      {getMenuItems().map((item, index) => {
        if (item.id === 'divider') {
          return <hr key={`divider-${index}`} className={styles.divider} />;
        }

        return (
          <button
            key={item.id}
            className={`${styles.menuItem} ${item.className || ''}`}
            onClick={() => onAction(item.id, menu.itemId)}
            role="menuitem"
          >
            <span className={styles.menuIcon} aria-hidden="true">
              {item.icon}
            </span>
            <span className={styles.menuLabel}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};