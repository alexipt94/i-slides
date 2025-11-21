import { useState } from 'react';
import { usePresentation } from '../../hooks/usePresentation';
import type { SlideData } from '../../types';
import { PresentationButton } from '../PresentationButton/PresentationButton';
import { Slide } from '../Slide/Slide';
import { SlideEditor } from '../SlideEditor/SlideEditor';
import styles from './PresentationManager.module.css';
import { PresentationServerManager } from './PresentationServerManager';

const initialSlides: SlideData[] = [
  {
    id: 1,
    title: "Добро пожаловать в i-slides!",
    content: "Это демонстрационная презентация. Используйте кнопки для навигации."
  }
];

export const PresentationManager = () => {
  const {
    currentSlideIndex,
    slides,
    isPlaying,
    isEditing,
    currentSlide,
    setCurrentSlide,
    updateSlide,
    deleteSlide,
    togglePlaying,
    toggleEditing,
    setSlides,
    goToNextSlide,
    goToPrevSlide,
    createNewSlide
  } = usePresentation(initialSlides);

  const [presentationTitle, setPresentationTitle] = useState('Моя презентация');

  const handleAddSlide = () => {
    createNewSlide();
  };

  const handleUpdateSlide = (updatedSlide: SlideData) => {
    updateSlide(currentSlideIndex, updatedSlide);
  };

  const handleDeleteSlide = () => {
    deleteSlide(currentSlideIndex);
  };

  const handleStartEditing = () => {
    toggleEditing();
  };

  const handleCancelEditing = () => {
    toggleEditing();
  };

  const handleLoadPresentation = (newSlides: SlideData[], title: string) => {
    setSlides(newSlides);
    setPresentationTitle(title);
    setCurrentSlide(0);
    toggleEditing();
  };

  const handleCreateNewPresentation = () => {
    const newSlide: SlideData = {
      id: 1,
      title: "Новая презентация",
      content: "Начните редактирование этого слайда"
    };
    setSlides([newSlide]);
    setPresentationTitle("Новая презентация");
    setCurrentSlide(0);
    toggleEditing();
  };

  const handleTitleChange = (newTitle: string) => {
    setPresentationTitle(newTitle);
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Редактор презентаций i-slides</h2>
        <div className={styles.status}>
          Статус: {isPlaying ? 'Запущена' : 'Редактирование'} |
          Слайд {currentSlideIndex + 1} из {slides.length}
        </div>
      </div>

      <div className={styles.titleSection}>
        <input
          type="text"
          value={presentationTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={styles.titleInput}
          placeholder="Название презентации..."
        />
      </div>

      <div className={styles.slideArea}>
        {isEditing && currentSlide ? (
          <SlideEditor 
            slide={currentSlide}
            onSave={handleUpdateSlide}
            onCancel={handleCancelEditing}
            isEditing={isEditing}
          />
        ) : (
          <div className={styles.slideContainer}>
            {currentSlide && (
              <Slide 
                title={currentSlide.title} 
                content={currentSlide.content} 
              />
            )}
          </div>
        )}
      </div>

      <div className={styles.navigation}>
        <PresentationButton
          title="← Назад"
          onClick={goToPrevSlide}
          color="blue"
          size="medium"
          disabled={currentSlideIndex === 0 || isEditing}
        />

        <div className={styles.controls}>
          <PresentationButton
            title={isPlaying ? "Остановить показ" : "Начать показ"}
            onClick={togglePlaying}
            color={isPlaying ? "red" : "green"}
            size="large"
            disabled={isEditing}
          />

          <PresentationButton
            title="Добавить слайд"
            onClick={handleAddSlide}
            color="green"
            size="medium"
          />

          <PresentationButton
            title="Удалить слайд"
            onClick={handleDeleteSlide}
            color="red"
            size="medium"
            disabled={slides.length <= 1 || isEditing}
          />

          {!isEditing && currentSlide && (
            <PresentationButton
              title="Редактировать слайд"
              onClick={handleStartEditing}
              color="blue"
              size="medium"
            />
          )}
        </div>

        <PresentationButton
          title="Вперед →"
          onClick={goToNextSlide}
          color="blue"
          size="medium"
          disabled={currentSlideIndex === slides.length - 1 || isEditing}
        />
      </div>

      <PresentationServerManager
        currentSlides={slides}
        currentTitle={presentationTitle}
        onLoadPresentation={handleLoadPresentation}
        onCreateNewPresentation={handleCreateNewPresentation}
      />

      <div className={styles.thumbnails}>
        <h3>Слайды текущей презентации:</h3>
        <div className={styles.thumbnailList}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.thumbnail} ${
                index === currentSlideIndex ? styles.active : ''
              } ${isEditing ? styles.disabled : ''}`}
              onClick={() => {
                if (!isEditing) {
                  setCurrentSlide(index);
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