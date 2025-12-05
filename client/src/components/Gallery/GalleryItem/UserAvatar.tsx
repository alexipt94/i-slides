import { User } from 'lucide-react';
import styles from './styles/shared.module.css';

interface UserAvatarProps {
  author?: string;
}

export const UserAvatar = ({ author }: UserAvatarProps) => {
  const initials = author?.[0]?.toUpperCase() || '?';
  
  return (
    <div className={styles.userAvatar}>
      <div className={styles.avatarContent}>
        {initials}
      </div>
      <User size={12} className={styles.avatarIcon} />
    </div>
  );
};