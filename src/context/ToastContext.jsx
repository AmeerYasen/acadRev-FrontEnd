// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package
import Toast from '../components/Toast/Toast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  const closeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo, closeToast }}>
      {children}
      <div className="toast-container" style={{ position: 'fixed', top: 0, right: 0, padding: '1rem', zIndex: 9999 }}>
        {toasts.map((toast) => (
          <div key={toast.id} className="mb-3">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => closeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};