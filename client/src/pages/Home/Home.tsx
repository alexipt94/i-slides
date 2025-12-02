import { Link } from 'react-router-dom';
import { IconButton } from '../../components/IconButton/IconButton';
import { useApp } from '../../contexts/AppContext';
import { useLayout } from '../../layouts/LayoutContext';
import styles from './Home.module.css';

export const Home = () => {
  const { state, dispatch } = useApp();
  const { toggleLeftPanel, toggleRightPanel } = useLayout();

  const toggleTheme = () => {
    const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { theme: newTheme } 
    });
  };

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Создавайте потрясающие<br />
            <span className={styles.highlight}>презентации</span> легко
          </h1>
          <p className={styles.subtitle}>
            i-slides — современный инструмент для создания презентаций<br />
            с интуитивным интерфейсом и мощными возможностями
          </p>
          
          <div className={styles.ctaButtons}>
            <Link to="/create" className={styles.primaryButton}>
              <span>Создать презентацию</span>
              <span className={styles.buttonIcon}>🚀</span>
            </Link>
            <Link to="/presentations" className={styles.secondaryButton}>
              Мои презентации
            </Link>
          </div>
        </div>
        
        <div className={styles.heroImage}>
          <div className={styles.slidePreview}>
            <div className={styles.slideContent}>
              <div className={styles.slideTitle}>Демонстрация слайда</div>
              <div className={styles.slideBody}>
                <div className={styles.slideItem}>🎯 Чистый дизайн</div>
                <div className={styles.slideItem}>⚡ Быстрая работа</div>
                <div className={styles.slideItem}>🎨 Гибкие стили</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3>Современный дизайн</h3>
            <p>Чистый и минималистичный интерфейс, который не отвлекает от работы</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Быстрая работа</h3>
            <p>Оптимизированная производительность даже с большими презентациями</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔄</div>
            <h3>Режимы просмотра</h3>
            <p>Редактирование, предпросмотр и режим презентации в одном интерфейсе</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActionsBar}>
        <IconButton
          icon="ℹ️"
          onClick={toggleLeftPanel}
          ariaLabel="Информация о проекте"
          size="large"
          variant="secondary"
        />
        <IconButton
          icon="⚡"
          onClick={toggleRightPanel}
          ariaLabel="Быстрые действия"
          size="large"
          variant="secondary"
        />
      </div>
    </div>
  );
};