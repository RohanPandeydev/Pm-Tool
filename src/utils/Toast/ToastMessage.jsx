// ToastContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext();
const TOAST_DURATION = 3000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'default') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, duration: TOAST_DURATION, remaining: TOAST_DURATION }
    ]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, TOAST_DURATION);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setToasts((prevToasts) =>
        prevToasts.map((toast) => ({
          ...toast,
          remaining: toast.remaining > 0 ? toast.remaining - 100 : 0,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" style={{top:'10px'}}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} show`}>
            {toast.message}
            <div className="toast-progress" style={{ width: `${(toast.remaining / toast.duration) * 100}%` }}></div>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
