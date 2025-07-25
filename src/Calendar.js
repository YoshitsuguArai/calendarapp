import React from 'react';
import { isToday, getWeekNumber } from './utils/dateUtils';
import { getSchedulesForDate, getScheduleDisplayInfo } from './utils/scheduleUtils';
import { useTranslation } from './utils/translations';
import ScheduleItem from './components/ScheduleItem';

const Calendar = ({ 
  currentDate, 
  schedules, 
  onDateClick, 
  onPrevMonth, 
  onNextMonth, 
  onScheduleClick,
  weekStartsOn = 0,
  showWeekNumbers = false,
  language = 'ja'
}) => {
  const { t } = useTranslation(language);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = (firstDayOfMonth.getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = t('calendar.months');
  const baseWeekDays = t('calendar.weekdays');
  const weekDays = [...baseWeekDays.slice(weekStartsOn), ...baseWeekDays.slice(0, weekStartsOn)];
  
  
  
  const renderCalendarDays = () => {
    const weeks = [];
    let currentWeek = [];
    
    // Previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      currentWeek.push(
        <div key={`prev-${date.getDate()}`} className="calendar-day other-month">
          <span className="day-number">{date.getDate()}</span>
        </div>
      );
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day, 12, 0, 0); // 正午を指定してタイムゾーン問題を回避
      const daySchedules = getSchedulesForDate(schedules, date);
      
      currentWeek.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday(date) ? 'today' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            console.log('Calendar date clicked:', date);
            onDateClick(date);
          }}
        >
          <span className="day-number">{day}</span>
          <div className="schedule-dots">
            {daySchedules.slice(0, 3).map((schedule, index) => {
              const { scheduleClass, timeDisplay, displayText } = getScheduleDisplayInfo(schedule, date);
              
              return (
                <ScheduleItem
                  key={schedule.id}
                  schedule={schedule}
                  className={scheduleClass}
                  timeDisplay={timeDisplay}
                  displayText={displayText}
                  onClick={(e) => {
                    e.stopPropagation();
                    onScheduleClick(schedule);
                  }}
                />
              );
            })}
            {daySchedules.length > 3 && (
              <div className="more-schedules">
                {t('calendar.moreSchedules')} {daySchedules.length - 3} {t('calendar.moreItems')}
              </div>
            )}
          </div>
        </div>
      );
      
      // When we have 7 days, create a week row
      if (currentWeek.length === 7) {
        const weekStartDate = new Date(year, month, day - (6 - firstDayOfWeek));
        const weekNumber = getWeekNumber(weekStartDate);
        weeks.push({
          weekNumber,
          days: [...currentWeek]
        });
        currentWeek = [];
      }
    }
    
    // Next month's leading days
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      currentWeek.push(
        <div key={`next-${day}`} className="calendar-day other-month">
          <span className="day-number">{day}</span>
        </div>
      );
    }
    
    // Add the last week if it has days
    if (currentWeek.length > 0) {
      const lastDayOfMonth = new Date(year, month, daysInMonth);
      const weekNumber = getWeekNumber(lastDayOfMonth);
      weeks.push({
        weekNumber,
        days: [...currentWeek]
      });
    }
    
    // Render weeks with week numbers
    if (showWeekNumbers) {
      return weeks.map((week, index) => (
        <React.Fragment key={`week-${index}`}>
          <div className="week-number-cell">
            <span className="week-number">{week.weekNumber}</span>
          </div>
          {week.days}
        </React.Fragment>
      ));
    } else {
      // Return flat array of days when not showing week numbers
      return weeks.flatMap(week => week.days);
    }
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
        <div className={`calendar-weekdays ${showWeekNumbers ? 'with-week-numbers' : ''}`}>
          {showWeekNumbers && <div className="weekday week-number-header">{t('calendar.weekNumber')}</div>}
          {weekDays.map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        
        <div className={`calendar-days ${showWeekNumbers ? 'with-week-numbers' : ''}`}>
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;