
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  id?: string;
  title?: string;
  message: string;
  type?: ToastType;
}

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  addToast: (optionsOrMessage: ToastOptions | string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((optionsOrMessage: ToastOptions | string, defaultType: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    let newToast: Toast;

    if (typeof optionsOrMessage === 'string') {
      newToast = { id, message: optionsOrMessage, type: defaultType };
    } else {
      newToast = {
        id: optionsOrMessage.id || id,
        title: optionsOrMessage.title,
        message: optionsOrMessage.message,
        type: optionsOrMessage.type || defaultType,
      };
    }

    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    addToast(message, type);
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl p-4 rounded-2xl animate-in slide-in-from-right-10 fade-in duration-300 relative overflow-hidden"
          >
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
              toast.type === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-xs font-black text-slate-800 uppercase tracking-wider mb-0.5">{toast.title}</p>
              )}
              <p className="text-xs font-medium text-slate-600 leading-snug">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors shrink-0"
              title="Fechar"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-0 left-0 h-1 bg-current opacity-25 rounded-b-2xl animate-shrink-width" style={{
              width: '100%',
              animation: 'shrinkWidth 4.5s linear forwards',
              color: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : '#3b82f6'
            }} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink-width {
          animation: shrinkWidth 4.5s linear forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};
