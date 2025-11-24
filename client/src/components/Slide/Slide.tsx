import { memo } from 'react';
import { SlideProps } from '../../types';
import styles from './Slide.module.css';

const SlideComponent = ({ title, content }: SlideProps) => {
  return (
    <div className={styles.slide}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.content}>{content}</p>
    </div>
  );
};

export const Slide = memo(SlideComponent);