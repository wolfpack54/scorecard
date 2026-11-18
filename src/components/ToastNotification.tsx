'use client';

'use client';

import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { ErrorMessage } from './ErrorMessage';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a dummy context if not wrapped
    return {
      showToast: (message: string, type?: Toast['type'], duration?: number) => {
        console.log(`[Toast]: ${type}: ${message}`);
      },
    };
  }
  return context;
}

interface ToastNotificationProps {
  children: ReactNode;
}

export function ToastNotification({ children }: ToastNotificationProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const contextValue: ToastContextType = { showToast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="animate-slide-up"
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            <div className={cn(
              'rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]',
              'bg-white dark:bg-gray-800 border',
              {
                'border-danger/20': toast.type === 'error',
                'border-warning/20': toast.type === 'warning',
                'border-primary/20': toast.type === 'info',
                'border-success/20': toast.type === 'success',
              }
            )}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {toast.type === 'error' && '❌'}
                  {toast.type === 'warning' && '⚠️'}
                  {toast.type === 'info' && 'ℹ️'}
                  {toast.type === 'success' && '✅'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}