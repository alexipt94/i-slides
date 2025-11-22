import { useEffect } from 'react';
import { Notification as NotificationType } from '../../types/context';
import styles from './Notification.module.css';

interface NotificationProps {
  notification: NotificationType;
  onClose: (id: string) => void;
}

export function Notification({ notification, onClose }: NotificationProps) {
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration, onClose]);

  const handleClose = () => {
    onClose(notification.id);
  };

  return (
    <div className={`${styles.notification} ${styles[notification.type]}`}>
      <div className={styles.content}>
        <h4 className={styles.title}>{notification.title}</h4>
        {notification.message && (
          <p className={styles.message}>{notification.message}</p>
        )}
      </div>
      <button className={styles.closeButton} onClick={handleClose}>
        ×
      </button>
    </div>
  );
}