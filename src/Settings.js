import React, { useState, useEffect } from 'react';
import { useTranslation } from './utils/translations';
import './Settings.css';

const Settings = ({ isOpen, onClose, settings, onSettingChange, onTestNotification, notificationPermission, language = 'ja' }) => {
  const { t } = useTranslation(language);
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    Object.keys(localSettings).forEach(key => {
      if (localSettings[key] !== settings[key]) {
        onSettingChange(key, localSettings[key]);
      }
    });
    setHasChanges(false);
    onClose();
  };

  const handleClose = () => {
    setLocalSettings(settings);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={handleClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>{t('settings.title')}</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="setting-group">
            <h3>{t('settings.displaySettings')}</h3>
            
            <div className="setting-item">
              <label>{t('settings.theme')}</label>
              <select 
                value={localSettings.theme} 
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="light">{t('settings.theme.light')}</option>
                <option value="dark">{t('settings.theme.dark')}</option>
              </select>
            </div>

            <div className="setting-item">
              <label>{t('settings.defaultView')}</label>
              <select 
                value={localSettings.defaultView} 
                onChange={(e) => handleSettingChange('defaultView', e.target.value)}
              >
                <option value="calendar">{t('settings.defaultView.calendar')}</option>
                <option value="week">{t('settings.defaultView.week')}</option>
                <option value="list">{t('settings.defaultView.list')}</option>
              </select>
            </div>

            <div className="setting-item">
              <label>{t('settings.weekStartsOn')}</label>
              <select 
                value={localSettings.weekStartsOn} 
                onChange={(e) => handleSettingChange('weekStartsOn', parseInt(e.target.value))}
              >
                <option value={0}>{t('settings.weekStartsOn.sunday')}</option>
                <option value={1}>{t('settings.weekStartsOn.monday')}</option>
              </select>
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.showWeekNumbers}
                  onChange={(e) => handleSettingChange('showWeekNumbers', e.target.checked)}
                />
                {t('settings.showWeekNumbers')}
              </label>
            </div>
          </div>

          <div className="setting-group">
            <h3>{t('settings.notificationSettings')}</h3>
            
            <div className="setting-item">
              <label>{t('settings.notificationTime')}</label>
              <select 
                value={localSettings.notificationTime} 
                onChange={(e) => handleSettingChange('notificationTime', parseInt(e.target.value))}
              >
                <option value={5}>{t('settings.notificationTime.5min')}</option>
                <option value={10}>{t('settings.notificationTime.10min')}</option>
                <option value={15}>{t('settings.notificationTime.15min')}</option>
                <option value={30}>{t('settings.notificationTime.30min')}</option>
                <option value={60}>{t('settings.notificationTime.1hour')}</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="notification-test-section">
                <div className="notification-status-display">
                  {notificationPermission === 'granted' ? (
                    <span className="notification-granted">{t('settings.notificationGranted')}</span>
                  ) : notificationPermission === 'denied' ? (
                    <span className="notification-denied">{t('settings.notificationDenied')}</span>
                  ) : (
                    <span className="notification-default">{t('settings.notificationDefault')}</span>
                  )}
                </div>
                {notificationPermission === 'granted' && (
                  <button className="test-notification-btn" type="button" onClick={onTestNotification}>
                    {t('settings.testNotification')}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="setting-group">
            <h3>{t('settings.otherSettings')}</h3>
            
            <div className="setting-item">
              <label>{t('settings.dateFormat')}</label>
              <select 
                value={localSettings.dateFormat} 
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              >
                <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              </select>
            </div>

            <div className="setting-item">
              <label>{t('settings.language')}</label>
              <select 
                value={localSettings.language} 
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option value="ja">{t('settings.language.ja')}</option>
                <option value="en">{t('settings.language.en')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="cancel-btn" onClick={handleClose}>
            {t('settings.cancel')}
          </button>
          <button 
            className={`save-btn ${hasChanges ? 'has-changes' : ''}`} 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            {hasChanges ? t('settings.save') : t('settings.noChanges')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;