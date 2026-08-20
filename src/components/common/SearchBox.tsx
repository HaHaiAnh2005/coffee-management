import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
}) => {
  return (
    <div className="relative w-full max-w-xs">
      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-stone-950/70 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60"
      />
    </div>
  );
};
