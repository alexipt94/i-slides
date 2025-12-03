import styles from './Breadcrumbs.module.css';

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (id: string | null) => void;
  currentItem?: string;
}

export const Breadcrumbs = ({ items, onNavigate, currentItem }: BreadcrumbsProps) => {
  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <li key={`${item.id}-${index}`} className={styles.breadcrumbItem}>
            {index === items.length - 1 ? (
              <span 
                className={`${styles.breadcrumbLink} ${styles.current}`}
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <>
                <button
                  className={styles.breadcrumbLink}
                  onClick={() => onNavigate(item.id)}
                  title={`Перейти в "${item.name}"`}
                >
                  {item.name}
                </button>
                <span className={styles.separator} aria-hidden="true">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
      
      {currentItem && (
        <div className={styles.currentInfo}>
          <span className={styles.currentLabel}>Текущая папка:</span>
          <strong className={styles.currentName}>{currentItem}</strong>
        </div>
      )}
    </nav>
  );
};