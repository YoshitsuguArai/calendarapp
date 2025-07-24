export const getSchedulesForDate = (schedules, date) => {
  return schedules.filter(schedule => {
    const scheduleStartDate = new Date(schedule.date);
    const scheduleEndDate = new Date(schedule.endDate);
    
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    scheduleStartDate.setHours(0, 0, 0, 0);
    scheduleEndDate.setHours(0, 0, 0, 0);
    
    return currentDate >= scheduleStartDate && currentDate <= scheduleEndDate;
  });
};

export const getScheduleDisplayInfo = (schedule, date) => {
  const scheduleStartDate = new Date(schedule.date);
  const scheduleEndDate = new Date(schedule.endDate);
  const currentDate = new Date(date);
  
  let scheduleClass = `schedule-item schedule-color-${schedule.color || 'blue'}`;
  let timeDisplay = '';
  let displayText = schedule.title;
  
  if (schedule.isMultiDay) {
    if (currentDate.toDateString() === scheduleStartDate.toDateString()) {
      scheduleClass += ' multi-day-start';
      timeDisplay = schedule.isAllDay ? '終日' : scheduleStartDate.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      });
      displayText = `${schedule.title} (開始)`;
    } else if (currentDate.toDateString() === scheduleEndDate.toDateString()) {
      scheduleClass += ' multi-day-end';
      timeDisplay = schedule.isAllDay ? '終日' : '〜' + scheduleEndDate.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      scheduleClass += ' multi-day-middle';
      timeDisplay = '終日';
      displayText = `${schedule.title} (継続)`;
    }
  } else {
    timeDisplay = schedule.isAllDay ? '終日' : scheduleStartDate.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return { scheduleClass, timeDisplay, displayText };
};

export const getSchedulePosition = (schedule, date) => {
  const scheduleStart = new Date(schedule.date);
  const scheduleEnd = new Date(schedule.endDate);
  
  if (schedule.isAllDay) {
    return { top: 0, height: 100 };
  }
  
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  
  const startMinutes = (scheduleStart - dayStart) / (1000 * 60);
  const duration = (scheduleEnd - scheduleStart) / (1000 * 60);
  
  const top = (startMinutes / 60) * 50;
  const height = Math.max((duration / 60) * 50, 20);
  
  return { top, height };
};