import React from 'react';
import { cn } from '../../lib/utils';

export function TimelineItem({ 
  time, 
  title, 
  description, 
  icon: Icon,
  iconClass,
  isLast = false
}: { 
  time: string; 
  title: string; 
  description?: React.ReactNode; 
  icon?: any;
  iconClass?: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="shrink-0 pt-0.5 relative">
        <div className={cn("w-6 h-6 rounded flex items-center justify-center relative z-10", iconClass || "bg-slate-800 text-slate-400")}>
          {Icon && <Icon className="h-3 w-3" />}
        </div>
        {!isLast && <div className="absolute top-6 bottom-[-20px] left-1/2 -translate-x-1/2 w-px bg-slate-800"></div>}
      </div>
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex-1">
        <div className="text-[10px] text-slate-500 font-bold mb-1">[{time}] {title}</div>
        {description && <div className="text-slate-400 text-xs">{description}</div>}
      </div>
    </div>
  );
}
