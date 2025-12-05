import { ChangeEvent } from 'react';
import styles from './styles/shared.module.css';

interface ItemSelectionProps {
  isSelected: boolean;
  onSelect: () => void;
  itemType: 'folder' | 'presentation';
}

export const ItemSelection = ({ isSelected, onSelect, itemType }: ItemSelectionProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div className={styles.selection}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleChange}
        className={styles.checkbox}
        aria-label={`Выбрать ${itemType === 'folder' ? 'папку' : 'презентацию'}`}
      />
    </div>
  );
};