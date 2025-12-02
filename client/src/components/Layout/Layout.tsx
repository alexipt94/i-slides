import { Outlet } from 'react-router-dom';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { Header } from '../Header/Header';
import { Navigation } from '../Navigation/Navigation';
import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <div className={styles.layout}>
      {/* ХЕДЕР ТОЛЬКО ЗДЕСЬ */}  
      < Header />
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