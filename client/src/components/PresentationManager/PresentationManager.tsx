import { useLocalStorage } from '../../hooks/useLocalStorage';
import { usePresentation } from '../../hooks/usePresentation';
import type { SlideData } from '../../types';
import { PresentationButton } from '../PresentationButton/PresentationButton';
import { Slide } from '../Slide/Slide';
import { SlideEditor } from '../SlideEditor/SlideEditor';
import styles from './PresentationManager.module.css';

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

export const PresentationManager = () => {
  // Используем кастомный хук для localStorage
  const [savedSlides, setSavedSlides] = useLocalStorage<SlideData[]>(
    'i-slides-presentation',
    initialSlides
  );

  // Используем кастомный хук для управления презентацией
  const {
    // Состояние
    currentSlideIndex,
    slides,
    isPlaying,
    isEditing,
    currentSlide,
    
    // Действия
    setCurrentSlide,
    updateSlide,
    deleteSlide,
    togglePlaying,
    toggleEditing,
    
    // Вспомогательные функции
    goToNextSlide,
    goToPrevSlide,
    createNewSlide
  } = usePresentation(savedSlides);

  // Сохраняем слайды в localStorage при изменении
  const handleSaveSlides = (newSlides: SlideData[]) => {
    setSavedSlides(newSlides);
  };

  // Обработчики с интеграцией localStorage
  const handleAddSlide = () => {
    createNewSlide();
  };

  const handleUpdateSlide = (updatedSlide: SlideData) => {
    updateSlide(currentSlideIndex, updatedSlide);
    handleSaveSlides(slides.map((slide, index) => 
      index === currentSlideIndex ? updatedSlide : slide
    ));
  };

  const handleDeleteSlide = () => {
    deleteSlide(currentSlideIndex);
    handleSaveSlides(slides.filter((_, index) => index !== currentSlideIndex));
  };

  const handleStartEditing = () => {
    toggleEditing();
  };

  const handleCancelEditing = () => {
    toggleEditing();
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h2>Управление презентацией</h2>
        <div className={styles.status}>
          Статус: {isPlaying ? 'Запущена' : 'Остановлена'} | 
          Режим: {isEditing ? 'Редактирование' : 'Просмотр'} |
          Сохранено в localStorage: ✅
        </div>
      </div>

      {/* Область слайда */}
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