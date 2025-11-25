// Основные типы приложения
export type SlideType = 'title' | 'content' | 'split' | 'media';

export interface SlideData {
  id: number;
  type: SlideType;
  layout: SlideLayout;
  theme: SlideTheme;
  duration?: number;
  
  // Общие поля для разных типов слайдов
  title?: string;
  content?: string;
  subtitle?: string;
  backgroundImage?: string;
  alignment?: 'left' | 'center' | 'right';
  bulletPoints?: string[];
  image?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'bottom';
  leftContent?: string;
  rightContent?: string;
  leftType?: 'text' | 'image' | 'video';
  rightType?: 'text' | 'image' | 'video';
}

// Остальные типы остаются без изменений...
export interface SlideLayout {
  type: 'full' | 'split' | 'header-content' | 'custom';
  areas?: string[];
}

export interface SlideTheme {
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
}

export interface Presentation {
  id: string;
  title: string;
  slides: SlideData[];
  createdAt: string;
  updatedAt: string;
}

export interface SavePresentationRequest {
  title: string;
  slides: SlideData[];
}

export interface ButtonProps {
  title: string;
  onClick: () => void;
  color?: 'green' | 'red' | 'blue' | 'purple';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}