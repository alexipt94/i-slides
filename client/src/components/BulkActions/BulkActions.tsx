import { BulkAction } from '../../types/gallery';
import styles from './BulkActions.module.css';

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: string) => void;
  onClearSelection: () => void;
  isVisible: boolean;
}

const bulkActions: BulkAction[] = [
  { type: 'move', label: 'Переместить', icon: '↔️', color: 'info' },
  { type: 'copy', label: 'Копировать', icon: '📋', color: 'success' },
  { type: 'delete', label: 'Удалить', icon: '🗑️', color: 'danger' },
];

export const BulkActions = ({ 
  selectedCount, 
  onAction, 
  onClearSelection,
  isVisible 
}: BulkActionsProps) => {
  if (!isVisible) return null;

  return (
    <div className={styles.bulkActions}>
      <div className={styles.selectedInfo}>
        <span className={styles.selectedCount}>
          Выбрано: <strong>{selectedCount}</strong>
        </span>
        <button 
          className={styles.clearButton}
          onClick={onClearSelection}
          aria-label="Снять выделение"
        >
          ✕ Снять выделение
        </button>
      </div>
      
      <div className={styles.actions}>
        {bulkActions.map((action) => (
          <button
            key={action.type}
            className={`${styles.actionButton} ${styles[action.color || 'info']}`}
            onClick={() => onAction(action.type)}
            title={action.label}
          >
            <span className={styles.actionIcon} aria-hidden="true">
              {action.icon}
            </span>
            <span className={styles.actionLabel}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};