import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PresentationButton } from '../../components/PresentationButton/PresentationButton';
import { useNotifications } from '../../contexts/AppContext';
import { usePresentationApi } from '../../hooks/usePresentationApi';
import styles from './PresentationsList.module.css';

export const PresentationsList = () => {
  const [presentations, setPresentations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllPresentations, deletePresentation } = usePresentationApi();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadPresentations = async () => {
      console.log('🔄 Loading presentations list...');
      try {
        const data = await getAllPresentations();
        if (isMounted) {
          if (data) {
            setPresentations(data);
          } else {
            console.log('❌ Failed to load presentations');
            setPresentations([]);
          }
        }
      } catch (error) {
        console.error('💥 Error loading presentations:', error);
        if (isMounted) {
          setPresentations([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPresentations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateNew = () => {
    navigate('/create');
  };

  const handleEdit = (id: string) => {
    console.log('✏️ Editing presentation with id:', id);
    navigate(`/presentations/${id}/edit`);
  };

  const handleView = (id: string) => {
    console.log('👀 Viewing presentation with id:', id);
    navigate(`/presentations/${id}/view`);
  };

  // 🎯 ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ ПРЕЗЕНТАЦИИ
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Вы уверены, что хотите удалить презентацию "${title}"?`)) {
      return;
    }

    console.log('🗑️ Deleting presentation:', id);
    
    try {
      const success = await deletePresentation(id);
      if (success) {
        // Удаляем презентацию из состояния
        setPresentations(prev => prev.filter(p => p.id !== id));
        addNotification({
          type: 'success',
          title: 'Презентация удалена',
          message: `Презентация "${title}" успешно удалена`
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Ошибка удаления',
          message: 'Не удалось удалить презентацию'
        });
      }
    } catch (error) {
      console.error('💥 Error deleting presentation:', error);
      addNotification({
        type: 'error',
        title: 'Ошибка удаления',
        message: 'Произошла ошибка при удалении презентации'
      });
    }
  };

  // 🎯 ФУНКЦИЯ ДЛЯ ПЕРЕЗАГРУЗКИ СПИСКА
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await getAllPresentations();
      if (data) {
        setPresentations(data);
        addNotification({
          type: 'success',
          title: 'Список обновлен',
          message: 'Список презентаций успешно обновлен'
        });
      }
    } catch (error) {
      console.error('💥 Error refreshing presentations:', error);
      addNotification({
        type: 'error',
        title: 'Ошибка обновления',
        message: 'Не удалось обновить список презентаций'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка презентаций...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Мои презентации</h1>
        <div className={styles.headerActions}>
          <PresentationButton
            title="Обновить список"
            onClick={handleRefresh}
            color="blue"
            size="medium"
          />
          <PresentationButton
            title="Создать презентацию"
            onClick={handleCreateNew}
            color="green"
            size="large"
          />
        </div>
      </div>

      <div className={styles.list}>
        {presentations.map(presentation => (
          <div key={presentation.id} className={styles.item}>
            <div className={styles.info}>
              <h3>{presentation.title}</h3>
              <div className={styles.details}>
                <span>Слайдов: {presentation.slides?.length || 0}</span>
                <span>Создано: {new Date(presentation.createdAt).toLocaleDateString('ru-RU')}</span>
                <span>Обновлено: {new Date(presentation.updatedAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
            <div className={styles.actions}>
              <PresentationButton
                title="Редактировать"
                onClick={() => handleEdit(presentation.id)}
                color="blue"
                size="medium"
              />
              <PresentationButton
                title="Просмотреть"
                onClick={() => handleView(presentation.id)}
                color="green"
                size="medium"
              />
              {/* 🎯 КНОПКА УДАЛЕНИЯ */}
              <PresentationButton
                title="Удалить"
                onClick={() => handleDelete(presentation.id, presentation.title)}
                color="red"
                size="medium"
              />
            </div>
          </div>
        ))}
      </div>

      {presentations.length === 0 && (
        <div className={styles.empty}>
          <p>У вас пока нет презентаций</p>
          <PresentationButton
            title="Создать первую презентацию"
            onClick={handleCreateNew}
            color="green"
            size="large"
          />
        </div>
      )}
    </div>
  );
};