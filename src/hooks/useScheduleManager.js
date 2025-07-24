import { useState, useEffect } from 'react';

export const useScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSchedules = localStorage.getItem('schedules');
      console.log('Loading schedules from localStorage:', savedSchedules);
      if (savedSchedules) {
        const parsedSchedules = JSON.parse(savedSchedules);
        console.log('Parsed schedules:', parsedSchedules);
        setSchedules(parsedSchedules);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading schedules from localStorage:', error);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return; // 初回読み込み完了まで保存しない
    
    try {
      console.log('Saving schedules to localStorage:', schedules);
      localStorage.setItem('schedules', JSON.stringify(schedules));
    } catch (error) {
      console.error('Error saving schedules to localStorage:', error);
    }
  }, [schedules, isLoaded]);

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