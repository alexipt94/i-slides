import { NavLink, useLocation } from 'react-router-dom';
import { useLayout } from '../../layouts/LayoutContext';
import styles from './Navigation.module.css';

const navigationItems = [
  { path: '/', label: 'Главная', icon: '🏠', layout: 'home' },
  { path: '/presentations', label: 'Презентации', icon: '📚', layout: 'gallery' },
  { path: '/templates', label: 'Шаблоны', icon: '🎨', layout: 'gallery' },
  { path: '/settings', label: 'Настройки', icon: '⚙️', layout: 'settings' },
];

export const Navigation = () => {
  const location = useLocation();
  const { setLayout } = useLayout();

  const handleNavigation = (layout: string) => {
    setLayout(layout as any);
  };

  return (
    <nav className={styles.navigation}>
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive || location.pathname === item.path ? styles.active : ''}`
          }
          onClick={() => handleNavigation(item.layout)}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};