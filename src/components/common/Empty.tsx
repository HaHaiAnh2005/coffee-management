import React from 'react';
import { FiInbox } from 'react-icons/fi';

export const Empty: React.FC<{ message?: string }> = ({ message = 'Chưa có dữ liệu' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-stone-500 space-y-2">
      <FiInbox className="w-10 h-10 text-stone-600" />
      <p className="text-xs font-medium text-stone-400">{message}</p>
    </div>
  );
};
