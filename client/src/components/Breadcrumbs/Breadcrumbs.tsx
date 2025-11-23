import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export const Breadcrumbs = () => {
  const location = useLocation();
  const { state } = useApp();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Функция для получения читаемого названия пути
  const getBreadcrumbLabel = (path: string): string => {
    const breadcrumbMap: Record<string, string> = {
      '': 'Главная',
      'presentations': 'Мои презентации',
      'create': 'Создание презентации',
      'edit': 'Редактирование',
      'view': 'Просмотр',
      'settings': 'Настройки',
    };

    // Для динамических ID, пытаемся получить название презентации
    if (path.match(/^[a-zA-Z0-9_-]+$/) && !breadcrumbMap[path]) {
      if (state.user) {
        // Здесь можно добавить логику для получения названия презентации по ID
        return 'Презентация';
      }
      return 'Элемент';
    }

    return breadcrumbMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Главная', path: '/' },
  ];

  // Строим хлебные крошки на основе текущего пути
  let currentPath = '';
  pathnames.forEach((path) => {
    currentPath += `/${path}`;
    
    // Пропускаем дублирование для edit/view
    if (path === 'edit' || path === 'view') {
      return;
    }

    breadcrumbs.push({
      label: getBreadcrumbLabel(path),
      path: currentPath,
    });
  });

  // Для страниц редактирования/просмотра добавляем соответствующий суффикс
  if (location.pathname.includes('/edit')) {
    breadcrumbs[breadcrumbs.length - 1].label += ' - Редактирование';
  } else if (location.pathname.includes('/view')) {
    breadcrumbs[breadcrumbs.length - 1].label += ' - Просмотр';
  }

  // Не показываем хлебные крошки на главной странице
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      <ol className={styles.list}>
        {breadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.path} className={styles.item}>
            {breadcrumbs[breadcrumbs.length - 1].path === breadcrumb.path ? (
              <span className={styles.current} aria-current="page">
                {breadcrumb.label}
              </span>
            ) : (
              <>
                <Link to={breadcrumb.path} className={styles.link}>
                  {breadcrumb.label}
                </Link>
                <span className={styles.separator}>/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};