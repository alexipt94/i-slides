export interface ButtonProps {
  title: string;
  onClick: () => void;
  color?: 'green' | 'red' | 'blue';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

// Разделяем типы для данных слайда и для отображения
export interface SlideData {
  id: number;
  title: string;
  content: string;
}

export interface SlideProps {
  title: string;
  content: string;
}

export interface Presentation {
  id: number;
  title: string;
  slidesCount: number;
}

export interface PresentationState {
  currentSlideIndex: number;
  slides: SlideData[];
  isPlaying: boolean;
  isEditing: boolean;
}

export interface SlideFormData {
  title: string;
  content: string;
}