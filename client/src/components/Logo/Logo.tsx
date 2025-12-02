import styles from './Logo.module.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Logo = ({ size = 'medium', className = '' }: LogoProps) => {
  return (
    <div className={`${styles.logo} ${styles[size]} ${className}`}>
      <span className={styles.icon}>🖼️</span>
      <span className={styles.text}>i-slides</span>
    </div>
  );
};