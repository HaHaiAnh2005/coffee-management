import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none cursor-pointer';

  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-950/40',
    secondary: 'bg-stone-800 hover:bg-stone-700 text-stone-200',
    danger: 'bg-rose-500 hover:bg-rose-400 text-stone-950',
    ghost: 'bg-transparent hover:bg-stone-800 text-stone-300',
    outline: 'border border-stone-700 hover:border-amber-500 text-stone-300 hover:text-amber-400 bg-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-6 py-3.5 text-sm',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
