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
  size = 'medium',
  disabled = false
}: ButtonProps) => {
  const dynamicStyles = {
    padding: sizes[size],
    backgroundColor: colors[color],
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  };

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button 
      onClick={handleClick}
      style={dynamicStyles}
      className={styles.button}
      disabled={disabled}
    >
      {title}
    </button>
  );
};