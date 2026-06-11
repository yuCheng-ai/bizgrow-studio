import React from 'react';
import { cn } from '../../lib/utils';

export function PageHeader({ 
  title, 
  description, 
  icon: Icon,
  action
}: { 
  title: React.ReactNode; 
  description?: React.ReactNode; 
  icon?: any;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6 text-slate-400" />}
          {title}
        </h2>
        {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
