import React from 'react';

export function RightPanelSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4 font-sm">
      <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

export function RightPanelItem({ label, value, valueClass }: { label: string, value: React.ReactNode, valueClass?: string }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={valueClass || "text-white"}>{value}</span>
    </div>
  );
}
