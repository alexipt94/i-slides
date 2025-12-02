import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: string | React.ReactNode; // Добавляем поддержку ReactNode
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const IconButton = ({
  icon,
  onClick,
  ariaLabel,
  className = '',
  size = 'medium',
  variant = 'ghost'
}: IconButtonProps) => {
  return (
    <button
      className={`${styles.iconButton} ${styles[size]} ${styles[variant]} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      <span className={styles.icon}>
        {typeof icon === 'string' ? icon : icon}
      </span>
    </button>
  );
};