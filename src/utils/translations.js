const translations = {
  ja: {
    // Header
    'header.title': '予定管理アプリ',
    'header.today': '今日',
    'header.enableNotifications': '通知を有効にする',
    'header.notificationEnabled': '🔔 通知有効',
    'header.settings': '⚙️ 設定',
    
    // View switcher
    'view.calendar': 'カレンダー',
    'view.week': '週間',
    'view.list': 'リスト',
    
    // Calendar
    'calendar.weekdays': ['日', '月', '火', '水', '木', '金', '土'],
    'calendar.months': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    'calendar.weekNumber': '週',
    'calendar.moreSchedules': '他',
    'calendar.moreItems': '件',
    
    // Schedule list
    'scheduleList.title': '予定一覧',
    'scheduleList.noSchedules': '予定がありません',
    'scheduleList.edit': '編集',
    'scheduleList.delete': '削除',
    
    // Schedule modal
    'modal.newSchedule': '新しい予定',
    'modal.editSchedule': '予定の編集',
    'modal.title': 'タイトル',
    'modal.date': '日付',
    'modal.endDate': '終了日',
    'modal.time': '時間',
    'modal.endTime': '終了時間',
    'modal.description': '説明',
    'modal.color': '色',
    'modal.allDay': '終日',
    'modal.multiDay': '複数日',
    'modal.reminder': 'リマインダー',
    'modal.save': '保存',
    'modal.cancel': 'キャンセル',
    'modal.delete': '削除',
    'modal.close': '閉じる',
    
    // Colors
    'color.blue': 'ブルー',
    'color.green': 'グリーン',
    'color.red': 'レッド',
    'color.purple': 'パープル',
    'color.orange': 'オレンジ',
    'color.pink': 'ピンク',
    
    // Settings
    'settings.title': '設定',
    'settings.displaySettings': '表示設定',
    'settings.theme': 'テーマ',
    'settings.theme.light': 'ライト',
    'settings.theme.dark': 'ダーク',
    'settings.defaultView': 'デフォルトビュー',
    'settings.defaultView.calendar': 'カレンダー',
    'settings.defaultView.week': '週間',
    'settings.defaultView.list': 'リスト',
    'settings.weekStartsOn': '週の開始日',
    'settings.weekStartsOn.sunday': '日曜日',
    'settings.weekStartsOn.monday': '月曜日',
    'settings.showWeekNumbers': '週番号を表示',
    'settings.notificationSettings': '通知設定',
    'settings.notificationTime': 'デフォルト通知時間（分前）',
    'settings.notificationTime.5min': '5分前',
    'settings.notificationTime.10min': '10分前',
    'settings.notificationTime.15min': '15分前',
    'settings.notificationTime.30min': '30分前',
    'settings.notificationTime.1hour': '1時間前',
    'settings.notificationGranted': '🔔 通知が有効です',
    'settings.notificationDenied': '🚫 通知が無効です',
    'settings.notificationDefault': '❓ 通知許可が必要です',
    'settings.testNotification': '🔊 音声テスト',
    'settings.otherSettings': 'その他',
    'settings.dateFormat': '日付形式',
    'settings.language': '言語',
    'settings.language.ja': '日本語',
    'settings.language.en': 'English',
    'settings.cancel': 'キャンセル',
    'settings.save': '保存して閉じる',
    'settings.noChanges': '変更なし',
    
    // Notifications
    'notification.testTitle': 'テスト通知',
    'notification.testBody': 'これはテスト通知です。音も一緒に再生されます。'
  },
  
  en: {
    // Header
    'header.title': 'Schedule Management App',
    'header.today': 'Today',
    'header.enableNotifications': 'Enable Notifications',
    'header.notificationEnabled': '🔔 Notifications Enabled',
    'header.settings': '⚙️ Settings',
    
    // View switcher
    'view.calendar': 'Calendar',
    'view.week': 'Week',
    'view.list': 'List',
    
    // Calendar
    'calendar.weekdays': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'calendar.months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'calendar.weekNumber': 'W',
    'calendar.moreSchedules': 'more',
    'calendar.moreItems': 'items',
    
    // Schedule list
    'scheduleList.title': 'Schedule List',
    'scheduleList.noSchedules': 'No schedules',
    'scheduleList.edit': 'Edit',
    'scheduleList.delete': 'Delete',
    
    // Schedule modal
    'modal.newSchedule': 'New Schedule',
    'modal.editSchedule': 'Edit Schedule',
    'modal.title': 'Title',
    'modal.date': 'Date',
    'modal.endDate': 'End Date',
    'modal.time': 'Time',
    'modal.endTime': 'End Time',
    'modal.description': 'Description',
    'modal.color': 'Color',
    'modal.allDay': 'All Day',
    'modal.multiDay': 'Multi Day',
    'modal.reminder': 'Reminder',
    'modal.save': 'Save',
    'modal.cancel': 'Cancel',
    'modal.delete': 'Delete',
    'modal.close': 'Close',
    
    // Colors
    'color.blue': 'Blue',
    'color.green': 'Green',
    'color.red': 'Red',
    'color.purple': 'Purple',
    'color.orange': 'Orange',
    'color.pink': 'Pink',
    
    // Settings
    'settings.title': 'Settings',
    'settings.displaySettings': 'Display Settings',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.defaultView': 'Default View',
    'settings.defaultView.calendar': 'Calendar',
    'settings.defaultView.week': 'Week',
    'settings.defaultView.list': 'List',
    'settings.weekStartsOn': 'Week Starts On',
    'settings.weekStartsOn.sunday': 'Sunday',
    'settings.weekStartsOn.monday': 'Monday',
    'settings.showWeekNumbers': 'Show Week Numbers',
    'settings.notificationSettings': 'Notification Settings',
    'settings.notificationTime': 'Default Notification Time (minutes before)',
    'settings.notificationTime.5min': '5 minutes before',
    'settings.notificationTime.10min': '10 minutes before',
    'settings.notificationTime.15min': '15 minutes before',
    'settings.notificationTime.30min': '30 minutes before',
    'settings.notificationTime.1hour': '1 hour before',
    'settings.notificationGranted': '🔔 Notifications are enabled',
    'settings.notificationDenied': '🚫 Notifications are disabled',
    'settings.notificationDefault': '❓ Notification permission required',
    'settings.testNotification': '🔊 Test Audio',
    'settings.otherSettings': 'Other Settings',
    'settings.dateFormat': 'Date Format',
    'settings.language': 'Language',
    'settings.language.ja': '日本語',
    'settings.language.en': 'English',
    'settings.cancel': 'Cancel',
    'settings.save': 'Save and Close',
    'settings.noChanges': 'No Changes',
    
    // Notifications
    'notification.testTitle': 'Test Notification',
    'notification.testBody': 'This is a test notification with sound.'
  }
};

export const useTranslation = (language = 'ja') => {
  const t = (key, params = {}) => {
    const translation = translations[language]?.[key] || translations.ja[key] || key;
    
    // Simple parameter replacement
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      return Object.keys(params).reduce((str, param) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      }, translation);
    }
    
    return translation;
  };
  
  return { t };
};

export default translations;