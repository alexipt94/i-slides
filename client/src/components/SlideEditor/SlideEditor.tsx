import { useState } from 'react';
import { SlideData, SlideType } from '../../types';
import { Slide } from '../Slide/Slide';
import styles from './SlideEditor.module.css';

interface SlideEditorProps {
  slide: SlideData;
  onSave: (updatedSlide: SlideData) => void;
  onCancel: () => void;
}

export const SlideEditor = ({ slide, onSave, onCancel }: SlideEditorProps) => {
  const [editedSlide, setEditedSlide] = useState<SlideData>(slide);

  const updateSlide = (updates: Partial<SlideData>) => {
    setEditedSlide(prev => ({ ...prev, ...updates }));
  };

  const changeSlideType = (newType: SlideType) => {
    const newSlide = createDefaultSlide(newType);
    newSlide.id = editedSlide.id;
    setEditedSlide(newSlide);
  };

  const updateTheme = (theme: Partial<SlideData['theme']>) => {
    setEditedSlide(prev => ({
      ...prev,
      theme: { ...prev.theme, ...theme }
    }));
  };

  const handleSave = () => {
    onSave(editedSlide);
  };

  const handleThemeChange = (property: keyof SlideData['theme'], value: string | number) => {
    updateTheme({ [property]: value });
  };

  // Функция для редактирования содержимого в зависимости от типа слайда
  const renderContentEditor = () => {
    switch (editedSlide.type) {
      case 'title':
        return (
          <div className={styles.contentEditor}>
            <label>
              Заголовок:
              <input
                type="text"
                value={editedSlide.title || ''}
                onChange={(e) => updateSlide({ title: e.target.value })}
                className={styles.textInput}
              />
            </label>
            <label>
              Подзаголовок:
              <input
                type="text"
                value={editedSlide.subtitle || ''}
                onChange={(e) => updateSlide({ subtitle: e.target.value })}
                className={styles.textInput}
              />
            </label>
            <label>
              Выравнивание:
              <select
                value={editedSlide.alignment || 'center'}
                onChange={(e) => updateSlide({ alignment: e.target.value as 'left' | 'center' | 'right' })}
                className={styles.select}
              >
                <option value="left">Слева</option>
                <option value="center">По центру</option>
                <option value="right">Справа</option>
              </select>
            </label>
          </div>
        );
      
      case 'content':
        return (
          <div className={styles.contentEditor}>
            <label>
              Заголовок:
              <input
                type="text"
                value={editedSlide.title || ''}
                onChange={(e) => updateSlide({ title: e.target.value })}
                className={styles.textInput}
              />
            </label>
            <label>
              Содержимое:
              <textarea
                value={editedSlide.content || ''}
                onChange={(e) => updateSlide({ content: e.target.value })}
                className={styles.textarea}
                rows={6}
              />
            </label>
          </div>
        );
      
      case 'split':
        return (
          <div className={styles.contentEditor}>
            <label>
              Левая колонка:
              <textarea
                value={editedSlide.leftContent || ''}
                onChange={(e) => updateSlide({ leftContent: e.target.value })}
                className={styles.textarea}
                rows={4}
              />
            </label>
            <label>
              Правая колонка:
              <textarea
                value={editedSlide.rightContent || ''}
                onChange={(e) => updateSlide({ rightContent: e.target.value })}
                className={styles.textarea}
                rows={4}
              />
            </label>
          </div>
        );
      
      default:
        return <div>Редактор для этого типа слайда не реализован</div>;
    }
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <h3>Редактор слайда</h3>
        <select 
          value={editedSlide.type}
          onChange={(e) => changeSlideType(e.target.value as SlideType)}
          className={styles.typeSelector}
        >
          <option value="title">Слайд-заголовок</option>
          <option value="content">Текстовый слайд</option>
          <option value="split">Разделенный слайд</option>
        </select>
      </div>

      <div className={styles.editorBody}>
        <div className={styles.preview}>
          <Slide slide={editedSlide} />
        </div>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <h4>Содержимое</h4>
            {renderContentEditor()}
          </div>

          <div className={styles.controlGroup}>
            <h4>Внешний вид</h4>
            <label>
              Цвет фона:
              <input
                type="color"
                value={editedSlide.theme.backgroundColor}
                onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
              />
            </label>
            <label>
              Цвет текста:
              <input
                type="color"
                value={editedSlide.theme.textColor}
                onChange={(e) => handleThemeChange('textColor', e.target.value)}
              />
            </label>
            <label>
              Размер шрифта:
              <input
                type="range"
                min="12"
                max="32"
                value={editedSlide.theme.fontSize}
                onChange={(e) => handleThemeChange('fontSize', parseInt(e.target.value))}
              />
              {editedSlide.theme.fontSize}px
            </label>
          </div>

          <div className={styles.actions}>
            <button onClick={handleSave} className={styles.saveButton}>
              Сохранить
            </button>
            <button onClick={onCancel} className={styles.cancelButton}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция для создания слайда по умолчанию
const createDefaultSlide = (type: SlideType): SlideData => {
  const baseSlide: SlideData = {
    id: 0,
    type,
    layout: { type: 'full' },
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      fontFamily: 'Arial, sans-serif',
      fontSize: 16
    }
  };

  switch (type) {
    case 'title':
      return {
        ...baseSlide,
        title: 'Новый заголовок',
        subtitle: '',
        alignment: 'center'
      };
    
    case 'content':
      return {
        ...baseSlide,
        title: 'Заголовок слайда',
        content: 'Содержимое вашего слайда...'
      };
    
    case 'split':
      return {
        ...baseSlide,
        leftContent: 'Левая колонка...',
        rightContent: 'Правая колонка...'
      };
    
    default:
      return baseSlide;
  }
};