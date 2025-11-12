import { useState } from 'react';
import styles from './App.module.css';
import { PresentationButton } from './components/PresentationButton/PresentationButton';
import { Slide } from './components/Slide/Slide';
import { Presentation } from './types';

const App = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([
    { id: 1, title: 'Первая презентация', slidesCount: 3 },
    { id: 2, title: 'Вторая презентация', slidesCount: 5 }
  ]);

  const handleStartPresentation = (): void => {
    alert('Презентация начинается!');
  };

  const handleNextSlide = (): void => {
    alert('Переходим к следующему слайду!');
  };

  const handleAddPresentation = (): void => {
    const newPresentation: Presentation = {
      id: presentations.length + 1,
      title: `Презентация ${presentations.length + 1}`,
      slidesCount: 0
    };
    setPresentations([...presentations, newPresentation]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Добро пожаловать в i-slides! 🚀</h1>
      
      <div className={styles.buttonsContainer}>
        <PresentationButton 
          title="Начать презентацию" 
          onClick={handleStartPresentation}
          color="green"
          size="large"
        />
        
        <PresentationButton 
          title="Следующий слайд" 
          onClick={handleNextSlide}
          color="blue" 
          size="medium"
        />

        <PresentationButton 
          title="Добавить презентацию" 
          onClick={handleAddPresentation}
          color="red"
          size="medium"
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
        title="Первый слайд"
        content="Это наш первый прототип будущего приложения для презентаций"
      />
      
      <Slide
        title="Технологии"
        content="React + TypeScript + Vite + Node.js + Express + CSS Modules"
      />
    </div>
  );
};

export default App;