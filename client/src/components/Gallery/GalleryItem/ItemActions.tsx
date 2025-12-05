import { MoreVertical } from 'lucide-react';
import styles from './styles/shared.module.css';

interface ItemActionsProps {
  item: {
    id: string;
    type: 'folder' | 'presentation';
  };
}

export const ItemActions = ({ item }: ItemActionsProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Actions for:', item.id);
  };

  return (
    <div className={styles.actions}>
      <button
        className={styles.actionButton}
        onClick={handleClick}
        aria-label="Действия"
        title="Действия"
      >
        <MoreVertical size={20} />
      </button>
    </div>
  );
};