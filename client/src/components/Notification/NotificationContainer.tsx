import { useNotifications } from '../../contexts/AppContext';
import { Notification } from './Notification';
import styles from './NotificationContainer.module.css';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
}