import React from 'react';
import type { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`bg-white border border-stone-200 rounded-3xl w-full ${sizeClasses} overflow-hidden shadow-2xl flex flex-col text-stone-900`}>
        {title && (
          <div className="p-4 border-b border-sky-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base">{title}</h3>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1 rounded-xl hover:bg-stone-100 transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
