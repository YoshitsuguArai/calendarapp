import React, { useState, useEffect } from 'react';
import './ToastNotification.css';

const ToastNotification = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // アニメーション用の遅延
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // 自動削除タイマー
    const autoRemoveTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onRemove, 300); // アニメーション完了後に削除
    }, toast.duration || 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoRemoveTimer);
    };
  }, [toast.duration, onRemove]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onRemove, 300);
  };

  return (
    <div 
      className={`toast toast-${toast.type} ${isVisible ? 'toast-visible' : ''}`}
      onClick={toast.onClick}
    >
      <div className="toast-content">
        <div className="toast-icon">
          {toast.type === 'success' && '✓'}
          {toast.type === 'error' && '✕'}
          {toast.type === 'warning' && '⚠'}
          {toast.type === 'info' && 'ℹ'}
        </div>
        <div className="toast-text">
          <div className="toast-title">{toast.title}</div>
          {toast.body && <div className="toast-body">{toast.body}</div>}
        </div>
        <button 
          className="toast-close" 
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;