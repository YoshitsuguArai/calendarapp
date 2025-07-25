import { useState, useCallback } from 'react';

let toastIdCounter = 0;

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, options = {}) => {
    const id = ++toastIdCounter;
    const toast = {
      id,
      title,
      body: options.body || '',
      type: options.type || 'info',
      duration: options.duration || 5000,
      onClick: options.onClick
    };

    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 便利なヘルパー関数
  const showSuccess = useCallback((title, options = {}) => {
    return addToast(title, { ...options, type: 'success' });
  }, [addToast]);

  const showError = useCallback((title, options = {}) => {
    return addToast(title, { ...options, type: 'error' });
  }, [addToast]);

  const showWarning = useCallback((title, options = {}) => {
    return addToast(title, { ...options, type: 'warning' });
  }, [addToast]);

  const showInfo = useCallback((title, options = {}) => {
    return addToast(title, { ...options, type: 'info' });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useToast;