import styles from './App.module.css';
import { AppHeader } from './components/AppHeader/AppHeader';
import { NotificationContainer } from './components/Notification/NotificationContainer';
import { PresentationManager } from './components/PresentationManager/PresentationManager';
import { Slide } from './components/Slide/Slide';
import { ThemeProvider } from './components/ThemeProvider/ThemeProvider';
import { useSettings } from './contexts/AppContext';

export default function App() {
  const { settings } = useSettings();

  return (
    <div className={styles.app} data-theme={settings.theme}>
      <ThemeProvider />
      <AppHeader />
      <NotificationContainer />
      
      <main className={styles.main}>
        <PresentationManager />
        
        <Slide 
          title="О проекте i-slides"
          content="Это современная платформа для создания интерактивных презентаций с использованием React, TypeScript и Node.js. Теперь с глобальным состоянием и системой уведомлений!"
        />
      </main>
    </div>
  );
}