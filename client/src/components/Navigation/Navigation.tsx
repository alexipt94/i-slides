import { NavLink } from 'react-router-dom';
import { useUser } from '../../contexts/AppContext';
import styles from './Navigation.module.css';

export const Navigation = () => {
  const { user } = useUser();

  return (
    <nav className={styles.navigation}>
      <div className={styles.userSection}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className={styles.userName}>{user.name}</span>
          </div>
        )}
      </div>

      <ul className={styles.navList}>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            end
          >
            🏠 Главная
          </NavLink>
        </li>
        
        <li>
          <NavLink 
            to="/presentations" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            📊 Мои презентации
          </NavLink>
        </li>
        
        <li>
          <NavLink 
            to="/create" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            ➕ Создать презентацию
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            ⚙️ Настройки
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};