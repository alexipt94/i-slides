import { useEffect, useState } from 'react';
import { usePresentationApi } from '../../hooks/usePresentationApi';
import { SlideData } from '../../types';
import { PresentationButton } from '../PresentationButton/PresentationButton';
import styles from './PresentationManager.module.css';

interface PresentationServerManagerProps {
  currentSlides: SlideData[];
  currentTitle: string;
  onLoadPresentation: (slides: SlideData[], title: string) => void;
  onCreateNewPresentation: () => void;
}

interface ServerPresentation {
  id: string;
  title: string;
  slides: SlideData[];
  createdAt: string;
  updatedAt: string;
}

export const PresentationServerManager = ({
  currentSlides,
  currentTitle,
  onLoadPresentation,
  onCreateNewPresentation
}: PresentationServerManagerProps) => {
  const {
    savePresentation,
    updatePresentation,
    getAllPresentations,
    deletePresentation,
    loading,
    error,
    clearError
  } = usePresentationApi();

  const [presentations, setPresentations] = useState<ServerPresentation[]>([]);
  const [selectedPresentation, setSelectedPresentation] = useState<string>('');
  const [saveTitle, setSaveTitle] = useState(currentTitle);

  // Загружаем презентации при монтировании
  useEffect(() => {
    loadPresentations();
  }, []);

  // Обновляем заголовок при изменении текущего
  useEffect(() => {
    setSaveTitle(currentTitle);
  }, [currentTitle]);

  const loadPresentations = async () => {
    const serverPresentations = await getAllPresentations();
    if (serverPresentations) {
      setPresentations(serverPresentations);
    }
  };

  const handleSavePresentation = async () => {
    if (!saveTitle.trim()) {
      alert('Введите название презентации');
      return;
    }

    const result = await savePresentation({
      title: saveTitle,
      slides: currentSlides
    });

    if (result) {
      alert('Презентация успешно сохранена на сервере!');
      await loadPresentations();
      setSaveTitle(`Презентация ${presentations.length + 1}`);
    } else {
      alert('Ошибка при сохранении: ' + error);
    }
  };

  const handleUpdatePresentation = async () => {
    if (!selectedPresentation) {
      alert('Выберите презентацию для обновления');
      return;
    }

    const result = await updatePresentation(selectedPresentation, {
      title: saveTitle,
      slides: currentSlides
    });

    if (result) {
      alert('Презентация успешно обновлена!');
      await loadPresentations();
    } else {
      alert('Ошибка при обновлении: ' + error);
    }
  };

  const handleLoadPresentation = () => {
    const presentation = presentations.find(p => p.id === selectedPresentation);
    if (presentation) {
      onLoadPresentation(presentation.slides, presentation.title);
      setSaveTitle(presentation.title);
      alert(`Презентация "${presentation.title}" загружена!`);
    }
  };

  const handleDeletePresentation = async () => {
    if (!selectedPresentation) {
      alert('Выберите презентацию для удаления');
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить эту презентацию?')) {
      return;
    }

    const success = await deletePresentation(selectedPresentation);
    if (success) {
      alert('Презентация удалена!');
      setSelectedPresentation('');
      await loadPresentations();
    } else {
      alert('Ошибка при удалении: ' + error);
    }
  };

  return (
    <div className={styles.serverManager}>
      <h3>Управление на сервере</h3>

      {error && (
        <div className={styles.error}>
          Ошибка: {error}
          <button onClick={clearError} className={styles.clearError}>×</button>
        </div>
      )}

      <div className={styles.saveSection}>
        <div className={styles.formGroup}>
          <label>Название презентации:</label>
          <input
            type="text"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            className={styles.input}
            placeholder="Введите название..."
          />
        </div>

        <div className={styles.saveButtons}>
          <PresentationButton
            title="Создать новую"
            onClick={onCreateNewPresentation}
            color="green"
            size="medium"
            disabled={loading}
          />
          
          <PresentationButton
            title="Сохранить новую"
            onClick={handleSavePresentation}
            color="green"
            size="medium"
            disabled={loading}
          />
          
          <PresentationButton
            title="Обновить выбранную"
            onClick={handleUpdatePresentation}
            color="blue"
            size="medium"
            disabled={loading || !selectedPresentation}
          />
        </div>
      </div>

      <div className={styles.presentationsList}>
        <div className={styles.listHeader}>
          <h4>Сохраненные презентации:</h4>
          <PresentationButton
            title="Обновить список"
            onClick={loadPresentations}
            color="blue"
            size="small"
            disabled={loading}
          />
        </div>

        {presentations.length === 0 ? (
          <p className={styles.noData}>Нет сохраненных презентаций</p>
        ) : (
          <div className={styles.presentationItems}>
            {presentations.map(presentation => (
              <div
                key={presentation.id}
                className={`${styles.presentationItem} ${
                  selectedPresentation === presentation.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedPresentation(presentation.id)}
              >
                <div className={styles.presentationInfo}>
                  <strong>{presentation.title}</strong>
                  <span>Слайдов: {presentation.slides.length}</span>
                  <small>
                    Обновлено: {new Date(presentation.updatedAt).toLocaleDateString()}
                  </small>
                </div>
                
                {selectedPresentation === presentation.id && (
                  <div className={styles.itemActions}>
                    <PresentationButton
                      title="Загрузить"
                      onClick={handleLoadPresentation}
                      color="blue"
                      size="small"
                    />
                    <PresentationButton
                      title="Удалить"
                      onClick={handleDeletePresentation}
                      color="red"
                      size="small"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};