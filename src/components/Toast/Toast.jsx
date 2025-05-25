// src/components/Toast/Toast.jsx
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// Mapping of toast types to their respective colors and icons
const toastConfig = {
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    icon: <AlertCircle className="w-5 h-5 text-red-500" />
  },
  warning: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-800',
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    icon: <Info className="w-5 h-5 text-blue-500" />
  }
};

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = toastConfig[type] || toastConfig.info;

  useEffect(() => {
    if (!duration) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300); // Allow time for exit animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${config.bgColor} ${config.textColor} border-l-4 ${config.borderColor} p-4 rounded shadow-md flex items-start w-80`}>
        <div className="flex-shrink-0 mr-3">
          {config.icon}
        </div>
        <div className="flex-grow mr-2">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Toast;