import React, { useState, useEffect } from 'react';

const ScheduleModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  schedule, 
  selectedDate,
  defaultNotificationTime = 15,
  language = 'ja'
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  const [isAllDay, setIsAllDay] = useState(false);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [reminders, setReminders] = useState([]);

  const colors = [
    { name: 'blue', label: 'ブルー', value: '#1976d2' },
    { name: 'green', label: 'グリーン', value: '#388e3c' },
    { name: 'red', label: 'レッド', value: '#d32f2f' },
    { name: 'purple', label: 'パープル', value: '#7b1fa2' },
    { name: 'orange', label: 'オレンジ', value: '#f57c00' },
    { name: 'pink', label: 'ピンク', value: '#c2185b' }
  ];

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title || '');
      const scheduleDate = new Date(schedule.date);
      
      // ローカル日付として正しく表示
      const year = scheduleDate.getFullYear();
      const month = String(scheduleDate.getMonth() + 1).padStart(2, '0');
      const day = String(scheduleDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      setDate(dateStr);
      
      const hours = String(scheduleDate.getHours()).padStart(2, '0');
      const minutes = String(scheduleDate.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
      
      if (schedule.endDate) {
        const endDateObj = new Date(schedule.endDate);
        const endYear = endDateObj.getFullYear();
        const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
        const endDay = String(endDateObj.getDate()).padStart(2, '0');
        const endDateStr = `${endYear}-${endMonth}-${endDay}`;
        setEndDate(endDateStr);
        
        const endHours = String(endDateObj.getHours()).padStart(2, '0');
        const endMinutes = String(endDateObj.getMinutes()).padStart(2, '0');
        setEndTime(`${endHours}:${endMinutes}`);
        
        // 複数日かどうかを判定
        setIsMultiDay(dateStr !== endDateStr);
      } else {
        setEndDate(dateStr);
        const endDateTime = new Date(scheduleDate.getTime() + 60 * 60 * 1000);
        const endHours = String(endDateTime.getHours()).padStart(2, '0');
        const endMinutes = String(endDateTime.getMinutes()).padStart(2, '0');
        setEndTime(`${endHours}:${endMinutes}`);
        setIsMultiDay(false);
      }
      
      setDescription(schedule.description || '');
      setColor(schedule.color || 'blue');
      setIsAllDay(schedule.isAllDay || false);
      
      // 複数リマインダーの設定を読み込み
      if (schedule.reminders && Array.isArray(schedule.reminders)) {
        setReminders(schedule.reminders);
      } else if (schedule.reminder?.enabled) {
        // 旧形式から新形式に変換
        setReminders([{
          id: Date.now(),
          minutes: schedule.reminder.minutes || 15,
          type: schedule.reminder.type || 'preset'
        }]);
      } else {
        setReminders([]);
      }
    } else if (selectedDate) {
      // ローカル日付として正しく表示するため、タイムゾーンオフセットを考慮
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      setDate(dateStr);
      setEndDate(dateStr);
      setTime('09:00');
      setEndTime('10:00');
      setTitle('');
      setDescription('');
      setColor('blue');
      setIsAllDay(false);
      setIsMultiDay(false);
      setReminders([]);
    }
  }, [schedule, selectedDate, isOpen]);

  // 重複するリマインダーをチェックする関数
  const isDuplicateReminder = (newMinutes, excludeId = null) => {
    return reminders.some(reminder => 
      reminder.id !== excludeId && reminder.minutes === newMinutes
    );
  };

  // リマインダー追加時の重複チェック
  const addReminder = () => {
    const newReminder = {
      id: Date.now(),
      minutes: 15,
      type: 'preset'
    };
    
    // デフォルト値が重複している場合は、重複しない値を探す
    const defaultOptions = [15, 30, 60, 120, 1440];
    let minutesToUse = newReminder.minutes;
    
    for (const option of defaultOptions) {
      if (!isDuplicateReminder(option)) {
        minutesToUse = option;
        break;
      }
    }
    
    newReminder.minutes = minutesToUse;
    setReminders([...reminders, newReminder]);
  };

  // リマインダー変更時の重複チェック
  const updateReminder = (reminderId, field, value) => {
    if (field === 'minutes' && isDuplicateReminder(value, reminderId)) {
      // 重複している場合は変更を無視
      return;
    }
    
    setReminders(reminders.map(r => 
      r.id === reminderId ? {...r, [field]: value} : r
    ));
  };

  const handleSave = () => {
    if (!title || (!isAllDay && !time)) return;

    // ローカル時間として正確に処理するため、年月日時分を個別に指定
    const [year, month, day] = date.split('-').map(num => parseInt(num));
    const [endYear, endMonth, endDay] = endDate.split('-').map(num => parseInt(num));
    
    const startDateTime = isAllDay 
      ? new Date(year, month - 1, day, 0, 0, 0)
      : (() => {
          const [hours, minutes] = time.split(':').map(num => parseInt(num));
          return new Date(year, month - 1, day, hours, minutes, 0);
        })();
    
    const endDateTime = isAllDay 
      ? new Date(endYear, endMonth - 1, endDay, 23, 59, 59)
      : (() => {
          const [hours, minutes] = endTime.split(':').map(num => parseInt(num));
          return new Date(endYear, endMonth - 1, endDay, hours, minutes, 0);
        })();

    const scheduleData = {
      id: schedule?.id || Date.now(),
      title,
      date: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      description,
      color,
      isAllDay,
      isMultiDay: date !== endDate,
      reminders: reminders
    };

    onSave(scheduleData);
    onClose();
  };

  const handleDelete = () => {
    if (schedule && onDelete) {
      onDelete(schedule.id);
      onClose();
    }
  };

  if (!isOpen) {
    console.log('ScheduleModal is not open');
    return null;
  }

  console.log('ScheduleModal rendering with props:', { isOpen, schedule, selectedDate });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{schedule ? '予定を編集' : '新しい予定'}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="予定のタイトルを入力"
            />
          </div>

          <div className="date-group">
            <div className="form-group">
              <label>開始日</label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (e.target.value > endDate) {
                    setEndDate(e.target.value);
                  }
                  setIsMultiDay(e.target.value !== endDate);
                }}
              />
            </div>
            <div className="form-group">
              <label>終了日</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setIsMultiDay(date !== e.target.value);
                }}
                min={date}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
              />
              終日
            </label>
            {isMultiDay && (
              <span className="multi-day-indicator">🗓️ 複数日の予定</span>
            )}
          </div>

          {!isAllDay && (
            <div className="time-group">
              <div className="form-group">
                <label>開始時刻</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>終了時刻</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>色</label>
            <div className="color-picker">
              {colors.map(colorOption => (
                <button
                  key={colorOption.name}
                  className={`color-option ${color === colorOption.name ? 'selected' : ''}`}
                  style={{ backgroundColor: colorOption.value }}
                  onClick={() => setColor(colorOption.name)}
                  title={colorOption.label}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>詳細</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="詳細を入力（任意）"
              rows="3"
            />
          </div>

          <div className="reminders-section">
            <div className="form-group">
              <label>リマインダー設定</label>
              <button 
                type="button" 
                className="add-reminder-btn"
                onClick={addReminder}
              >
                + リマインダーを追加
              </button>
            </div>

            {reminders.map((reminder, index) => (
              <div key={reminder.id} className="reminder-item">
                <div className="reminder-header">
                  <span>リマインダー {index + 1}</span>
                  <button 
                    type="button"
                    className="remove-reminder-btn"
                    onClick={() => setReminders(reminders.filter(r => r.id !== reminder.id))}
                  >
                    削除
                  </button>
                </div>
                
                <div className="reminder-type-selector">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`reminderType-${reminder.id}`}
                      value="preset"
                      checked={reminder.type === 'preset'}
                      onChange={(e) => updateReminder(reminder.id, 'type', e.target.value)}
                    />
                    プリセット
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`reminderType-${reminder.id}`}
                      value="custom"
                      checked={reminder.type === 'custom'}
                      onChange={(e) => updateReminder(reminder.id, 'type', e.target.value)}
                    />
                    カスタム
                  </label>
                </div>

                {reminder.type === 'preset' && (
                  <div className="form-group">
                    <select
                      value={reminder.minutes}
                      onChange={(e) => updateReminder(reminder.id, 'minutes', parseInt(e.target.value))}
                    >
                      <option value={1} disabled={isDuplicateReminder(1, reminder.id)}>1分前</option>
                      <option value={5} disabled={isDuplicateReminder(5, reminder.id)}>5分前</option>
                      <option value={10} disabled={isDuplicateReminder(10, reminder.id)}>10分前</option>
                      <option value={15} disabled={isDuplicateReminder(15, reminder.id)}>15分前</option>
                      <option value={30} disabled={isDuplicateReminder(30, reminder.id)}>30分前</option>
                      <option value={60} disabled={isDuplicateReminder(60, reminder.id)}>1時間前</option>
                      <option value={120} disabled={isDuplicateReminder(120, reminder.id)}>2時間前</option>
                      <option value={1440} disabled={isDuplicateReminder(1440, reminder.id)}>1日前</option>
                      <option value={10080} disabled={isDuplicateReminder(10080, reminder.id)}>1週間前</option>
                    </select>
                    {isDuplicateReminder(reminder.minutes, reminder.id) && (
                      <div className="duplicate-warning">⚠️ この時間は既に他のリマインダーで設定されています</div>
                    )}
                  </div>
                )}

                {reminder.type === 'custom' && (
                  <div className="custom-reminder">
                    <div className="custom-time-inputs">
                      <div className="time-input-group">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={Math.floor(reminder.minutes / 1440)}
                          onChange={(e) => {
                            const days = parseInt(e.target.value) || 0;
                            const hours = Math.floor((reminder.minutes % 1440) / 60);
                            const mins = reminder.minutes % 60;
                            const newMinutes = days * 1440 + hours * 60 + mins;
                            updateReminder(reminder.id, 'minutes', newMinutes);
                          }}
                        />
                        <span>日</span>
                      </div>
                      <div className="time-input-group">
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={Math.floor((reminder.minutes % 1440) / 60)}
                          onChange={(e) => {
                            const days = Math.floor(reminder.minutes / 1440);
                            const hours = parseInt(e.target.value) || 0;
                            const mins = reminder.minutes % 60;
                            const newMinutes = days * 1440 + hours * 60 + mins;
                            updateReminder(reminder.id, 'minutes', newMinutes);
                          }}
                        />
                        <span>時間</span>
                      </div>
                      <div className="time-input-group">
                        <input
                          type="number"
                          min="1"
                          max="59"
                          value={reminder.minutes % 60 || 1}
                          onChange={(e) => {
                            const days = Math.floor(reminder.minutes / 1440);
                            const hours = Math.floor((reminder.minutes % 1440) / 60);
                            const mins = parseInt(e.target.value) || 1;
                            const newMinutes = days * 1440 + hours * 60 + mins;
                            updateReminder(reminder.id, 'minutes', newMinutes);
                          }}
                        />
                        <span>分前</span>
                      </div>
                    </div>
                    {isDuplicateReminder(reminder.minutes, reminder.id) && (
                      <div className="duplicate-warning">⚠️ この時間は既に他のリマインダーで設定されています</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-left">
            {schedule && (
              <button className="delete-button" onClick={handleDelete}>
                削除
              </button>
            )}
          </div>
          <div className="footer-right">
            <button className="cancel-button" onClick={onClose}>
              キャンセル
            </button>
            <button className="save-button" onClick={handleSave}>
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;