import { ReactNode, createContext, useContext, useEffect, useReducer } from 'react';
import { AppSettings, AppState, Notification, User } from '../types/context';

// Типы действий
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_INITIAL_SETTINGS'; payload: AppSettings };

// Функция для получения начальных настроек из localStorage
const getInitialSettings = (): AppSettings => {
  if (typeof window === 'undefined') {
    return {
      theme: 'light',
      language: 'ru',
      notifications: true,
      autoSave: true,
    };
  }

  try {
    const savedSettings = localStorage.getItem('i-slides-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      return {
        theme: 'light',
        language: 'ru',
        notifications: true,
        autoSave: true,
        ...parsedSettings, // Перезаписываем дефолтные значения сохраненными
      };
    }
  } catch (error) {
    console.error('Failed to parse saved settings:', error);
  }

  return {
    theme: 'light',
    language: 'ru',
    notifications: true,
    autoSave: true,
  };
};

// Начальное состояние
const initialState: AppState = {
  user: null,
  settings: getInitialSettings(), // Используем функцию для получения настроек
  notifications: [],
  isLoading: false,
};

// Создаем контекст
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Редуктор
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

    case 'SET_INITIAL_SETTINGS':
      return {
        ...state,
        settings: action.payload,
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

// Провайдер
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Загружаем пользователя при загрузке (пока моковые данные)
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      email: 'user@example.com',
      name: 'Тестовый Пользователь',
    };
    dispatch({ type: 'SET_USER', payload: mockUser });
  }, []);

  // Сохраняем настройки в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('i-slides-settings', JSON.stringify(state.settings));
    
    // Применяем тему к документу
    document.documentElement.setAttribute('data-theme', state.settings.theme);
  }, [state.settings]);

  // Применяем тему при первоначальной загрузке
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}



// Хук для использования контекста
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Вспомогательные хуки
export function useSettings() {
  const { state, dispatch } = useApp();
  
  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  return {
    settings: state.settings,
    updateSettings,
  };
}

export function useNotifications() {
  const { state, dispatch } = useApp();

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAllNotifications = () => {
    state.notifications.forEach(notification => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
    });
  };

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
}

export function useUser() {
  const { state, dispatch } = useApp();

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  return {
    user: state.user,
    setUser,
  };
}