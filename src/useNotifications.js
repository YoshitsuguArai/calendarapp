import { useState, useEffect, useRef } from 'react';
import useToast from './hooks/useToast';

const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const notifiedSchedules = useRef(new Set()); // 通知済みのスケジュールIDを記録
  const scheduledTimeouts = useRef(new Map()); // 予定されたタイムアウトを管理
  const toast = useToast();

  useEffect(() => {
    // 通知音のオーディオオブジェクトを作成
    const createAudio = () => {
      const audio = new Audio();
      // より確実に再生される短いベル音
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaBC2RzfDMcCYFLYTM7tiJOwhRrtzul2oYEEYz0e6+cCgAIXDu7tqENAYgg7HXxyAEGNLZvp9NFRB0oeLwoGBYCENY4enOgiwGJYPE09mMOw==';
      audio.volume = 0.5;
      audio.preload = 'auto';
      
      // エラーハンドリング
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
      });
      
      return audio;
    };

    audioRef.current = createAudio();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === 'granted';
    }
    return false;
  };

  const playLightMelody = async () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // 軽やかで楽しいメロディー（童謡風のシンプルなフレーズ）
      const melody = [
        { freq: 523.25, time: 0.0, duration: 0.25 }, // C5 (ド)
        { freq: 587.33, time: 0.2, duration: 0.25 }, // D5 (レ)
        { freq: 659.25, time: 0.4, duration: 0.25 }, // E5 (ミ)
        { freq: 523.25, time: 0.6, duration: 0.4 },  // C5 (ド)
        { freq: 659.25, time: 1.0, duration: 0.25 }, // E5 (ミ)
        { freq: 783.99, time: 1.2, duration: 0.5 }   // G5 (ソ)
      ];
      
      melody.forEach(note => {
        // メイン音（正弦波）
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime + note.time);
        
        // 自然な音量変化
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + note.time);
        gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + note.time + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + note.duration);
        
        oscillator.start(audioContext.currentTime + note.time);
        oscillator.stop(audioContext.currentTime + note.time + note.duration);
        
        // ハーモニー（第3音を少し小さく追加）
        const harmonyOsc = audioContext.createOscillator();
        const harmonyGain = audioContext.createGain();
        
        harmonyOsc.connect(harmonyGain);
        harmonyGain.connect(audioContext.destination);
        
        harmonyOsc.type = 'sine';
        harmonyOsc.frequency.setValueAtTime(note.freq * 1.25, audioContext.currentTime + note.time); // 第3音
        
        harmonyGain.gain.setValueAtTime(0, audioContext.currentTime + note.time);
        harmonyGain.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + note.time + 0.05);
        harmonyGain.gain.exponentialRampToValueAtTime(0.005, audioContext.currentTime + note.time + note.duration);
        
        harmonyOsc.start(audioContext.currentTime + note.time);
        harmonyOsc.stop(audioContext.currentTime + note.time + note.duration);
      });
      
      console.log('軽やかなメロディーを再生しました♪');
    } catch (error) {
      console.error('メロディーの再生に失敗しました:', error);
    }
  };

  const playNotificationSound = async () => {
    // 直接メロディーを再生
    await playLightMelody();
  };

  const showNotification = (title, options = {}) => {
    // トーストで表示
    const toastType = options.type || 'info';
    toast.addToast(title, {
      body: options.body,
      type: toastType,
      duration: options.duration || 5000,
      onClick: options.onClick
    });

    // ブラウザ通知も表示（許可されている場合）
    if (permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // 通知音を再生
      playNotificationSound();

      // 5秒後に自動で閉じる
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }
  };

  // より正確な通知スケジューリング
  const scheduleExactNotifications = (schedules) => {
    // 既存のタイムアウトをクリア
    scheduledTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    scheduledTimeouts.current.clear();

    const now = new Date();
    
    schedules.forEach(schedule => {
      // 新形式の複数リマインダー
      if (schedule.reminders && Array.isArray(schedule.reminders)) {
        schedule.reminders.forEach(reminder => {
          const notificationKey = `${schedule.id}-${reminder.id}-${reminder.minutes}`;
          if (notifiedSchedules.current.has(notificationKey)) return;

          const scheduleTime = new Date(schedule.date);
          const reminderTime = new Date(scheduleTime.getTime() - reminder.minutes * 60 * 1000);
          const timeUntilReminder = reminderTime.getTime() - now.getTime();

          // 通知時刻が未来の場合のみスケジュール
          if (timeUntilReminder > 0 && timeUntilReminder <= 24 * 60 * 60 * 1000) { // 24時間以内
            const timeoutId = setTimeout(() => {
              if (!notifiedSchedules.current.has(notificationKey)) {
                showNotification(`予定のリマインダー`, {
                  body: `${schedule.title}\n${scheduleTime.toLocaleString('ja-JP')}`,
                  tag: `reminder-${schedule.id}-${reminder.id}`,
                  requireInteraction: true,
                  type: 'warning'
                });
                
                notifiedSchedules.current.add(notificationKey);
                console.log(`✓ 正確なリマインダー通知送信: ${schedule.title} (${notificationKey})`);
              }
              scheduledTimeouts.current.delete(notificationKey);
            }, timeUntilReminder);

            scheduledTimeouts.current.set(notificationKey, timeoutId);
            console.log(`📅 通知スケジュール済み: ${schedule.title} - ${reminderTime.toLocaleString('ja-JP')} (${Math.round(timeUntilReminder/1000)}秒後)`);
          }
        });
      }
      // 旧形式サポート
      else if (schedule.reminder && schedule.reminder.enabled) {
        const notificationKey = `${schedule.id}-legacy-${schedule.reminder.minutes}`;
        if (notifiedSchedules.current.has(notificationKey)) return;

        const scheduleTime = new Date(schedule.date);
        const reminderTime = new Date(scheduleTime.getTime() - schedule.reminder.minutes * 60 * 1000);
        const timeUntilReminder = reminderTime.getTime() - now.getTime();

        if (timeUntilReminder > 0 && timeUntilReminder <= 24 * 60 * 60 * 1000) {
          const timeoutId = setTimeout(() => {
            if (!notifiedSchedules.current.has(notificationKey)) {
              showNotification(`予定のリマインダー`, {
                body: `${schedule.title}\n${scheduleTime.toLocaleString('ja-JP')}`,
                tag: `reminder-${schedule.id}`,
                requireInteraction: true,
                type: 'warning'
              });
              
              notifiedSchedules.current.add(notificationKey);
              console.log(`✓ 正確なリマインダー通知送信(旧): ${schedule.title} (${notificationKey})`);
            }
            scheduledTimeouts.current.delete(notificationKey);
          }, timeUntilReminder);

          scheduledTimeouts.current.set(notificationKey, timeoutId);
          console.log(`📅 通知スケジュール済み(旧): ${schedule.title} - ${reminderTime.toLocaleString('ja-JP')} (${Math.round(timeUntilReminder/1000)}秒後)`);
        }
      }
    });
  };

  const startPeriodicCheck = (schedules) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // スケジュールが変更された場合のみ、古いスケジュールの通知記録をクリア
    const currentScheduleIds = new Set(schedules.map(s => s.id));
    const keysToRemove = Array.from(notifiedSchedules.current).filter(key => {
      const scheduleId = key.split('-')[0];
      return !currentScheduleIds.has(parseInt(scheduleId));
    });
    keysToRemove.forEach(key => notifiedSchedules.current.delete(key));

    // 正確な通知スケジューリングを実行
    scheduleExactNotifications(schedules);

    // フォールバック用の定期チェック（5分間隔で軽量チェック）
    intervalRef.current = setInterval(() => {
      console.log('🔄 フォールバックチェック実行:', new Date().toLocaleString('ja-JP'));
      // 正確なスケジューリングが失敗した場合のフォールバック
      scheduleExactNotifications(schedules);
    }, 5 * 60 * 1000); // 5分ごと
  };

  const stopPeriodicCheck = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // スケジュールされたタイムアウトもクリア
    scheduledTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    scheduledTimeouts.current.clear();
  };

  return {
    permission,
    requestPermission,
    showNotification,
    startPeriodicCheck,
    stopPeriodicCheck,
    playNotificationSound,
    ...toast
  };
};

export default useNotifications;