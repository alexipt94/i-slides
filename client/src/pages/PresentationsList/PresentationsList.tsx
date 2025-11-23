import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PresentationButton } from '../../components/PresentationButton/PresentationButton';
import { useNotifications } from '../../contexts/AppContext';
import { usePresentationApi } from '../../hooks/usePresentationApi';
import styles from './PresentationsList.module.css';

interface Presentation {
  id: string;
  title: string;
  slides: any[];
  createdAt: string;
  updatedAt: string;
}

export const PresentationsList = () => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllPresentations, deletePresentation } = usePresentationApi();
  const { addNotification } = useNotifications();

  // 🛑 ИСПРАВЛЯЕМ БЕСКОНЕЧНЫЙ ЦИКЛ
  const loadPresentations = useCallback(async () => {
    setLoading(true);
    console.log('Loading presentations...');
    
    try {
      const data = await getAllPresentations();
      console.log('Loaded presentations:', data);
      
      if (data) {
        setPresentations(data);
      } else {
        setPresentations([]);
        console.log('No presentations data received');
      }
    } catch (error) {
      console.error('Error loading presentations:', error);
      setPresentations([]);
    } finally {
      setLoading(false);
    }
  }, [getAllPresentations]);

  // 🛑 ДОБАВЛЯЕМ ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ - ВЫЗЫВАЕМ ТОЛЬКО ПРИ МОНТИРОВАНИИ
  useEffect(() => {
    loadPresentations();
  }, []); // Пустой массив зависимостей

  const handleDeletePresentation = async (id: string, title: string) => {
    if (window.confirm(`Удалить презентацию "${title}"?`)) {
      const success = await deletePresentation(id);
      if (success) {
        addNotification({
          type: 'success',
          title: 'Презентация удалена',
          message: `"${title}" успешно удалена`
        });
        loadPresentations(); // Перезагружаем список только после удаления
      } else {
        addNotification({
          type: 'error',
          title: 'Ошибка удаления',
          message: 'Не удалось удалить презентацию'
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка презентаций...</div>;
  }

  console.log('Rendering PresentationsList, presentations count:', presentations.length);

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <h1>Мои презентации</h1>
        <Link to="/create">
          <PresentationButton
            title="Создать новую"
            color="green"
            size="large"
            onClick={() => {}}
          />
        </Link>
      </div>

      {presentations.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📁</div>
          <h2>Презентаций пока нет</h2>
          <p>Создайте свою первую презентацию</p>
          <Link to="/create">
            <PresentationButton
              title="Создать презентацию"
              color="green"
              size="large"
              onClick={() => {}}
            />
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {presentations.map((presentation) => (
            <div key={presentation.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{presentation.title}</h3>
                <div className={styles.cardMeta}>
                  <span>Слайдов: {presentation.slides.length}</span>
                  <span>Обновлено: {formatDate(presentation.updatedAt)}</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <Link 
                  to={`/presentations/${presentation.id}/view`}
                  className={styles.actionButton}
                >
                  👁️ Просмотр
                </Link>
                <Link 
                  to={`/presentations/${presentation.id}/edit`}
                  className={styles.actionButton}
                >
                  ✏️ Редактировать
                </Link>
                <button
                  onClick={() => handleDeletePresentation(presentation.id, presentation.title)}
                  className={`${styles.actionButton} ${styles.delete}`}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};