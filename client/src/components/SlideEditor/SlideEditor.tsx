import { useEffect, useState } from 'react';
import { SlideData, SlideFormData } from '../../types';
import styles from './SlideEditor.module.css';

interface SlideEditorProps {
  slide: SlideData;
  onSave: (updatedSlide: SlideData) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const SlideEditor = ({ 
  slide, 
  onSave, 
  onCancel,
  isEditing 
}: SlideEditorProps) => {
  const [formData, setFormData] = useState<SlideFormData>({
    title: '',
    content: ''
  });

  const [errors, setErrors] = useState<Partial<SlideFormData>>({});

  // Инициализация формы при монтировании или изменении слайда
  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title,
        content: slide.content
      });
    }
  }, [slide]);

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Partial<SlideFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок не может быть пустым';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Содержание не может быть пустым';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчики событий
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Очищаем ошибку при вводе
    if (errors[name as keyof SlideFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (validateForm()) {
      const updatedSlide: SlideData = {
        ...slide, // сохраняем id из исходного слайда
        title: formData.title.trim(),
        content: formData.content.trim()
      };
      onSave(updatedSlide);
    }
  };

  const handleReset = (): void => {
    setFormData({
      title: slide.title,
      content: slide.content
    });
    setErrors({});
  };

  if (!isEditing) {
    return null;
  }

  return (
    <div className={styles.editor}>
      <h2 className={styles.title}>Редактирование слайда</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Заголовок слайда:
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.title ? styles.error : ''}`}
            placeholder="Введите заголовок слайда..."
          />
          {errors.title && (
            <span className={styles.errorText}>{errors.title}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            Содержание слайда:
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className={`${styles.textarea} ${errors.content ? styles.error : ''}`}
            placeholder="Введите содержание слайда..."
            rows={6}
          />
          {errors.content && (
            <span className={styles.errorText}>{errors.content}</span>
          )}
        </div>

        <div className={styles.buttons}>
          <button 
            type="submit" 
            className={styles.saveButton}
          >
            Сохранить изменения
          </button>
          
          <button 
            type="button" 
            onClick={handleReset}
            className={styles.resetButton}
            disabled={formData.title === slide.title && formData.content === slide.content}
          >
            Сбросить
          </button>
          
          <button 
            type="button" 
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};