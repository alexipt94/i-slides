import { Link } from 'react-router-dom';
import { useNotifications, useUser } from '../../contexts/AppContext';
import styles from './Home.module.css';

export const Home = () => {
  const { user } = useUser();
  const { addNotification } = useNotifications();

  const handleQuickStart = () => {
    addNotification({
      type: 'info',
      title: 'Быстрый старт',
      message: 'Создайте свою первую презентацию!'
    });
  };

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Добро пожаловать{user ? `, ${user.name}` : ''}!
        </h1>
        <p className={styles.subtitle}>
          Создавайте интерактивные презентации с i-slides
        </p>
      </div>

      <div className={styles.actions}>
        <Link to="/create" className={styles.actionLink}>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>🚀</div>
            <h3>Новая презентация</h3>
            <p>Создайте презентацию с нуля</p>
          </div>
        </Link>

        <Link to="/presentations" className={styles.actionLink}>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>📁</div>
            <h3>Мои презентации</h3>
            <p>Продолжите работу над существующими</p>
          </div>
        </Link>

        <div className={styles.actionCard} onClick={handleQuickStart}>
          <div className={styles.actionIcon}>⚡</div>
          <h3>Быстрый старт</h3>
          <p>Используйте готовые шаблоны</p>
        </div>
      </div>

      <div className={styles.features}>
        <h2>Возможности платформы</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <h4>🎨 Интуитивный редактор</h4>
            <p>Простое создание и редактирование слайдов</p>
          </div>
          <div className={styles.feature}>
            <h4>🌙 Темная тема</h4>
            <p>Работайте комфортно в любое время суток</p>
          </div>
          <div className={styles.feature}>
            <h4>💾 Автосохранение</h4>
            <p>Ваши данные сохраняются автоматически</p>
          </div>
          <div className={styles.feature}>
            <h4>📱 Адаптивный дизайн</h4>
            <p>Работайте на любом устройстве</p>
          </div>
        </div>
      </div>
    </div>
  );
};