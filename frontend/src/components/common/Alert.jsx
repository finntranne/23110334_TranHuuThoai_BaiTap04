import React, { useEffect } from 'react';

/**
 * Alert component với tự động đóng
 */
const Alert = ({
  type = 'info',
  message,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const typeStyles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ'
  };

  return (
    <div className={`${typeStyles[type]} border-l-4 p-4 rounded-md flex items-start gap-3`}>
      <span className="font-bold text-lg">{icons[type]}</span>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-current hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
