import React from 'react';
import { X } from 'lucide-react';

export function RightPanel({ content, onClose }: { content: React.ReactNode, onClose: () => void }) {
  if (!content) return null;

  return (
    <div className="w-80 bg-slate-900 border-l border-white/10 flex flex-col shrink-0 relative overflow-y-auto shadow-2xl z-20">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      {content}
    </div>
  );
}
