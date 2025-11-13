import { useState } from 'react';
import type { PresentationState, SlideProps } from '../../types'; // Добавляем импорт типов
import { PresentationButton } from '../PresentationButton/PresentationButton';
import { Slide } from '../Slide/Slide';
import styles from './PresentationManager.module.css';

export const PresentationManager = () => {
  const initialSlides: SlideProps[] = [
    {
      title: "Добро пожаловать в i-slides!",
      content: "Это демонстрационная презентация. Используйте кнопки для навигации."
    },
    {
      title: "Возможности платформы",
      content: "Создание интерактивных презентаций, голосования, Q&A сессии"
    },
    {
      title: "Технологии",
      content: "React, TypeScript, Node.js, WebSocket, и многое другое"
    }
  ];

  const [presentation, setPresentation] = useState<PresentationState>({
    currentSlideIndex: 0,
    slides: initialSlides,
    isPlaying: false
  });

  // Обработчики для навигации
  const goToNextSlide = (): void => {
    setPresentation(prev => ({
      ...prev,
      currentSlideIndex: Math.min(prev.currentSlideIndex + 1, prev.slides.length - 1)
    }));
  };

  const goToPrevSlide = (): void => {
    setPresentation(prev => ({
      ...prev,
      currentSlideIndex: Math.max(prev.currentSlideIndex - 1, 0)
    }));
  };

  const togglePresentation = (): void => {
    setPresentation(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const addNewSlide = (): void => {
    const newSlide: SlideProps = {
      title: `Новый слайд ${presentation.slides.length + 1}`,
      content: "Редактируйте содержимое этого слайда"
    };

    setPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
  };

  const deleteCurrentSlide = (): void => {
    if (presentation.slides.length <= 1) {
      alert('Нельзя удалить последний слайд!');
      return;
    }
  
    setPresentation(prev => {
      const newSlides = prev.slides.filter((_, index) => index !== prev.currentSlideIndex);
      
      // Определяем новый активный слайд
      let newCurrentIndex = prev.currentSlideIndex;
      if (prev.currentSlideIndex >= newSlides.length) {
        newCurrentIndex = newSlides.length - 1; // Если удалили последний, активируем предыдущий
      }
      // Если удалили не последний, currentSlideIndex остается тем же (автоматически переключится на следующий)
  
      return {
        ...prev,
        slides: newSlides,
        currentSlideIndex: newCurrentIndex
      };
    });
  };

  const { currentSlideIndex, slides, isPlaying } = presentation;
  const currentSlide = slides[currentSlideIndex];

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Управление презентацией</h2>
        <div className={styles.status}>
          Статус: {isPlaying ? 'Запущена' : 'Остановлена'}
        </div>
      </div>

      {/* Текущий слайд */}
      <div className={styles.slideContainer}>
        <Slide 
          title={currentSlide.title} 
          content={currentSlide.content} 
        />
      </div>

      {/* Навигация */}
      <div className={styles.navigation}>
        <PresentationButton
          title="← Назад"
          onClick={goToPrevSlide}
          color="blue"
          size="medium"
          disabled={currentSlideIndex === 0}
        />

        <div className={styles.counter}>
          Слайд {currentSlideIndex + 1} из {slides.length}
        </div>

        <PresentationButton
          title="Вперед →"
          onClick={goToNextSlide}
          color="blue"
          size="medium"
          disabled={currentSlideIndex === slides.length - 1}
        />
      </div>

      {/* Управление */}
      <div className={styles.controls}>
        <PresentationButton
          title={isPlaying ? "Остановить" : "Запустить"}
          onClick={togglePresentation}
          color={isPlaying ? "red" : "green"}
          size="large"
        />

        <PresentationButton
          title="Добавить слайд"
          onClick={addNewSlide}
          color="green"
          size="medium"
        />
      </div>

              <PresentationButton
          title="Удалить слайд"
          onClick={deleteCurrentSlide}
          color="red"
          size="medium"
          disabled={presentation.slides.length <= 1}
        />

      {/* Миниатюры слайдов */}
      <div className={styles.thumbnails}>
        <h3>Все слайды:</h3>
        <div className={styles.thumbnailList}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.thumbnail} ${
                index === currentSlideIndex ? styles.active : ''
              }`}
              onClick={() => setPresentation(prev => ({
                ...prev,
                currentSlideIndex: index
              }))}
            >
              <div className={styles.thumbnailContent}>
                <strong>{slide.title}</strong>
                <span>Слайд {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};