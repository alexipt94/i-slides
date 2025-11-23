import { useEffect, useState } from 'react';
import { PresentationButton } from '../../components/PresentationButton/PresentationButton';
import { useNotifications, useSettings, useUser } from '../../contexts/AppContext';
import styles from './Settings.module.css';

export const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { user, setUser } = useUser();
  const { addNotification } = useNotifications();
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isDirty, setIsDirty] = useState(false);

  // Следим за изменениями для определения "грязного" состояния
  useEffect(() => {
    const settingsChanged = JSON.stringify(localSettings) !== JSON.stringify(settings);
    const userChanged = userData.name !== user?.name || userData.email !== user?.email;
    setIsDirty(settingsChanged || userChanged);
  }, [localSettings, settings, userData, user]);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleUserDataChange = (key: keyof typeof userData, value: string) => {
    setUserData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
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
  };

  const handleResetSettings = () => {
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
  };

  const handleExportData = () => {
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
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // Сброс input для возможности повторной загрузки того же файла
    event.target.value = '';
  };

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <h1>Настройки</h1>
        <p>Управление настройками вашего аккаунта и приложения</p>
      </div>

      <div className={styles.sections}>
        {/* Секция профиля */}
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

        {/* Секция внешнего вида */}
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

        {/* Секция уведомлений */}
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

        {/* Секция данных */}
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

        {/* Кнопки действий */}
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

        {/* Секция информации */}
        <section className={styles.infoSection}>
          <h2>ℹ️ Информация о приложении</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <strong>Версия:</strong>
              <span>1.0.7</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Последнее обновление:</strong>
              <span>{new Date().toLocaleDateString('ru-RU')}</span>
            </div>
            <div className={styles.infoItem}>
              <strong>Количество презентаций:</strong>
              <span>—</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};