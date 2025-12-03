import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: string | React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  ariaLabel: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
}

export const IconButton = ({
  icon,
  onClick,
  ariaLabel,
  className = '',
  size = 'medium',
  variant = 'ghost',
  type = 'button'
}: IconButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`${styles.iconButton} ${styles[size]} ${styles[variant]} ${className}`}
      onClick={handleClick}
      aria-label={ariaLabel}
      type={type}
    >
      <span className={styles.icon}>
        {typeof icon === 'string' ? icon : icon}
      </span>
    </button>
  );
};