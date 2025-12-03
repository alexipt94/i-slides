import { ReactNode } from 'react';
import { Header } from '../../components/Header/Header';
import { SidePanel } from '../../components/SidePanel/SidePanel';
import { useLayout } from '../LayoutContext';
import styles from './GalleryLayout.module.css';

interface GalleryLayoutProps {
  children: ReactNode;
}

export const GalleryLayout = ({ children }: GalleryLayoutProps) => {
  const {
    isLeftPanelOpen,
    isRightPanelOpen,
    toggleLeftPanel,
    toggleRightPanel
  } = useLayout();

  return (
    <div className={styles.galleryLayout}>
      <Header />
      
      {/* Левая панель - фильтры и сортировка */}
      <SidePanel
        position="left"
        isOpen={isLeftPanelOpen}
        onClose={toggleLeftPanel}
        title="Фильтры и сортировка"
        width={280}
      >
        <div className={styles.filterPanel}>
          <div className={styles.filterSection}>
            <h4>Тип</h4>
            <label className={styles.filterOption}>
              <input type="checkbox" defaultChecked />
              <span>Презентации</span>
            </label>
            <label className={styles.filterOption}>
              <input type="checkbox" defaultChecked />
              <span>Папки</span>
            </label>
          </div>
          
          <div className={styles.filterSection}>
            <h4>Сортировка</h4>
            <select className={styles.sortSelect}>
              <option value="name">По имени</option>
              <option value="date">По дате изменения</option>
              <option value="created">По дате создания</option>
              <option value="size">По размеру</option>
            </select>
          </div>
          
          <div className={styles.filterSection}>
            <h4>Автор</h4>
            <input 
              type="text" 
              placeholder="Фильтр по автору..." 
              className={styles.authorFilter}
            />
          </div>
        </div>
      </SidePanel>

      {/* Правая панель - детали выбранного */}
      <SidePanel
        position="right"
        isOpen={isRightPanelOpen}
        onClose={toggleRightPanel}
        title="Детали"
        width={320}
      >
        <div className={styles.detailsPanel}>
          <div className={styles.detailPlaceholder}>
            <p>Выберите элемент для просмотра деталей</p>
          </div>
        </div>
      </SidePanel>

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
};