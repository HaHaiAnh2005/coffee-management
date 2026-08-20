import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-sky-100 rounded-2xl p-5 shadow-sm text-stone-900 ${className}`}>
      {children}
    </div>
  );
};
