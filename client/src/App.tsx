import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { NotificationContainer } from './components/Notification/NotificationContainer';
import { ThemeInitializer } from './components/ThemeInitializer/ThemeInitializer';
import { AppProvider } from './contexts/AppContext';
import './index.css';
import { LayoutProvider } from './layouts/LayoutContext';
// Layouts
import { HomeLayout } from './layouts/HomeLayout/HomeLayout';

// Pages
import { PresentationManager } from './components/PresentationManager/PresentationManager';
import { Home } from './pages/Home/Home';
import { PresentationsList } from './pages/PresentationsList/PresentationsList';
import { Settings } from './pages/Settings/Settings';

// TODO: Временные компоненты для других лейаутов (будут реализованы в следующих уроках)
const GalleryLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <h1>Gallery Layout (Coming Soon)</h1>
    {children}
  </div>
);

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
              {/* Главная страница с новым лейаутом */}
              <Route path="/" element={
                <HomeLayout>
                  <Home />
                </HomeLayout>
              } />

              {/* Презентации - временно со старым лейаутом */}
              <Route path="/presentations" element={
                <PresentationsList />
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

              {/* Настройки - временно со старым лейаутом */}
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