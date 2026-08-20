import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8 text-amber-500">
      <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
    </div>
  );
};
