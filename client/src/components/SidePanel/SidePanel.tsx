import { ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';
import styles from './SidePanel.module.css';

interface SidePanelProps {
  position: 'left' | 'right';
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number;
}

export const SidePanel = ({
  position,
  isOpen,
  onClose,
  title,
  children,
  width = 320
}: SidePanelProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className={`${styles.overlay} ${position === 'left' ? styles.leftOverlay : styles.rightOverlay}`}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`${styles.panel} ${styles[position]} ${isOpen ? styles.open : ''}`}
        style={{ width: `${width}px` }}
      >
        <div className={styles.panelHeader}>
          {title && <h3 className={styles.panelTitle}>{title}</h3>}
          <IconButton
            icon="close"
            onClick={onClose}
            ariaLabel="Закрыть панель"
            className={styles.closeButton}
          />
        </div>
        <div className={styles.panelContent}>
          {children}
        </div>
      </div>
    </>
  );
};