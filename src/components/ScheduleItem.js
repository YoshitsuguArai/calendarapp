import React from 'react';

const ScheduleItem = ({ 
  schedule, 
  onClick, 
  className = '', 
  style = {},
  showTime = true,
  timeDisplay,
  displayText 
}) => {
  return (
    <div
      className={`schedule-item ${className}`}
      style={style}
      onClick={onClick}
      title={schedule.title}
    >
      {showTime && timeDisplay && (
        <span className="schedule-time">{timeDisplay}</span>
      )}
      <span className="schedule-title">{displayText || schedule.title}</span>
    </div>
  );
};

export default ScheduleItem;