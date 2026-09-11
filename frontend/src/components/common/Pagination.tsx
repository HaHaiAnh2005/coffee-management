import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl bg-white border border-sky-200 disabled:opacity-40 text-stone-700 hover:bg-sky-50 transition-colors shadow-2xs"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-xs font-semibold text-stone-600 px-3">
        Trang {currentPage} / {totalPages || 1}
      </span>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl bg-white border border-sky-200 disabled:opacity-40 text-stone-700 hover:bg-sky-50 transition-colors shadow-2xs"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
