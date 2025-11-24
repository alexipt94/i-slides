import { Outlet } from 'react-router-dom';
import { AppHeader } from '../AppHeader/AppHeader';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { Navigation } from '../Navigation/Navigation';
import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <div className={styles.layout}>
      {/* ХЕДЕР ТОЛЬКО ЗДЕСЬ */}
      <AppHeader />
      <div className={styles.container}>
        <Navigation />
        <main className={styles.main}>
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};