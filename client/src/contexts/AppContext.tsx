import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { AppSettings as AppSettingsType, AppState, Notification, User } from '../types/context';

// 🎯 ТИПИЗИРОВАННЫЕ ДЕЙСТВИЯ - Discriminated Unions
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettingsType> }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// 🏁 НАЧАЛЬНОЕ СОСТОЯНИЕ
const getInitialState = (): AppState => {
  // Загружаем настройки из localStorage при инициализации
  if (typeof window !== 'undefined') {
    try {
      const savedSettings = localStorage.getItem('i-slides-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return {
          user: null,
          settings: {
            theme: settings.theme || 'light',
            language: settings.language || 'ru',
            notifications: settings.notifications !== undefined ? settings.notifications : true,
            autoSave: settings.autoSave !== undefined ? settings.autoSave : true,
          },
          notifications: [],
          isLoading: false,
        };
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }

  return {
    user: null,
    settings: {
      theme: 'light',
      language: 'ru',
      notifications: true,
      autoSave: true,
    },
    notifications: [],
    isLoading: false,
  };
};

// 🔄 РЕДЬЮСЕР - централизованная логика обновлений
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload };
      return {
        ...state,
        settings: newSettings,
      };
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        duration: action.payload.duration || 5000,
      };
      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

// 🎪 СОЗДАЕМ КОНТЕКСТ
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// 📦 ПРОВАЙДЕР
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  // 🌙 ПРИМЕНЕНИЕ ТЕМЫ К ДОКУМЕНТУ
  const applyTheme = useCallback((theme: string) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
    }
  }, []);

  // 💾 СОХРАНЕНИЕ НАСТРОЕК В LOCALSTORAGE ПРИ ИЗМЕНЕНИИ
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('i-slides-settings', JSON.stringify(state.settings));
    }
  }, [state.settings]);

  // 🌙 ПРИМЕНЯЕМ ТЕМУ ПРИ ИНИЦИАЛИЗАЦИИ И ИЗМЕНЕНИИ
  useEffect(() => {
    applyTheme(state.settings.theme);
  }, [state.settings.theme, applyTheme]);

  // 📥 ИНИЦИАЛИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      email: 'user@example.com',
      name: 'Тестовый Пользователь',
    };
    dispatch({ type: 'SET_USER', payload: mockUser });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 🎯 КАСТОМНЫЙ ХУК ДЛЯ ИСПОЛЬЗОВАНИЯ КОНТЕКСТА
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// 🛠️ СПЕЦИАЛИЗИРОВАННЫЕ ХУКИ
export const useSettings = () => {
  const { state, dispatch } = useApp();
  
  const updateSettings = useCallback((settings: Partial<AppSettingsType>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, [dispatch]);

  return {
    settings: state.settings,
    updateSettings,
  };
};

export const useNotifications = () => {
  const { state, dispatch } = useApp();
  
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, [dispatch]);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, [dispatch]);

  const clearAllNotifications = useCallback(() => {
    state.notifications.forEach(notification => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
    });
  }, [state.notifications, dispatch]);

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};

export const useUser = () => {
  const { state, dispatch } = useApp();
  
  const setUser = useCallback((user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, [dispatch]);

  return {
    user: state.user,
    setUser,
  };
};