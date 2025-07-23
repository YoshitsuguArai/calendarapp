import React, { useState, useEffect } from 'react';

const ScheduleModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  schedule, 
  selectedDate 
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  const [isAllDay, setIsAllDay] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [reminderType, setReminderType] = useState('preset'); // 'preset' or 'custom'
  const [customDays, setCustomDays] = useState(0);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(15);

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
        const endDate = new Date(schedule.endDate);
        const endHours = String(endDate.getHours()).padStart(2, '0');
        const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
        setEndTime(`${endHours}:${endMinutes}`);
      } else {
        const endDate = new Date(scheduleDate.getTime() + 60 * 60 * 1000);
        const endHours = String(endDate.getHours()).padStart(2, '0');
        const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
        setEndTime(`${endHours}:${endMinutes}`);
      }
      
      setDescription(schedule.description || '');
      setColor(schedule.color || 'blue');
      setIsAllDay(schedule.isAllDay || false);
      setReminderEnabled(schedule.reminder?.enabled || false);
      setReminderMinutes(schedule.reminder?.minutes || 15);
      setReminderType(schedule.reminder?.type || 'preset');
      
      if (schedule.reminder?.type === 'custom') {
        const totalMinutes = schedule.reminder?.minutes || 15;
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;
        setCustomDays(days);
        setCustomHours(hours);
        setCustomMinutes(minutes);
      }
    } else if (selectedDate) {
      // ローカル日付として正しく表示するため、タイムゾーンオフセットを考慮
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      setDate(dateStr);
      setTime('09:00');
      setEndTime('10:00');
      setTitle('');
      setDescription('');
      setColor('blue');
      setIsAllDay(false);
      setReminderEnabled(false);
      setReminderMinutes(15);
      setReminderType('preset');
      setCustomDays(0);
      setCustomHours(0);
      setCustomMinutes(15);
    }
  }, [schedule, selectedDate, isOpen]);

  const handleSave = () => {
    if (!title || (!isAllDay && !time)) return;

    // ローカル時間として正確に処理するため、年月日時分を個別に指定
    const [year, month, day] = date.split('-').map(num => parseInt(num));
    
    const startDateTime = isAllDay 
      ? new Date(year, month - 1, day, 0, 0, 0)
      : (() => {
          const [hours, minutes] = time.split(':').map(num => parseInt(num));
          return new Date(year, month - 1, day, hours, minutes, 0);
        })();
    
    const endDateTime = isAllDay 
      ? new Date(year, month - 1, day, 23, 59, 59)
      : (() => {
          const [hours, minutes] = endTime.split(':').map(num => parseInt(num));
          return new Date(year, month - 1, day, hours, minutes, 0);
        })();

    // リマインダーの分数を計算
    const finalReminderMinutes = reminderType === 'custom' 
      ? (customDays * 1440) + (customHours * 60) + customMinutes
      : reminderMinutes;

    const scheduleData = {
      id: schedule?.id || Date.now(),
      title,
      date: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      description,
      color,
      isAllDay,
      reminder: {
        enabled: reminderEnabled,
        minutes: finalReminderMinutes,
        type: reminderType
      }
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

  if (!isOpen) return null;

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

          <div className="form-group">
            <label>日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
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

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
              />
              リマインダーを設定
            </label>
          </div>

          {reminderEnabled && (
            <div className="reminder-settings">
              <div className="form-group">
                <label>通知タイミング設定</label>
                <div className="reminder-type-selector">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="reminderType"
                      value="preset"
                      checked={reminderType === 'preset'}
                      onChange={(e) => setReminderType(e.target.value)}
                    />
                    プリセット
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="reminderType"
                      value="custom"
                      checked={reminderType === 'custom'}
                      onChange={(e) => setReminderType(e.target.value)}
                    />
                    カスタム
                  </label>
                </div>
              </div>

              {reminderType === 'preset' && (
                <div className="form-group">
                  <label>通知タイミング</label>
                  <select
                    value={reminderMinutes}
                    onChange={(e) => setReminderMinutes(parseInt(e.target.value))}
                  >
                    <option value={1}>1分前</option>
                    <option value={5}>5分前</option>
                    <option value={10}>10分前</option>
                    <option value={15}>15分前</option>
                    <option value={30}>30分前</option>
                    <option value={60}>1時間前</option>
                    <option value={120}>2時間前</option>
                    <option value={1440}>1日前</option>
                  </select>
                </div>
              )}

              {reminderType === 'custom' && (
                <div className="custom-reminder">
                  <label>カスタム設定</label>
                  <div className="custom-time-inputs">
                    <div className="time-input-group">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={customDays}
                        onChange={(e) => setCustomDays(parseInt(e.target.value) || 0)}
                      />
                      <span>日</span>
                    </div>
                    <div className="time-input-group">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={customHours}
                        onChange={(e) => setCustomHours(parseInt(e.target.value) || 0)}
                      />
                      <span>時間</span>
                    </div>
                    <div className="time-input-group">
                      <input
                        type="number"
                        min="1"
                        max="59"
                        value={customMinutes}
                        onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
                      />
                      <span>分前</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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