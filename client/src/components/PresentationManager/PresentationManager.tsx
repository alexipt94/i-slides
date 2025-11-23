import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '../../contexts/AppContext';
import { usePresentation } from '../../hooks/usePresentation';
import { usePresentationApi } from '../../hooks/usePresentationApi';
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
  }
];

interface PresentationManagerProps {
  mode?: 'edit' | 'view';
}

export const PresentationManager = ({ mode = 'edit' }: PresentationManagerProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { savePresentation, updatePresentation, getPresentation } = usePresentationApi();

  // 🎯 ИСПОЛЬЗОВАНИЕ КАСТОМНОГО ХУКА ДЛЯ УПРАВЛЕНИЯ СОСТОЯНИЕМ
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // 🎯 ЗАГРУЗКА ПРЕЗЕНТАЦИИ ПРИ ИЗМЕНЕНИИ ID В URL
  const loadPresentation = useCallback(async () => {
    // 🛑 ПРЕДОТВРАЩАЕМ ПОВТОРНУЮ ЗАГРУЗКУ
    if (id && id !== 'new' && !hasLoaded) {
      setIsLoading(true);
      console.log('🔄 Loading presentation with ID:', id);
      
      try {
        const presentation = await getPresentation(id);
        if (presentation) {
          setSlides(presentation.slides);
          setPresentationTitle(presentation.title);
          addNotification({
            type: 'success',
            title: 'Презентация загружена',
            message: `"${presentation.title}" успешно загружена`
          });
        } else {
          addNotification({
            type: 'error',
            title: 'Ошибка загрузки',
            message: 'Не удалось загрузить презентацию'
          });
          navigate('/presentations');
        }
      } catch (error) {
        console.error('💥 Error loading presentation:', error);
        addNotification({
          type: 'error',
          title: 'Ошибка загрузки',
          message: 'Произошла ошибка при загрузке презентации'
        });
        navigate('/presentations');
      } finally {
        setIsLoading(false);
        setHasLoaded(true);
      }
    } else {
      setIsLoading(false);
    }
  }, [id, hasLoaded, getPresentation, setSlides, addNotification, navigate]);

  useEffect(() => {
    loadPresentation();
  }, [loadPresentation]);

  // 🎯 ОБРАБОТЧИКИ СОБЫТИЙ
  const handleUpdateSlide = useCallback((updatedSlide: SlideData) => {
    updateSlide(currentSlideIndex, updatedSlide);
    addNotification({
      type: 'success',
      title: 'Слайд обновлен',
      message: 'Изменения успешно сохранены'
    });
  }, [currentSlideIndex, updateSlide, addNotification]);

  const handleDeleteSlide = useCallback(() => {
    if (slides.length <= 1) {
      addNotification({
        type: 'warning',
        title: 'Нельзя удалить',
        message: 'Презентация должна содержать хотя бы один слайд'
      });
      return;
    }

    deleteSlide(currentSlideIndex);
    addNotification({
      type: 'info',
      title: 'Слайд удален',
      message: 'Слайд успешно удален из презентации'
    });
  }, [slides.length, currentSlideIndex, deleteSlide, addNotification]);

  const handleStartEditing = useCallback(() => {
    toggleEditing();
  }, [toggleEditing]);

  const handleCancelEditing = useCallback(() => {
    toggleEditing();
  }, [toggleEditing]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setPresentationTitle(newTitle);
  }, []);

  // 🎯 СОХРАНЕНИЕ ПРЕЗЕНТАЦИИ - КРИТИЧЕСКИ ВАЖНАЯ ФУНКЦИЯ
  const handleSaveAndExit = useCallback(async () => {
    console.log('💾 === START SAVE PROCESS ===');
    console.log('📝 Presentation title:', presentationTitle);
    console.log('🖼️ Slides:', slides);
    console.log('🆔 ID:', id);

    if (!presentationTitle.trim()) {
      addNotification({
        type: 'error',
        title: 'Ошибка сохранения',
        message: 'Введите название презентации'
      });
      return;
    }

    if (slides.length === 0) {
      addNotification({
        type: 'error',
        title: 'Ошибка сохранения',
        message: 'Презентация должна содержать хотя бы один слайд'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const presentationData = {
        title: presentationTitle,
        slides: slides,
      };
      
      console.log('📤 Sending data to server:', presentationData);

      let result;
      
      if (id && id !== 'new') {
        // Обновляем существующую презентацию
        console.log('✏️ Updating existing presentation');
        result = await updatePresentation(id, presentationData);
      } else {
        // Создаем новую презентацию
        console.log('🆕 Creating new presentation');
        result = await savePresentation(presentationData);
      }

      console.log('📨 Server response:', result);

      if (result) {
        addNotification({
          type: 'success',
          title: 'Презентация сохранена',
          message: `"${presentationTitle}" успешно сохранена`
        });
        navigate('/presentations');
      } else {
        addNotification({
          type: 'error',
          title: 'Ошибка сохранения',
          message: 'Не удалось сохранить презентацию'
        });
      }
    } catch (error) {
      console.error('💥 Save error:', error);
      addNotification({
        type: 'error',
        title: 'Ошибка сохранения',
        message: 'Произошла ошибка при сохранении презентации'
      });
    } finally {
      setIsLoading(false);
    }
  }, [presentationTitle, slides, id, updatePresentation, savePresentation, addNotification, navigate]);

  const handleStartPresentation = useCallback(() => {
    if (id && id !== 'new') {
      navigate(`/presentations/${id}/view`);
    } else {
      togglePlaying();
      addNotification({
        type: 'info',
        title: 'Режим презентации',
        message: 'Для полноценного режима презентации сохраните её сначала'
      });
    }
  }, [id, navigate, togglePlaying, addNotification]);

  const handleExportPresentation = useCallback(() => {
    addNotification({
      type: 'info',
      title: 'Экспорт',
      message: 'Функция экспорта будет доступна в следующем обновлении'
    });
  }, [addNotification]);

  // 🎯 РЕЖИМ ПРОСМОТРА - автоматический запуск показа
  useEffect(() => {
    if (mode === 'view' && !isPlaying) {
      togglePlaying();
    }
  }, [mode, isPlaying, togglePlaying]);

  // 🎯 АВТОМАТИЧЕСКАЯ ПРОКРУТКА В РЕЖИМЕ ПОКАЗА
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;

    if (isPlaying && mode === 'view' && slides.length > 1) {
      slideInterval = setInterval(() => {
        if (currentSlideIndex < slides.length - 1) {
          goToNextSlide();
        } else {
          clearInterval(slideInterval);
        }
      }, 5000); // Смена слайда каждые 5 секунд
    }

    return () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };
  }, [isPlaying, currentSlideIndex, slides.length, goToNextSlide, mode]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка презентации...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.manager} ${mode === 'view' ? styles.viewMode : ''}`}>
      {/* 🎯 ШАПКА РЕДАКТОРА */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            onClick={() => navigate('/presentations')}
            className={styles.backButton}
            title="Вернуться к списку презентаций"
          >
            ← Назад
          </button>
          <input
            type="text"
            value={presentationTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={styles.titleInput}
            placeholder="Название презентации..."
            disabled={mode === 'view'}
          />
        </div>
        
        <div className={styles.status}>
          {mode === 'view' ? (
            <>Режим показа | Слайд {currentSlideIndex + 1} из {slides.length}</>
          ) : (
            <>Режим: {isEditing ? 'Редактирование' : 'Просмотр'} | Слайд {currentSlideIndex + 1} из {slides.length}</>
          )}
        </div>

        <div className={styles.headerActions}>
          {mode === 'edit' && (
            <>
              <PresentationButton
                title="Сохранить и выйти"
                onClick={handleSaveAndExit}
                color="green"
                size="medium"
                disabled={isLoading}
              />
              <PresentationButton
                title="Экспорт"
                onClick={handleExportPresentation}
                color="blue"
                size="medium"
              />
            </>
          )}
        </div>
      </div>

      {/* 🎯 ОБЛАСТЬ СЛАЙДА */}
      <div className={styles.slideArea}>
        {isEditing && currentSlide && mode === 'edit' ? (
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

      {/* 🎯 НАВИГАЦИЯ */}
      <div className={styles.navigation}>
        <PresentationButton
          title="← Назад"
          onClick={goToPrevSlide}
          color="blue"
          size="medium"
          disabled={currentSlideIndex === 0 || isEditing || mode === 'view'}
        />

        <div className={styles.controls}>
          {mode === 'edit' ? (
            <>
              <PresentationButton
                title={isPlaying ? "Остановить показ" : "Начать показ"}
                onClick={handleStartPresentation}
                color={isPlaying ? "red" : "green"}
                size="large"
                disabled={isEditing}
              />
              <PresentationButton
                title="Добавить слайд"
                onClick={createNewSlide}
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
            </>
          ) : (
            // Кнопки для режима просмотра
            <>
              <PresentationButton
                title={isPlaying ? "Пауза" : "Продолжить"}
                onClick={togglePlaying}
                color={isPlaying ? "red" : "green"}
                size="large"
              />
              <PresentationButton
                title="Завершить показ"
                onClick={() => navigate('/presentations')}
                color="red"
                size="medium"
              />
            </>
          )}
        </div>

        <PresentationButton
          title="Вперед →"
          onClick={goToNextSlide}
          color="blue"
          size="medium"
          disabled={currentSlideIndex === slides.length - 1 || isEditing || mode === 'view'}
        />
      </div>

      {/* 🎯 МИНИАТЮРЫ СЛАЙДОВ */}
      {mode === 'edit' && (
        <div className={styles.thumbnails}>
          <h3>Слайды презентации:</h3>
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
                  <div className={styles.thumbnailNumber}>{index + 1}</div>
                  <strong>{slide.title}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎯 КЛАВИАТУРНЫЕ СОКРАЩЕНИЯ ДЛЯ РЕЖИМА ПРОСМОТРА */}
      {mode === 'view' && (
        <div className={styles.keyboardHelp}>
          <span>Управление: ← → для навигации, Пробел для паузы/продолжения</span>
        </div>
      )}
    </div>
  );
};