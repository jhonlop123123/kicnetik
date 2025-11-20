
import React, { useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';
import { ToastContext, ToastMessage } from '../types';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // Auto remove after 5s
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto min-w-[300px] max-w-md rounded-xl p-4 shadow-2xl border backdrop-blur-md flex items-start gap-3
              animate-in slide-in-from-right-full fade-in duration-300
              ${toast.type === 'success' ? 'bg-green-900/80 border-green-500/50 text-green-100' : ''}
              ${toast.type === 'error' ? 'bg-red-900/80 border-red-500/50 text-red-100' : ''}
              ${toast.type === 'info' ? 'bg-slate-900/80 border-slate-700 text-slate-200' : ''}
              ${toast.type === 'gold' ? 'bg-amber-900/80 border-amber-500/50 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}
            `}
          >
            <div className="mt-0.5">
              {toast.type === 'success' && <CheckCircle size={18} className="text-green-400" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-red-400" />}
              {toast.type === 'info' && <Info size={18} className="text-slate-400" />}
              {toast.type === 'gold' && <Zap size={18} className="text-amber-400 fill-current" />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{toast.title}</h4>
              <p className="text-xs opacity-90 mt-1 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
