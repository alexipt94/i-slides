import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { NotificationContainer } from './components/Notification/NotificationContainer';
import { ThemeInitializer } from './components/ThemeInitializer/ThemeInitializer';
import { AppProvider } from './contexts/AppContext';
import { LayoutProvider } from './layouts/LayoutContext';

// Layouts
import { GalleryLayout } from './layouts/GalleryLayout/GalleryLayout';
import { HomeLayout } from './layouts/HomeLayout/HomeLayout';

// Pages
import { PresentationManager } from './components/PresentationManager/PresentationManager';
import { Home } from './pages/Home/Home';
import { PresentationsList } from './pages/PresentationsList/PresentationsList';
import { Settings } from './pages/Settings/Settings';

// Глобальные стили
import './index.css';

// TODO: Временные компоненты для других лейаутов
const EditorLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <h1>Editor Layout (Coming Soon)</h1>
    {children}
  </div>
);

const NotFound = () => (
  <div style={{ padding: '20px', textAlign: 'center', marginTop: '100px' }}>
    <h1>404 - Страница не найдена</h1>
    <p>Запрашиваемая страница не существует</p>
  </div>
);

const App = () => {
  return (
    <AppProvider>
      <LayoutProvider>
        <ThemeInitializer />
        <Router>
          <div>
            <NotificationContainer />
            <Routes>
              {/* Главная страница */}
              <Route path="/" element={
                <HomeLayout>
                  <Home />
                </HomeLayout>
              } />

              {/* Галерея презентаций с новым лейаутом */}
              <Route path="/presentations" element={
                <GalleryLayout>
                  <PresentationsList />
                </GalleryLayout>
              } />

              <Route path="/templates" element={
                <GalleryLayout>
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Шаблоны презентаций</h2>
                    <p>Скоро здесь появятся готовые шаблоны</p>
                  </div>
                </GalleryLayout>
              } />

              <Route path="/create" element={
                <EditorLayout>
                  <PresentationManager mode="edit" />
                </EditorLayout>
              } />

              <Route path="/presentations/:id/edit" element={
                <EditorLayout>
                  <PresentationManager mode="edit" />
                </EditorLayout>
              } />

              <Route path="/presentations/:id/view" element={
                <EditorLayout>
                  <PresentationManager mode="view" />
                </EditorLayout>
              } />

              {/* Настройки */}
              <Route path="/settings" element={
                <Settings />
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </LayoutProvider>
    </AppProvider>
  );
};

export default App;