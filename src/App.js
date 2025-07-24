import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import WeekView from './WeekView';
import ScheduleModal from './ScheduleModal';
import Settings from './Settings';
import useNotifications from './useNotifications';
import { useScheduleManager } from './hooks/useScheduleManager';
import { useSettings } from './hooks/useSettings';
import { formatDate } from './utils/dateUtils';
import { useTranslation } from './utils/translations';
import './App.css';

function App() {
  const { schedules, saveSchedule, deleteSchedule } = useScheduleManager();
  const { settings, updateSetting } = useSettings();
  const { t } = useTranslation(settings.language);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [view, setView] = useState(settings.defaultView);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { 
    permission, 
    requestPermission, 
    startPeriodicCheck, 
    stopPeriodicCheck,
    showNotification
  } = useNotifications();


  // 設定変更時にviewを更新
  useEffect(() => {
    setView(settings.defaultView);
  }, [settings.defaultView]);

  // テーマ適用
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // 通知許可と定期チェックの初期化
  useEffect(() => {
    const initializeNotifications = async () => {
      if (permission === 'default') {
        await requestPermission();
      }
      
      if (schedules.length > 0) {
        startPeriodicCheck(schedules);
      }
    };

    initializeNotifications();

    return () => {
      stopPeriodicCheck();
    };
  }, [schedules, permission, requestPermission, startPeriodicCheck, stopPeriodicCheck]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleScheduleClick = (schedule) => {
    setEditingSchedule(schedule);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleSaveSchedule = (scheduleData) => {
    saveSchedule(scheduleData);
  };

  const handleDeleteSchedule = (id) => {
    deleteSchedule(id);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleTestNotification = () => {
    showNotification(t('notification.testTitle'), {
      body: t('notification.testBody'),
      requireInteraction: false
    });
  };


  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>{t('header.title')}</h1>
          <div className="header-controls">
            <button onClick={handleToday} className="today-btn">{t('header.today')}</button>
            {permission !== 'granted' && (
              <button onClick={requestPermission} className="notification-btn">
                {t('header.enableNotifications')}
              </button>
            )}
            {permission === 'granted' && (
              <span className="notification-status">{t('header.notificationEnabled')}</span>
            )}
            <button onClick={() => setIsSettingsOpen(true)} className="settings-btn">
              {t('header.settings')}
            </button>
            <div className="view-switcher">
              <button 
                className={view === 'calendar' ? 'active' : ''}
                onClick={() => setView('calendar')}
              >
                {t('view.calendar')}
              </button>
              <button 
                className={view === 'week' ? 'active' : ''}
                onClick={() => setView('week')}
              >
                {t('view.week')}
              </button>
              <button 
                className={view === 'list' ? 'active' : ''}
                onClick={() => setView('list')}
              >
                {t('view.list')}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        {view === 'calendar' ? (
          <Calendar
            currentDate={currentDate}
            schedules={schedules}
            onDateClick={handleDateClick}
            onScheduleClick={handleScheduleClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            weekStartsOn={settings.weekStartsOn}
            showWeekNumbers={settings.showWeekNumbers}
            language={settings.language}
          />
        ) : view === 'week' ? (
          <WeekView
            currentDate={currentDate}
            schedules={schedules}
            onDateClick={handleDateClick}
            onScheduleClick={handleScheduleClick}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            weekStartsOn={settings.weekStartsOn}
            language={settings.language}
          />
        ) : (
          <div className="schedule-list">
            <h2>{t('scheduleList.title')}</h2>
            {schedules.length === 0 ? (
              <p className="no-schedules">{t('scheduleList.noSchedules')}</p>
            ) : (
              <div className="schedules">
                {schedules
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map(schedule => (
                    <div key={schedule.id} className="schedule-item">
                      <div className="schedule-info">
                        <h3>{schedule.title}</h3>
                        <p className="schedule-date">{formatDate(schedule.date, {}, settings.dateFormat)}</p>
                        {schedule.description && (
                          <p className="schedule-description">{schedule.description}</p>
                        )}
                      </div>
                      <div className="schedule-actions">
                        <button 
                          onClick={() => handleScheduleClick(schedule)}
                          className="edit-btn"
                        >
                          {t('scheduleList.edit')}
                        </button>
                        <button 
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="delete-btn"
                        >
                          {t('scheduleList.delete')}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        onDelete={handleDeleteSchedule}
        schedule={editingSchedule}
        selectedDate={selectedDate}
        defaultNotificationTime={settings.notificationTime}
        language={settings.language}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingChange={updateSetting}
        onTestNotification={handleTestNotification}
        notificationPermission={permission}
        language={settings.language}
      />
    </div>
  );
}

export default App;