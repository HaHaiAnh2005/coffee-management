import React from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  return (
    <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold shadow-2xl ${
      type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300' : 'bg-rose-950/90 border-rose-500 text-rose-300'
    }`}>
      {type === 'success' ? <FiCheckCircle className="w-4 h-4" /> : <FiAlertCircle className="w-4 h-4" />}
      <span>{message}</span>
    </div>
  );
};
