'use client';
import { useToastStore } from '@/store/useToastStore';
import { X } from 'lucide-react';
import React from 'react';

export const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-4 justify-between p-4 rounded-lg shadow-xl min-w-[320px] max-w-[400px] border-l-4 bg-white ${
            toast.type === 'error' ? 'border-red-500 text-red-600' :
            toast.type === 'success' ? 'border-green-500 text-green-600' : 'border-blue-500 text-blue-600'
          }`}
        >
          <span className="text-sm font-medium leading-relaxed">{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)} 
            className="text-gray-400 hover:text-gray-800 transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
