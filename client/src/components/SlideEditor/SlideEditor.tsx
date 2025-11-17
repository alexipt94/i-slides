import { useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { SlideData, SlideFormData } from '../../types';
import styles from './SlideEditor.module.css';

interface SlideEditorProps {
  slide: SlideData;
  onSave: (updatedSlide: SlideData) => void;
  onCancel: () => void;
  isEditing: boolean;
}

// Валидация формы
const validateSlideForm = (values: SlideFormData): Partial<Record<keyof SlideFormData, string>> => {
  const errors: Partial<Record<keyof SlideFormData, string>> = {};

  if (!values.title.trim()) {
    errors.title = 'Заголовок не может быть пустым';
  }

  if (!values.content.trim()) {
    errors.content = 'Содержание не может быть пустым';
  }

  return errors;
};

export const SlideEditor = ({ 
  slide, 
  onSave, 
  onCancel,
  isEditing 
}: SlideEditorProps) => {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFormValues
  } = useForm<SlideFormData>({
    initialValues: {
      title: slide.title,
      content: slide.content
    },
    onSubmit: (formValues) => {
      const updatedSlide: SlideData = {
        ...slide,
        title: formValues.title.trim(),
        content: formValues.content.trim()
      };
      onSave(updatedSlide);
    },
    validate: validateSlideForm
  });

  // Синхронизация формы при изменении слайда
  useEffect(() => {
    setFormValues({
      title: slide.title,
      content: slide.content
    });
  }, [slide, setFormValues]);

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
            type="text"
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`${styles.input} ${errors.title ? styles.error : ''}`}
            placeholder="Введите заголовок слайда..."
            disabled={isSubmitting}
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
            value={values.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className={`${styles.textarea} ${errors.content ? styles.error : ''}`}
            placeholder="Введите содержание слайда..."
            rows={6}
            disabled={isSubmitting}
          />
          {errors.content && (
            <span className={styles.errorText}>{errors.content}</span>
          )}
        </div>

        <div className={styles.buttons}>
          <button 
            type="submit" 
            className={styles.saveButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          
          <button 
            type="button" 
            onClick={resetForm}
            className={styles.resetButton}
            disabled={isSubmitting || (values.title === slide.title && values.content === slide.content)}
          >
            Сбросить
          </button>
          
          <button 
            type="button" 
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};