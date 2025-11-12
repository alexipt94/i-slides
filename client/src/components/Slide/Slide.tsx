import { SlideProps } from '../../types';
import styles from './Slide.module.css';

export const Slide = ({ title, content }: SlideProps) => {
  return (
    <div className={styles.slide}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.content}>{content}</p>
    </div>
  );
};