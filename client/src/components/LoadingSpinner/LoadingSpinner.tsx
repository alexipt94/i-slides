import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p>Загрузка...</p>
    </div>
  );
};