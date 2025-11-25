import { SlideData } from '../../types';
import styles from './Slide.module.css';

interface SlideProps {
  slide: SlideData;
  className?: string;
}

export const Slide = ({ slide, className = '' }: SlideProps) => {
  const renderContent = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className={styles.titleSlide}>
            <h1 className={styles.title}>{slide.title}</h1>
            {slide.subtitle && <h2 className={styles.subtitle}>{slide.subtitle}</h2>}
          </div>
        );
      
      case 'content':
        return (
          <div className={styles.contentSlide}>
            {slide.title && <h2 className={styles.slideTitle}>{slide.title}</h2>}
            <div className={styles.content}>
              {slide.content && slide.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
              {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                <ul>
                  {slide.bulletPoints.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      
      case 'split':
        return (
          <div className={styles.splitSlide}>
            <div className={styles.leftColumn}>
              {slide.leftContent}
            </div>
            <div className={styles.rightColumn}>
              {slide.rightContent}
            </div>
          </div>
        );
      
      default:
        return <div>Неизвестный тип слайда</div>;
    }
  };

  return (
    <div 
      className={`${styles.slide} ${className}`}
      data-slide-type={slide.type}
      style={{
        backgroundColor: slide.theme.backgroundColor,
        color: slide.theme.textColor,
        fontFamily: slide.theme.fontFamily,
        fontSize: `${slide.theme.fontSize}px`
      }}
    >
      {renderContent()}
    </div>
  );
};