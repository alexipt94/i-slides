import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styles from './App.module.css';
import { Layout } from './components/Layout/Layout';
import { NotificationContainer } from './components/Notification/NotificationContainer';
import { PresentationManager } from './components/PresentationManager/PresentationManager';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { ThemeInitializer } from './components/ThemeInitializer/ThemeInitializer';
import { AppProvider } from './contexts/AppContext';
import { Home } from './pages/Home/Home';
import { PresentationsList } from './pages/PresentationsList/PresentationsList';
import { Settings } from './pages/Settings/Settings';

const NotFound = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>404 - Страница не найдена</h1>
    <p>Запрашиваемая страница не существует</p>
  </div>
);

const App = () => {
  return (
    <AppProvider>
      {/* Инициализатор темы должен быть внутри AppProvider */}
      <ThemeInitializer />
      <Router>
        <div className={styles.app}>
          <NotificationContainer />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route 
                path="/presentations" 
                element={
                  <ProtectedRoute>
                    <PresentationsList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <PresentationManager mode="edit" />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/presentations/:id/edit" 
                element={
                  <ProtectedRoute>
                    <PresentationManager mode="edit" />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/presentations/:id/view" 
                element={
                  <ProtectedRoute>
                    <PresentationManager mode="view" />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;