import styles from './App.module.css';
import { PresentationManager } from './components/PresentationManager/PresentationManager';
import { Slide } from './components/Slide/Slide';

const App = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Добро пожаловать в i-slides! 🚀</h1>
      
      <PresentationManager />

      <Slide 
        title="О проекте i-slides"
        content="Это современная платформа для создания интерактивных презентаций с использованием React, TypeScript и Node.js"
      />
    </div>
  );
};

export default App;