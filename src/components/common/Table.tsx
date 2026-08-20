import React from 'react';
import type { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-sky-50/80 text-stone-700 text-xs uppercase tracking-wider border-b border-sky-100 font-bold">
            {headers.map((h, i) => (
              <th key={i} className="p-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-100 text-xs text-stone-800">
          {children}
        </tbody>
      </table>
    </div>
  );
};
