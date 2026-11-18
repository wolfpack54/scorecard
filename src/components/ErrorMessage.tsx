'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  className?: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ 
  message, 
  type = 'error',
  className,
  onDismiss 
}: ErrorMessageProps) {
  const typeClasses = {
    error: 'bg-danger/10 border-danger/20 text-danger',
    warning: 'bg-warning/10 border-warning/20 text-warning-dark',
    info: 'bg-primary/10 border-primary/20 text-primary-dark',
    success: 'bg-success/10 border-success/20 text-success-dark',
  };

  const iconMap = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅',
  };

  return (
    <div className={cn(
      'rounded-lg border p-4',
      typeClasses[type],
      className
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 text-lg">
          {iconMap[type]}
        </div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 text-current hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}