import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './contexts/AppContext';
import './index.css';

// Применяем тему сразу после загрузки, до рендера React
const applyInitialTheme = () => {
  try {
    const savedSettings = localStorage.getItem('i-slides-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      document.documentElement.setAttribute('data-theme', settings.theme || 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (error) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

// Вызываем до создания root
applyInitialTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);