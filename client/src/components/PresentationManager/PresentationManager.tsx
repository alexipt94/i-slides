import { useState } from 'react';
import type { PresentationState, SlideData } from '../../types';
import { PresentationButton } from '../PresentationButton/PresentationButton';
import { Slide } from '../Slide/Slide';
import { SlideEditor } from '../SlideEditor/SlideEditor';
import styles from './PresentationManager.module.css';

export const PresentationManager = () => {
  const initialSlides: SlideData[] = [
    {
      id: 1,
      title: "Добро пожаловать в i-slides!",
      content: "Это демонстрационная презентация. Используйте кнопки для навигации."
    },
    {
      id: 2,
      title: "Возможности платформы",
      content: "Создание интерактивных презентаций, голосования, Q&A сессии"
    },
    {
      id: 3,
      title: "Технологии",
      content: "React, TypeScript, Node.js, WebSocket, и многое другое"
    }
  ];

  const [presentation, setPresentation] = useState<PresentationState>({
    currentSlideIndex: 0,
    slides: initialSlides,
    isPlaying: false,
    isEditing: false
  });

  // Навигация
  const goToNextSlide = (): void => {
    setPresentation(prev => ({
      ...prev,
      currentSlideIndex: Math.min(prev.currentSlideIndex + 1, prev.slides.length - 1),
      isEditing: false
    }));
  };

  const goToPrevSlide = (): void => {
    setPresentation(prev => ({
      ...prev,
      currentSlideIndex: Math.max(prev.currentSlideIndex - 1, 0),
      isEditing: false
    }));
  };

  // Управление редактированием
  const startEditing = (): void => {
    setPresentation(prev => ({ ...prev, isEditing: true }));
  };

  const cancelEditing = (): void => {
    setPresentation(prev => ({ ...prev, isEditing: false }));
  };

  const saveSlide = (updatedSlide: SlideData): void => {
    setPresentation(prev => {
      const newSlides = [...prev.slides];
      newSlides[prev.currentSlideIndex] = updatedSlide;
      
      return {
        ...prev,
        slides: newSlides,
        isEditing: false
      };
    });
  };

  // Добавление нового слайда
  const addNewSlide = (): void => {
    const maxId = presentation.slides.reduce((max, slide) => Math.max(max, slide.id), 0);
    const newSlide: SlideData = {
      id: maxId + 1,
      title: `Новый слайд ${maxId + 1}`,
      content: "Редактируйте содержимое этого слайда"
    };

    setPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
      currentSlideIndex: prev.slides.length,
      isEditing: true
    }));
  };

  // Удаление слайда
  const deleteCurrentSlide = (): void => {
    if (presentation.slides.length <= 1) {
      alert('Нельзя удалить последний слайд!');
      return;
    }

    setPresentation(prev => {
      const newSlides = prev.slides.filter((_, index) => index !== prev.currentSlideIndex);
      
      let newCurrentIndex = prev.currentSlideIndex;
      if (prev.currentSlideIndex >= newSlides.length) {
        newCurrentIndex = newSlides.length - 1;
      }

      return {
        ...prev,
        slides: newSlides,
        currentSlideIndex: newCurrentIndex,
        isEditing: false
      };
    });
  };

  const togglePresentation = (): void => {
    setPresentation(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const { currentSlideIndex, slides, isPlaying, isEditing } = presentation;
  const currentSlide = slides[currentSlideIndex];

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Управление презентацией</h2>
        <div className={styles.status}>
          Статус: {isPlaying ? 'Запущена' : 'Остановлена'} | 
          Режим: {isEditing ? 'Редактирование' : 'Просмотр'}
        </div>
      </div>

      {/* Область слайда */}
      <div className={styles.slideArea}>
        {isEditing ? (
          <SlideEditor 
            slide={currentSlide}
            onSave={saveSlide}
            onCancel={cancelEditing}
            isEditing={isEditing}
          />
        ) : (
          <div className={styles.slideContainer}>
            <Slide 
              title={currentSlide.title} 
              content={currentSlide.content} 
            />
          </div>
        )}
      </div>

      {/* Навигация */}
      <div className={styles.navigation}>
        <PresentationButton
          title="← Назад"
          onClick={goToPrevSlide}
          color="blue"
          size="medium"
          disabled={currentSlideIndex === 0 || isEditing}
        />

        <div className={styles.counter}>
          Слайд {currentSlideIndex + 1} из {slides.length}
          {isEditing && " (режим редактирования)"}
        </div>

        <PresentationButton
          title="Вперед →"
          onClick={goToNextSlide}
          color="blue"
          size="medium"
          disabled={currentSlideIndex === slides.length - 1 || isEditing}
        />
      </div>

      {/* Управление */}
      <div className={styles.controls}>
        <PresentationButton
          title={isPlaying ? "Остановить" : "Запустить"}
          onClick={togglePresentation}
          color={isPlaying ? "red" : "green"}
          size="large"
          disabled={isEditing}
        />

        <PresentationButton
          title="Добавить слайд"
          onClick={addNewSlide}
          color="green"
          size="medium"
        />

        <PresentationButton
          title="Удалить слайд"
          onClick={deleteCurrentSlide}
          color="red"
          size="medium"
          disabled={slides.length <= 1 || isEditing}
        />

        {!isEditing && (
          <PresentationButton
            title="Редактировать слайд"
            onClick={startEditing}
            color="blue"
            size="medium"
          />
        )}
      </div>

      {/* Миниатюры слайдов */}
      <div className={styles.thumbnails}>
        <h3>Все слайды:</h3>
        <div className={styles.thumbnailList}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.thumbnail} ${
                index === currentSlideIndex ? styles.active : ''
              } ${isEditing ? styles.disabled : ''}`}
              onClick={() => {
                if (!isEditing) {
                  setPresentation(prev => ({
                    ...prev,
                    currentSlideIndex: index
                  }));
                }
              }}
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