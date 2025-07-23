import React from 'react';

const Calendar = ({ 
  currentDate, 
  schedules, 
  onDateClick, 
  onPrevMonth, 
  onNextMonth, 
  onScheduleClick 
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  
  const getSchedulesForDate = (date) => {
    const dateString = date.toDateString();
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === dateString;
    });
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(
        <div key={`prev-${date.getDate()}`} className="calendar-day other-month">
          <span className="day-number">{date.getDate()}</span>
        </div>
      );
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day, 12, 0, 0); // 正午を指定してタイムゾーン問題を回避
      const daySchedules = getSchedulesForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday(date) ? 'today' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <span className="day-number">{day}</span>
          <div className="schedule-dots">
            {daySchedules.slice(0, 3).map((schedule, index) => (
              <div
                key={schedule.id}
                className={`schedule-item schedule-color-${schedule.color || 'blue'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduleClick(schedule);
                }}
                title={schedule.title}
              >
                <span className="schedule-time">
                  {new Date(schedule.date).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="schedule-title">{schedule.title}</span>
              </div>
            ))}
            {daySchedules.length > 3 && (
              <div className="more-schedules">
                +{daySchedules.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Next month's leading days
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push(
        <div key={`next-${day}`} className="calendar-day other-month">
          <span className="day-number">{day}</span>
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={onPrevMonth} className="nav-button">
          &#8249;
        </button>
        <h2 className="calendar-title">
          {year}年 {monthNames[month]}
        </h2>
        <button onClick={onNextMonth} className="nav-button">
          &#8250;
        </button>
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;