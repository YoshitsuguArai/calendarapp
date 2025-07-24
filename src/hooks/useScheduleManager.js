import { useState, useEffect } from 'react';

export const useScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);

  const addSchedule = (scheduleData) => {
    setSchedules(prev => [...prev, scheduleData]);
  };

  const updateSchedule = (scheduleId, scheduleData) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId ? scheduleData : schedule
    ));
  };

  const deleteSchedule = (scheduleId) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
  };

  const saveSchedule = (scheduleData) => {
    const existingSchedule = schedules.find(s => s.id === scheduleData.id);
    if (existingSchedule) {
      updateSchedule(scheduleData.id, scheduleData);
    } else {
      addSchedule(scheduleData);
    }
  };

  return {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    saveSchedule
  };
};