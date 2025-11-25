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

// 🎯 ОБНОВЛЕННЫЕ НАЧАЛЬНЫЕ СЛАЙДЫ С НОВОЙ СТРУКТУРОЙ
const initialSlides: SlideData[] = [
  {
    id: 1,
    type: 'content',
    title: "Добро пожаловать в i-slides!",
    content: "Это демонстрационная презентация. Используйте кнопки для навигации.",
    layout: { type: 'full' },
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      fontFamily: 'Arial, sans-serif',
      fontSize: 16
    }
  }
];

interface PresentationManagerProps {
  mode?: 'edit' | 'view';
}

export const PresentationManager = ({ mode = 'edit' }: PresentationManagerProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

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
  const { getPresentation, savePresentation, updatePresentation } = usePresentationApi();

  // 🎯 ФИКС: загрузка презентации только при изменении id
  useEffect(() => {
    let isMounted = true;

    const loadPresentation = async (presentationId: string) => {
      if (!presentationId || presentationId === 'new') {
        return;
      }

      setIsLoading(true);
      console.log('🔄 Loading presentation with ID:', presentationId);

      try {
        const presentation = await getPresentation(presentationId);
        if (isMounted && presentation) {
          setSlides(presentation.slides);
          setPresentationTitle(presentation.title);
          addNotification({
            type: 'success',
            title: 'Презентация загружена',
            message: `"${presentation.title}" успешно загружена`
          });
        } else if (isMounted) {
          addNotification({
            type: 'error',
            title: 'Ошибка загрузки',
            message: 'Не удалось загрузить презентацию'
          });
          navigate('/presentations');
        }
      } catch (error) {
        console.error('💥 Error loading presentation:', error);
        if (isMounted) {
          addNotification({
            type: 'error',
            title: 'Ошибка загрузки',
            message: 'Произошла ошибка при загрузке презентации'
          });
          navigate('/presentations');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      loadPresentation(id);
    }

    return () => {
      isMounted = false;
    };
  }, [id]); // 🎯 ТОЛЬКО id в зависимостях

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

  // 🎯 ФУНКЦИИ ДЛЯ СОЗДАНИЯ РАЗЛИЧНЫХ ТИПОВ СЛАЙДОВ
  const handleCreateTitleSlide = useCallback(() => {
    createNewSlide('title');
  }, [createNewSlide]);

  const handleCreateContentSlide = useCallback(() => {
    createNewSlide('content');
  }, [createNewSlide]);

  const handleCreateSplitSlide = useCallback(() => {
    createNewSlide('split');
  }, [createNewSlide]);

  // 🎯 СОХРАНЕНИЕ ПРЕЗЕНТАЦИИ
  const handleSaveAndExit = useCallback(async () => {
    console.log('💾 Saving presentation...');

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

      let result;
      if (id && id !== 'new') {
        result = await updatePresentation(id, presentationData);
      } else {
        result = await savePresentation(presentationData);
      }

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
          />
        ) : (
          <div className={styles.slideContainer}>
            {currentSlide && (
              <Slide slide={currentSlide} />
            )}
          </div>
        )}
      </div>

      {/* 🎯 НАВИГАЦИЯ И УПРАВЛЕНИЕ */}
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
              
              {/* 🎯 КНОПКИ СОЗДАНИЯ РАЗНЫХ ТИПОВ СЛАЙДОВ */}
              <div className={styles.slideCreation}>
                <PresentationButton
                  title="Заголовок"
                  onClick={handleCreateTitleSlide}
                  color="blue"
                  size="medium"
                />
                <PresentationButton
                  title="Текст"
                  onClick={handleCreateContentSlide}
                  color="green"
                  size="medium"
                />
                <PresentationButton
                  title="Разделенный"
                  onClick={handleCreateSplitSlide}
                  color="blue"
                  size="medium"
                />
              </div>

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
                  <strong>
                    {slide.title || `Слайд ${slide.type}`}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};