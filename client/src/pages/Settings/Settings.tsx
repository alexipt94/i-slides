import { memo, useCallback, useEffect, useState } from 'react';
import { PresentationButton } from '../../components/PresentationButton/PresentationButton';
import { useNotifications, useSettings, useUser } from '../../contexts/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Settings.module.css';

const SettingsComponent = () => {
  const { settings, updateSettings } = useSettings();
  const { user, setUser } = useUser();
  const { addNotification } = useNotifications();

  const [localSettings, setLocalSettings] = useState(settings);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // 🎯 ДЕБАУНС ДЛЯ АВТОСОХРАНЕНИЯ
  const debouncedSettings = useDebounce(localSettings, 1000);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const settingsChanged = JSON.stringify(localSettings) !== JSON.stringify(settings);
    const userChanged = userData.name !== user?.name || userData.email !== user?.email;
    setIsDirty(settingsChanged || userChanged);
  }, [localSettings, settings, userData, user]);

  // 🎯 АВТОСОХРАНЕНИЕ ПРИ ИЗМЕНЕНИИ НАСТРОЕК
  useEffect(() => {
    if (settings.autoSave && isDirty) {
      const settingsChanged = JSON.stringify(debouncedSettings) !== JSON.stringify(settings);
      if (settingsChanged) {
        updateSettings(debouncedSettings);
        addNotification({
          type: 'success',
          title: 'Настройки сохранены',
          message: 'Настройки автоматически сохранены'
        });
        setIsDirty(false);
      }
    }
  }, [debouncedSettings, settings.autoSave, isDirty, updateSettings, addNotification, settings]);

  const handleSettingChange = useCallback((key: keyof typeof settings, value: any) => {
    setLocalSettings((prev: typeof settings) => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  }, []);

  const handleUserDataChange = useCallback((key: keyof typeof userData, value: string) => {
    setUserData((prev: typeof userData) => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  }, []);

  const handleSaveSettings = useCallback(() => {
    updateSettings(localSettings);
    if (user) {
      setUser({
        ...user,
        name: userData.name,
        email: userData.email,
      });
    }
    addNotification({
      type: 'success',
      title: 'Настройки сохранены',
      message: 'Ваши настройки успешно обновлены'
    });
    setIsDirty(false);
  }, [localSettings, updateSettings, user, setUser, userData, addNotification]);

  const handleResetSettings = useCallback(() => {
    setLocalSettings(settings);
    setUserData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsDirty(false);
    addNotification({
      type: 'info',
      title: 'Настройки сброшены',
      message: 'Все изменения отменены'
    });
  }, [settings, user, addNotification]);

  const handleExportData = useCallback(() => {
    const data = {
      user: userData,
      settings: localSettings,
      exportDate: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `i-slides-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addNotification({
      type: 'success',
      title: 'Данные экспортированы',
      message: 'Резервная копия ваших данных успешно скачана'
    });
  }, [userData, localSettings, addNotification]);

  const handleImportData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setLocalSettings(data.settings);
        }
        if (data.user) {
          setUserData(data.user);
        }
        addNotification({
          type: 'success',
          title: 'Данные импортированы',
          message: 'Настройки успешно загружены из файла'
        });
        setIsDirty(true);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Ошибка импорта',
          message: 'Не удалось загрузить файл. Проверьте формат данных.'
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [addNotification]);

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <h1>Настройки</h1>
        <p>Управление настройками вашего аккаунта и приложения</p>
      </div>

      <div className={styles.sections}>
        {/* 👤 Профиль пользователя */}
        <section className={styles.section}>
          <h2>👤 Профиль пользователя</h2>
          <div className={styles.formGroup}>
            <label htmlFor="userName">Имя пользователя</label>
            <input
              id="userName"
              type="text"
              value={userData.name}
              onChange={(e) => handleUserDataChange('name', e.target.value)}
              className={styles.input}
              placeholder="Введите ваше имя"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="userEmail">Email</label>
            <input
              id="userEmail"
              type="email"
              value={userData.email}
              onChange={(e) => handleUserDataChange('email', e.target.value)}
              className={styles.input}
              placeholder="Введите ваш email"
            />
          </div>
        </section>

        {/* 🎨 Внешний вид */}
        <section className={styles.section}>
          <h2>🎨 Внешний вид</h2>
          <div className={styles.formGroup}>
            <label htmlFor="theme">Тема оформления</label>
            <select
              id="theme"
              value={localSettings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className={styles.select}
            >
              <option value="light">🌞 Светлая</option>
              <option value="dark">🌙 Темная</option>
              <option value="auto">⚙️ Авто (системная)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="language">Язык интерфейса</label>
            <select
              id="language"
              value={localSettings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className={styles.select}
            >
              <option value="ru">🇷🇺 Русский</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
        </section>

        {/* 🔔 Уведомления */}
        <section className={styles.section}>
          <h2>🔔 Уведомления</h2>
          <div className={styles.switchGroup}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={localSettings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className={styles.switchInput}
              />
              <span className={styles.slider}></span>
              <span className={styles.switchLabel}>Включить уведомления</span>
            </label>
          </div>
          <div className={styles.switchGroup}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={localSettings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                className={styles.switchInput}
              />
              <span className={styles.slider}></span>
              <span className={styles.switchLabel}>Автосохранение презентаций</span>
            </label>
            <small className={styles.helperText}>
              Автоматически сохранять изменения каждые 2 минуты
            </small>
          </div>
        </section>

        {/* 💾 Управление данными */}
        <section className={styles.section}>
          <h2>💾 Управление данными</h2>
          <div className={styles.dataActions}>
            <PresentationButton
              title="Экспорт данных"
              onClick={handleExportData}
              color="blue"
              size="medium"
            />
            <div className={styles.importGroup}>
              <label htmlFor="importData" className={styles.importLabel}>
                Импорт данных
              </label>
              <input
                id="importData"
                type="file"
                accept=".json"
                onChange={handleImportData}
                className={styles.fileInput}
              />
              <small className={styles.helperText}>
                Загрузите JSON файл с настройками
              </small>
            </div>
          </div>
        </section>

        {/* Действия */}
        <section className={styles.actions}>
          <PresentationButton
            title="Сбросить изменения"
            onClick={handleResetSettings}
            color="red"
            size="medium"
            disabled={!isDirty}
          />
          <PresentationButton
            title="Сохранить настройки"
            onClick={handleSaveSettings}
            color="green"
            size="large"
            disabled={!isDirty}
          />
        </section>

        {/* Информация о приложении */}
        <section className={styles.infoSection}>
          <h2>ℹ️ Информация о приложении</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <strong>Версия:</strong>
              <span>1.0.8</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Последнее обновление:</strong>
              <span>{new Date().toLocaleDateString('ru-RU')}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Режим:</strong>
              <span>{process.env.NODE_ENV === 'development' ? 'Разработка' : 'Продакшен'}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const Settings = memo(SettingsComponent);