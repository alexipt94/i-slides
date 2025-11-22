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