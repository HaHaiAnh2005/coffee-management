import React from 'react';
import type { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: IconType;
  color?: 'amber' | 'emerald' | 'blue' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  color = 'amber',
}) => {
  const colorMap = {
    amber: 'bg-amber-100 text-amber-800 border-amber-300',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    blue: 'bg-sky-100 text-sky-800 border-sky-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <div className="bg-white border border-sky-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-stone-600">{title}</p>
        <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight">{value}</h3>
        {subtext && <p className="text-xs text-stone-500">{subtext}</p>}
      </div>

      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shadow-xs ${colorMap[color]}`}>
        <Icon />
      </div>
    </div>
  );
};
