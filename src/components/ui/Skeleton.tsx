import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'w-full h-4' }) => {
  return <div className={`bg-stone-800 rounded animate-pulse ${className}`} />;
};
