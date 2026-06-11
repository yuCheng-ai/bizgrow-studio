import React from 'react';
import { 
  BarChart3, Database, Workflow, FileCheck2, Bot, 
  GitMerge, CheckSquare, History, Box, Layers 
} from 'lucide-react';

export const MODULES = [
  { id: 'dashboard', label: '总览', icon: BarChart3 },
  { id: 'ontology', label: '业务本体', icon: Database },
  { id: 'object', label: '业务对象', icon: Box },
  { id: 'relation', label: '关系图谱', icon: GitMerge },
  { id: 'state', label: '状态机', icon: Layers },
  { id: 'process', label: '流程编排', icon: Workflow },
  { id: 'rule', label: '规则引擎', icon: FileCheck2 },
  { id: 'agent', label: 'Agent配置', icon: Bot },
  { id: 'task', label: '任务中心', icon: CheckSquare },
  { id: 'audit', label: '审计日志', icon: History },
] as const;

export function Sidebar({ activeModule, setActiveModule, setRightPanel }: { activeModule: string; setActiveModule: (m: string) => void; setRightPanel: (c: React.ReactNode | null) => void; }) {
  return (
    <div className="w-64 bg-slate-900 border-r border-white/10 flex flex-col z-20 shrink-0">
      <div className="h-14 flex items-center px-6 border-b border-white/10 shrink-0">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-2 bg-clip-text text-transparent">
          <Database className="h-5 w-5 text-blue-500" /> BizGrow Studio
        </h1>
      </div>
      
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">业务操作系统</div>
        {MODULES.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveModule(item.id);
              setRightPanel(null); // Clear right panel context when changing module
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all ${
              activeModule === item.id 
                ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
            }`}
          >
            <item.icon className="h-4 w-4 mr-3" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
             AG
           </div>
           <div>
             <p className="text-xs text-white font-bold">Admin</p>
             <p className="text-[10px] text-slate-500">Workspace Owner</p>
           </div>
        </div>
      </div>
    </div>
  );
}
