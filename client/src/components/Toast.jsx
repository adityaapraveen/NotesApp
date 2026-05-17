import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error', 6000),
    info: (msg) => addToast(msg, 'info'),
  }, [addToast]);

  // Make toast object callable
  const toastFn = useCallback(
    (msg, type) => addToast(msg, type),
    [addToast]
  );
  toastFn.success = (msg) => addToast(msg, 'success');
  toastFn.error = (msg) => addToast(msg, 'error', 6000);
  toastFn.info = (msg) => addToast(msg, 'info');

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  return (
    <ToastContext.Provider value={toastFn}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((t) => {
            const IconComp = icons[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                className={`toast toast-${t.type} glass-strong`}
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <IconComp size={18} className="toast-icon" />
                <span className="toast-message">{t.message}</span>
                <button
                  className="toast-close"
                  onClick={() => removeToast(t.id)}
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
