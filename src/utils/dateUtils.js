export const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const formatDate = (dateString, options = {}, dateFormat = 'YYYY/MM/DD') => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  let formattedDate = '';
  switch (dateFormat) {
    case 'MM/DD/YYYY':
      formattedDate = `${month}/${day}/${year}`;
      break;
    case 'DD/MM/YYYY':
      formattedDate = `${day}/${month}/${year}`;
      break;
    case 'YYYY/MM/DD':
    default:
      formattedDate = `${year}/${month}/${day}`;
      break;
  }
  
  if (options.includeTime !== false && (date.getHours() > 0 || date.getMinutes() > 0)) {
    formattedDate += ` ${hours}:${minutes}`;
  }
  
  return formattedDate;
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

export const getWeekStart = (date, weekStartsOn = 0) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - ((day - weekStartsOn + 7) % 7);
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

export const getWeekNumber = (date) => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
};