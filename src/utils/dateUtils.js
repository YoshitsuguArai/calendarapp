export const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const formatDate = (dateString, options = {}) => {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(dateString).toLocaleDateString('ja-JP', { ...defaultOptions, ...options });
};

export const formatTimeRange = (startDate, endDate) => {
  const startTime = startDate.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const endTime = endDate.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${startTime} - ${endTime}`;
};

export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const formatWeekRange = (weekStart) => {
  const endDate = new Date(weekStart);
  endDate.setDate(weekStart.getDate() + 6);
  
  const startMonth = weekStart.getMonth() + 1;
  const startDay = weekStart.getDate();
  const endMonth = endDate.getMonth() + 1;
  const endDay = endDate.getDate();
  
  if (startMonth === endMonth) {
    return `${weekStart.getFullYear()}年${startMonth}月${startDay}日 - ${endDay}日`;
  } else {
    return `${weekStart.getFullYear()}年${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
  }
};

export const isSameDate = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};