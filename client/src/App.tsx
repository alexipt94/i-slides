import { lazy, Suspense } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import './App.module.css';
import { Layout } from './components/Layout/Layout';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { NotificationContainer } from './components/Notification/NotificationContainer';
import { PresentationManager } from './components/PresentationManager/PresentationManager';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AppProvider } from './contexts/AppContext';

// Ленивая загрузка существующих страниц
const Home = lazy(() => import('./pages/Home/Home').then(module => ({ default: module.Home })));
const PresentationsList = lazy(() => import('./pages/PresentationsList/PresentationsList').then(module => ({ default: module.PresentationsList })));
const Settings = lazy(() => import('./pages/Settings/Settings').then(module => ({ default: module.Settings })));

// Временные заглушки для отсутствующих страниц
const NotFound = lazy(() => Promise.resolve({ 
  default: () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>404 - Страница не найдена</h1>
      <p>Запрашиваемая страница не существует</p>
    </div>
  )
}));

// Компоненты для редактирования и просмотра презентаций
const PresentationEdit = () => <PresentationManager mode="edit" />;
const PresentationView = () => <PresentationManager mode="view" />;

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <NotificationContainer />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Публичные маршруты */}
                <Route index element={<Home />} />
                
                {/* Защищенные маршруты */}
                <Route path="/presentations" element={
                  <ProtectedRoute>
                    <PresentationsList />
                  </ProtectedRoute>
                } />
                
                <Route path="/create" element={
                  <ProtectedRoute>
                    <PresentationEdit />
                  </ProtectedRoute>
                } />
                
                <Route path="/presentations/:id/edit" element={
                  <ProtectedRoute>
                    <PresentationEdit />
                  </ProtectedRoute>
                } />
                
                <Route path="/presentations/:id/view" element={
                  <ProtectedRoute>
                    <PresentationView />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                {/* Маршрут для ненайденных страниц */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;