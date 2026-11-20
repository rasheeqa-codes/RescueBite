import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

import './Toast.css';

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle2 size={22} />,
    error: <AlertCircle size={22} />,
    warning: <AlertTriangle size={22} />,
    info: <Info size={22} />
  };

  return (
    <div className={`toast-message toast-${toast.type}`}>

      <div className="toast-icon">
        {icons[toast.type]}
      </div>

      <div className="toast-content">
        <strong>
          {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
        </strong>

        <p>{toast.message}</p>
      </div>

      <button
        className="toast-close"
        onClick={() => onClose(toast.id)}
      >
        <X size={18} />
      </button>

    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();

    setToasts((previous) => [
      ...previous,
      { id, message, type }
    ]);
  };

  const removeToast = (id) => {
    setToasts((previous) =>
      previous.filter((toast) => toast.id !== id)
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>

      {children}

      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </div>

    </ToastContext.Provider>
  );
}