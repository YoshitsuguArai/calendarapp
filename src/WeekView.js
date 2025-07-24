import React from 'react';
import { isToday, getWeekStart, formatWeekRange } from './utils/dateUtils';
import { getSchedulesForDate, getSchedulePosition } from './utils/scheduleUtils';

const WeekView = ({ 
  currentDate, 
  schedules, 
  onDateClick, 
  onScheduleClick,
  onPrevWeek,
  onNextWeek,
  weekStartsOn = 0
}) => {
  const baseWeekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekDays = [...baseWeekDays.slice(weekStartsOn), ...baseWeekDays.slice(0, weekStartsOn)];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  
  const weekStart = getWeekStart(currentDate, weekStartsOn);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });
  
  
  
  
  
  return (
    <div className="week-view">
      <div className="week-header">
        <button onClick={onPrevWeek} className="nav-button">
          &#8249;
        </button>
        <h2 className="week-title">{formatWeekRange(weekStart)}</h2>
        <button onClick={onNextWeek} className="nav-button">
          &#8250;
        </button>
      </div>
      
      <div className="week-grid">
        {/* 時間軸ヘッダー */}
        <div className="time-header"></div>
        {weekDates.map((date, index) => (
          <div key={index} className={`day-header ${isToday(date) ? 'today' : ''}`}>
            <div className="day-name">{weekDays[index]}</div>
            <div className="day-number">{date.getDate()}</div>
          </div>
        ))}
        
        {/* タイムスロット */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="time-slot">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {weekDates.map((date, dayIndex) => {
              const daySchedules = getSchedulesForDate(schedules, date);
              
              return (
                <div 
                  key={`${hour}-${dayIndex}`}
                  className="hour-slot"
                  onClick={() => {
                    const clickDate = new Date(date);
                    clickDate.setHours(hour, 0, 0, 0);
                    onDateClick(clickDate);
                  }}
                >
                  {/* 終日予定（0時のスロットでのみ表示） */}
                  {hour === 0 && daySchedules
                    .filter(schedule => schedule.isAllDay)
                    .slice(0, 2)
                    .map(schedule => {
                      const scheduleStart = new Date(schedule.date);
                      const currentDate = new Date(date);
                      scheduleStart.setHours(0, 0, 0, 0);
                      currentDate.setHours(0, 0, 0, 0);
                      
                      // 複数日予定の場合、表示テキストを調整
                      let displayText = schedule.title;
                      if (schedule.isMultiDay) {
                        if (currentDate.getTime() === scheduleStart.getTime()) {
                          displayText = `${schedule.title} (開始)`;
                        } else {
                          displayText = `${schedule.title} (継続)`;
                        }
                      }
                      
                      return (
                        <div
                          key={schedule.id}
                          className={`schedule-block all-day schedule-color-${schedule.color || 'blue'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onScheduleClick(schedule);
                          }}
                          title={schedule.title}
                        >
                          <span className="schedule-title">{displayText}</span>
                        </div>
                      );
                    })}
                  
                  {/* 時間指定予定（開始時間のスロットでのみ表示） */}
                  {daySchedules
                    .filter(schedule => {
                      if (schedule.isAllDay) return false;
                      
                      const scheduleStart = new Date(schedule.date);
                      const currentDate = new Date(date);
                      currentDate.setHours(0, 0, 0, 0);
                      
                      // 予定の開始日と現在の日付が同じ場合のみ表示
                      const startDate = new Date(scheduleStart);
                      startDate.setHours(0, 0, 0, 0);
                      
                      if (startDate.getTime() !== currentDate.getTime()) {
                        return false;
                      }
                      
                      const scheduleHour = scheduleStart.getHours();
                      
                      // この時間スロットが予定の開始時間と一致する場合のみ表示
                      return scheduleHour === hour;
                    })
                    .map(schedule => {
                      const position = getSchedulePosition(schedule, date);
                      return (
                        <div
                          key={schedule.id}
                          className={`schedule-block timed schedule-color-${schedule.color || 'blue'}`}
                          style={{
                            position: 'absolute',
                            top: `${position.top}px`,
                            height: `${position.height}px`,
                            left: '2px',
                            right: '2px',
                            zIndex: 2
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onScheduleClick(schedule);
                          }}
                          title={schedule.title}
                        >
                          <div className="schedule-time">
                            {new Date(schedule.date).toLocaleTimeString('ja-JP', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="schedule-title">{schedule.title}</div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeekView;