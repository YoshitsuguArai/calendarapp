import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import WeekView from './WeekView';
import ScheduleModal from './ScheduleModal';
import useNotifications from './useNotifications';
import { useScheduleManager } from './hooks/useScheduleManager';
import { formatDate } from './utils/dateUtils';
import './App.css';

function App() {
  const { schedules, saveSchedule, deleteSchedule } = useScheduleManager();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [view, setView] = useState('calendar');
  const { 
    permission, 
    requestPermission, 
    startPeriodicCheck, 
    stopPeriodicCheck,
    showNotification
  } = useNotifications();


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
    showNotification('テスト通知', {
      body: 'これはテスト通知です。音も一緒に再生されます。',
      requireInteraction: false
    });
  };


  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>予定管理アプリ</h1>
          <div className="header-controls">
            <button onClick={handleToday} className="today-btn">今日</button>
            {permission !== 'granted' && (
              <button onClick={requestPermission} className="notification-btn">
                通知を有効にする
              </button>
            )}
            {permission === 'granted' && (
              <>
                <span className="notification-status">🔔 通知有効</span>
                <button onClick={handleTestNotification} className="test-notification-btn">
                  🔊 テスト
                </button>
              </>
            )}
            <div className="view-switcher">
              <button 
                className={view === 'calendar' ? 'active' : ''}
                onClick={() => setView('calendar')}
              >
                カレンダー
              </button>
              <button 
                className={view === 'week' ? 'active' : ''}
                onClick={() => setView('week')}
              >
                週間
              </button>
              <button 
                className={view === 'list' ? 'active' : ''}
                onClick={() => setView('list')}
              >
                リスト
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
          />
        ) : view === 'week' ? (
          <WeekView
            currentDate={currentDate}
            schedules={schedules}
            onDateClick={handleDateClick}
            onScheduleClick={handleScheduleClick}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
        ) : (
          <div className="schedule-list">
            <h2>予定一覧</h2>
            {schedules.length === 0 ? (
              <p className="no-schedules">予定がありません</p>
            ) : (
              <div className="schedules">
                {schedules
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map(schedule => (
                    <div key={schedule.id} className="schedule-item">
                      <div className="schedule-info">
                        <h3>{schedule.title}</h3>
                        <p className="schedule-date">{formatDate(schedule.date)}</p>
                        {schedule.description && (
                          <p className="schedule-description">{schedule.description}</p>
                        )}
                      </div>
                      <div className="schedule-actions">
                        <button 
                          onClick={() => handleScheduleClick(schedule)}
                          className="edit-btn"
                        >
                          編集
                        </button>
                        <button 
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="delete-btn"
                        >
                          削除
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
      />
    </div>
  );
}

export default App;