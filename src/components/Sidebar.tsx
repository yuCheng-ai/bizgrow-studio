import React from 'react';
import { 
  BarChart3, Database, Workflow, FileCheck2, Bot, 
  GitMerge, CheckSquare, History, LogOut 
} from 'lucide-react';

export const MODULES = [
  { id: 'dashboard', label: '总体监控看板', icon: BarChart3, desc: 'Dashboard' },
  { id: 'ontology', label: '本体流形设计', icon: Database, desc: 'Ontology' },
  { id: 'object', label: '业务对象建模', icon: Database, desc: 'Object Model' },
  { id: 'relation', label: '逻辑图谱构造', icon: GitMerge, desc: 'Relation Graph' },
  { id: 'state', label: '状态机管理', icon: Workflow, desc: 'State Machine' },
  { id: 'process', label: '执行流编排', icon: GitMerge, desc: 'Process Engine' },
  { id: 'rule', label: '断言规则中心', icon: FileCheck2, desc: 'Rule Engine' },
  { id: 'agent', label: '智能体基站', icon: Bot, desc: 'Agent Station' },
  { id: 'task', label: '干预调度中心', icon: CheckSquare, desc: 'Task Center' },
  { id: 'audit', label: '全域审计追溯', icon: History, desc: 'Audit Log' },
] as const;

export function Sidebar({ activeModule, setActiveModule, setRightPanel }: any) {
  return (
    <div className="w-64 bg-slate-900 border-r border-white/10 flex flex-col z-20 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center gap-2 bg-clip-text text-transparent">
          <Database className="h-5 w-5 text-indigo-500" /> BizGrow Studio
        </h1>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">System OS Modules</div>
        {MODULES.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveModule(item.id);
              setRightPanel(null); // Clear right panel context when changing module
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all ${
              activeModule === item.id 
                ? 'bg-blue-600 shadow-lg text-white font-medium' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <item.icon className="h-4 w-4 mr-3" />
            <div className="flex flex-col items-start">
               <span className="text-sm">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
             AG
           </div>
           <div>
             <p className="text-xs text-white font-bold">Adminstrator</p>
             <p className="text-[10px] text-green-400 font-mono">SYS_CORE_OP</p>
           </div>
        </div>
      </div>
    </div>
  );
}
