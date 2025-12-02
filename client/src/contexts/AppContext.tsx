import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';

// 🎯 ТИПЫ
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'ru' | 'en';
  notifications: boolean;
  autoSave: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface AppState {
  user: User | null;
  settings: AppSettings;
  notifications: Notification[];
  isLoading: boolean;
}

// 🎯 ТИПИЗИРОВАННЫЕ ДЕЙСТВИЯ
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// 🎯 НАЧАЛЬНОЕ СОСТОЯНИЕ
const initialState: AppState = {
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

const loadSettingsFromStorage = (): AppSettings => {
  if (typeof window === 'undefined') {
    return initialState.settings;
  }
  
  try {
    const savedSettings = localStorage.getItem('i-slides-settings');
    const savedTheme = localStorage.getItem('i-slides-theme');
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      console.log('📥 Loaded settings from storage:', parsed);
      
      // Объединяем с сохраненной темой, если есть
      const settings = { ...initialState.settings, ...parsed };
      
      // Если есть отдельно сохраненная тема, используем ее
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        settings.theme = savedTheme;
      }
      
      return settings;
    }
  } catch (error) {
    console.error('❌ Failed to load settings from storage:', error);
  }
  
  return initialState.settings;
};

// 🎯 ФУНКЦИЯ ДЛЯ ПРИМЕНЕНИЯ ТЕМЫ
const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
  const root = document.documentElement;
  let actualTheme = theme;
  
  if (theme === 'auto') {
    actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Сохраняем тему в localStorage
  localStorage.setItem('i-slides-theme', actualTheme);
  
  // Устанавливаем data-theme атрибут
  root.setAttribute('data-theme', actualTheme);
  
  // Также устанавливаем класс для body для дополнительной поддержки
  document.body.className = actualTheme;
  
  console.log('🎨 Applied theme:', { selected: theme, actual: actualTheme });
};

// 🎯 НАЧАЛЬНОЕ СОСТОЯНИЕ С ЗАГРУЗКОЙ ИЗ LOCALSTORAGE
const getInitialState = (): AppState => {
  const settings = loadSettingsFromStorage();
  
  // Применяем тему сразу при инициализации
  applyTheme(settings.theme);
  
  return {
    ...initialState,
    settings,
  };
};

// 🎯 РЕДЬЮСЕР
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
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

// 🎯 СОЗДАЕМ КОНТЕКСТ
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// 🎯 ОПТИМИЗИРОВАННЫЙ ПРОВАЙДЕР
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // 🎯 ИСПОЛЬЗУЕМ ФУНКЦИЮ ДЛЯ НАЧАЛЬНОГО СОСТОЯНИЯ
  const [state, dispatch] = useReducer(appReducer, getInitialState());
  
  // 🎯 REF ДЛЯ ХРАНЕНИЯ ТАЙМЕРОВ УВЕДОМЛЕНИЙ
  const notificationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 🎯 ОЧИСТКА ТАЙМЕРОВ ПРИ РАЗМОНТИРОВАНИИ
  useEffect(() => {
    return () => {
      notificationTimersRef.current.forEach(timer => clearTimeout(timer));
      notificationTimersRef.current.clear();
    };
  }, []);

  // 🎯 ПРИМЕНЕНИЕ ТЕМЫ ПРИ ИЗМЕНЕНИИ НАСТРОЕК
  useEffect(() => {
    applyTheme(state.settings.theme);
  }, [state.settings.theme]);

  // 🎯 СОХРАНЕНИЕ НАСТРОЕК В LOCALSTORAGE ПРИ ИЗМЕНЕНИИ
  useEffect(() => {
    try {
      localStorage.setItem('i-slides-settings', JSON.stringify(state.settings));
      console.log('💾 Saved settings to storage:', state.settings);
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
    }
  }, [state.settings]);

  // 🎯 АВТОМАТИЧЕСКОЕ УДАЛЕНИЕ УВЕДОМЛЕНИЙ
  useEffect(() => {
    state.notifications.forEach((notification: Notification) => {
      if (notification.duration && !notificationTimersRef.current.has(notification.id)) {
        const timer = setTimeout(() => {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
          notificationTimersRef.current.delete(notification.id);
        }, notification.duration);

        notificationTimersRef.current.set(notification.id, timer);
      }
    });

    const currentIds = new Set(state.notifications.map((n: Notification) => n.id));
    notificationTimersRef.current.forEach((timer, id) => {
      if (!currentIds.has(id)) {
        clearTimeout(timer);
        notificationTimersRef.current.delete(id);
      }
    });
  }, [state.notifications]);

  // 🎯 ИНИЦИАЛИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ (один раз при монтировании)
  useEffect(() => {
    const mockUser: User = {
      id: '1',
      email: 'user@example.com',
      name: 'Тестовый Пользователь',
    };
    dispatch({ type: 'SET_USER', payload: mockUser });
  }, []);

  // 🎯 СЛУШАТЕЛЬ СИСТЕМНОЙ ТЕМЫ ДЛЯ АВТО-РЕЖИМА
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (state.settings.theme === 'auto') {
        applyTheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [state.settings.theme]);

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
  
  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  return {
    settings: state.settings,
    updateSettings,
  };
};

export const useNotifications = () => {
  const { state, dispatch } = useApp();

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAllNotifications = () => {
    state.notifications.forEach((notification: Notification) => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
    });
  };

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};

export const useUser = () => {
  const { state, dispatch } = useApp();

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  return {
    user: state.user,
    setUser,
  };
};