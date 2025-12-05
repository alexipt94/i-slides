import { Presentation } from 'lucide-react';
import styles from './styles/presentation.module.css';

interface SlidePreviewProps {
  slideCount: number;
  thumbnail?: string;
}

export const SlidePreview = ({ slideCount, thumbnail }: SlidePreviewProps) => {
  return (
    <div className={styles.slidePreview}>
      <div className={styles.slidePreviewContent}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt="Превью слайда"
            className={styles.slideImage}
          />
        ) : (
          <div className={styles.slidePlaceholder}>
            <Presentation size={48} />
          </div>
        )}
        <div className={styles.slideCount}>
          {slideCount}
        </div>
      </div>
    </div>
  );
};