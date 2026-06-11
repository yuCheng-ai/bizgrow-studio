import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white/5 border border-white/10 rounded-2xl overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-4 border-b border-white/10", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
