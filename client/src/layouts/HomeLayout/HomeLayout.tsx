import { ReactNode } from 'react';
import { Header } from '../../components/Header/Header';
import { SidePanel } from '../../components/SidePanel/SidePanel';
import { useLayout } from '../LayoutContext';
import styles from './HomeLayout.module.css';

interface HomeLayoutProps {
  children: ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  const {
    isLeftPanelOpen,
    isRightPanelOpen,
    toggleLeftPanel,
    toggleRightPanel
  } = useLayout();

  return (
    <div className={styles.homeLayout}>
      <Header />
      
      {/* Левая панель - информация о проекте */}
      <SidePanel
        position="left"
        isOpen={isLeftPanelOpen}
        onClose={toggleLeftPanel}
        title="О проекте"
      >
        <div className={styles.panelContent}>
          <h4>i-slides</h4>
          <p>Современный редактор презентаций с интуитивным интерфейсом.</p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎨</span>
              <div>
                <strong>Современный дизайн</strong>
                <p>Чистый и минималистичный интерфейс</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <div>
                <strong>Быстрая работа</strong>
                <p>Оптимизированная производительность</p>
              </div>
            </div>
          </div>
        </div>
      </SidePanel>

      {/* Правая панель - быстрые действия */}
      <SidePanel
        position="right"
        isOpen={isRightPanelOpen}
        onClose={toggleRightPanel}
        title="Быстрые действия"
      >
        <div className={styles.quickActions}>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>➕</span>
            Новая презентация
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>📁</span>
            Открыть шаблон
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>⚙️</span>
            Настройки
          </button>
        </div>
      </SidePanel>

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>© 2024 i-slides</span>
          <span>v1.1.0</span>
        </div>
      </footer>
    </div>
  );
};