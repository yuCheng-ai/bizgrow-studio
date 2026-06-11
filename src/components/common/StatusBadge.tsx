import React from 'react';
import { cn } from '../../lib/utils';

export function StatusBadge({ status, className }: { status: string, className?: string }) {
  const getStyle = () => {
    switch(status.toLowerCase()) {
      case 'success':
      case 'completed':
      case '已完成':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'running':
      case '执行中':
      case 'normal':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'pending':
      case 'waiting':
      case '等待确认':
      case '待处理':
      case '待评审':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'failed':
      case 'blocked':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider font-mono uppercase inline-flex items-center", getStyle(), className)}>
      {status}
    </span>
  );
}

export function TypeBadge({ type, className }: { type: string, className?: string }) {
  const getStyle = () => {
    if(type.includes('Agent') || type.includes('agent')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if(type.includes('系统') || type.includes('system')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    if(type.includes('人工') || type.includes('human')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  return (
    <span className={cn("px-2 py-0.5 rounded border text-[10px] uppercase font-semibold", getStyle(), className)}>
      {type}
    </span>
  );
}
