import { ButtonProps } from '../../types';
import styles from './PresentationButton.module.css';

const sizes = {
  small: '8px 16px',
  medium: '12px 24px', 
  large: '16px 32px'
};

const colors = {
  green: '#339f33',
  red: '#9f3333', 
  blue: '#33339f'
};

export const PresentationButton = ({ 
  title, 
  onClick, 
  color = 'green', 
  size = 'medium' 
}: ButtonProps) => {
  // Инлайновые стили только для динамических значений
  const dynamicStyles = {
    padding: sizes[size],
    backgroundColor: colors[color],
  };

  return (
    <button 
      onClick={onClick}
      style={dynamicStyles}
      className={styles.button}
    >
      {title}
    </button>
  );
};