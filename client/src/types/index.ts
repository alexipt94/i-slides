export interface ButtonProps {
  title: string;
  onClick: () => void;
  color?: 'green' | 'red' | 'blue';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean; // Добавляем disabled для кнопок
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

// Добавляем тип для состояния презентации
export interface PresentationState {
  currentSlideIndex: number;
  slides: SlideProps[];
  isPlaying: boolean;
}