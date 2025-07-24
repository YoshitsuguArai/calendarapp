import { useState, useEffect } from 'react';

const defaultSettings = {
  theme: 'light',
  defaultView: 'calendar',
  notificationTime: 15,
  dateFormat: 'YYYY/MM/DD',
  weekStartsOn: 0, // 0: Sunday, 1: Monday
  showWeekNumbers: false,
  language: 'ja'
};

export const useSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('calendarSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Failed to parse settings:', error);
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('calendarSettings', JSON.stringify(newSettings));
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('calendarSettings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('calendarSettings');
  };

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings
  };
};