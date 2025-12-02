import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useLayout } from '../../layouts/LayoutContext';
import { IconButton } from '../IconButton/IconButton';
import { Logo } from '../Logo/Logo';
import { Navigation } from '../Navigation/Navigation';
import styles from './Header.module.css';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleLeftPanel, toggleRightPanel, currentLayout } = useLayout();
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Определяем, какие элементы показывать в зависимости от лейаута
  const showLeftPanelToggle = ['editor', 'gallery'].includes(currentLayout);
  const showRightPanelToggle = ['editor'].includes(currentLayout);
  const showNavigation = ['home', 'gallery', 'settings'].includes(currentLayout);
  const showSearch = ['gallery', 'presentations'].includes(currentLayout);

  const toggleTheme = () => {
    const currentTheme = state.settings.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { theme: newTheme } 
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Реализовать поиск в следующих уроках
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {showLeftPanelToggle ? (
          <IconButton
            icon="menu"
            onClick={toggleLeftPanel}
            ariaLabel="Открыть боковую панель"
            className={styles.panelToggle}
          />
        ) : (
          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logoLink}>
              <Logo size="small" />
            </Link>
          </div>
        )}
      </div>

      <div className={styles.centerSection}>
        {showNavigation && <Navigation />}
        {currentLayout === 'editor' && (
          <div className={styles.editorInfo}>
            <span className={styles.editorTitle}>Редактор презентации</span>
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        {/* Поиск (показывается в галерее и списке презентаций) */}
        {showSearch && (
          <div className={styles.searchContainer}>
            {isSearchActive ? (
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Поиск презентаций..."
                  className={styles.searchInput}
                  autoFocus
                />
                <IconButton
                  icon="search"
                  onClick={handleSearch}
                  ariaLabel="Начать поиск"
                  className={styles.searchButton}
                />
                <IconButton
                  icon="close"
                  onClick={() => {
                    setIsSearchActive(false);
                    setSearchQuery('');
                  }}
                  ariaLabel="Закрыть поиск"
                  className={styles.closeSearchButton}
                />
              </div>
            ) : (
              <IconButton
                icon="search"
                onClick={() => setIsSearchActive(true)}
                ariaLabel="Открыть поиск"
                className={styles.searchToggle}
              />
            )}
          </div>
        )}

        {/* Кнопка смены темы */}
        <IconButton
          icon={state.settings.theme === 'dark' ? '☀️' : '🌙'}
          onClick={toggleTheme}
          ariaLabel={`Сменить тему на ${state.settings.theme === 'dark' ? 'светлую' : 'темную'}`}
          className={styles.themeToggle}
        />

        {showRightPanelToggle ? (
          <IconButton
            icon="settings"
            onClick={toggleRightPanel}
            ariaLabel="Открыть панель настроек"
            className={styles.panelToggle}
          />
        ) : (
          <div className={styles.userControls}>
            <IconButton
              icon="user"
              onClick={() => console.log('User menu')}
              ariaLabel="Профиль пользователя"
            />
            <IconButton
              icon="settings"
              onClick={() => navigate('/settings')}
              ariaLabel="Настройки"
            />
          </div>
        )}
      </div>
    </header>
  );
};