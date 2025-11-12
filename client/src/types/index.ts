export interface ButtonProps {
  title: string;
  onClick: () => void;
  color?: 'green' | 'red' | 'blue';
  size?: 'small' | 'medium' | 'large';
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