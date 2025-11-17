import { useState } from 'react';
import styles from './App.module.css';
import { PresentationButton } from './components/PresentationButton/PresentationButton';
import { PresentationManager } from './components/PresentationManager/PresentationManager';
import { Slide } from './components/Slide/Slide';
import { Presentation } from './types';

const App = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([
    { id: 1, title: 'Первая презентация', slidesCount: 3 },
    { id: 2, title: 'Вторая презентация', slidesCount: 5 }
  ]);

  const handleAddPresentation = (): void => {
    const maxId = presentations.reduce((max, p) => Math.max(max, p.id), 0);
    const newId = maxId + 1;
    const newPresentation: Presentation = {
      id: newId,
      title: `Презентация ${newId}`,
      slidesCount: 0
    };
    setPresentations([...presentations, newPresentation]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Добро пожаловать в i-slides! 🚀</h1>
      
      <PresentationManager />

      <div className={styles.buttonsContainer}>
        <PresentationButton 
          title="Добавить презентацию" 
          onClick={handleAddPresentation}
          color="green"
          size="large"
        />
      </div>

      <div className={styles.presentationsList}>
        <h2>Мои презентации:</h2>
        {presentations.map(presentation => (
          <div key={presentation.id} className={styles.presentationItem}>
            <strong>{presentation.title}</strong> 
            <span> - {presentation.slidesCount} слайдов</span>
          </div>
        ))}
      </div>

      <Slide 
        title="О проекте i-slides"
        content="Это современная платформа для создания интерактивных презентаций с использованием React, TypeScript и Node.js"
      />
    </div>
  );
};

export default App;