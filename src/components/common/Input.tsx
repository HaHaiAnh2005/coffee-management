import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1 w-full">
      {label && <label className="text-xs text-stone-400 font-semibold">{label}</label>}
      <input
        className={`w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
