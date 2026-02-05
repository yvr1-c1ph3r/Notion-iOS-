
import React from 'react';

interface WidgetCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  onClick: () => void;
  isActive?: boolean;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ label, count, icon, bgColor, onClick, isActive }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between h-20 w-full ${
        isActive ? 'ring-2 ring-blue-500 bg-white' : 'bg-white'
      } widget-shadow active:scale-95`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-1.5 rounded-full text-white ${bgColor}`}>
          {icon}
        </div>
        <span className="text-xl font-bold text-gray-800">{count}</span>
      </div>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-tight">{label}</span>
    </div>
  );
};
