import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { Dashboard } from './components/Dashboard';
import { OntologyDesigner } from './components/OntologyDesigner';
import { ObjectModeler } from './components/ObjectModeler';
import { RelationGraph } from './components/RelationGraph';
import { StateMachineDesigner } from './components/StateMachineDesigner';
import { ProcessDesigner } from './components/ProcessDesigner';
import { RuleEnginePanel } from './components/RuleEnginePanel';
import { AgentConfig } from './components/AgentConfig';
import { TaskCenter } from './components/TaskCenter';
import { AuditLog } from './components/AuditLog';
import { ChevronDown, ChevronUp } from 'lucide-react';

function Topbar({ activeModuleLabel }: { activeModuleLabel: string }) {
  return (
    <div className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-10 w-full relative">
       <div className="flex items-center gap-4">
         <span className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            运行环境
         </span>
         <span className="text-slate-400 font-medium text-sm">BizGrow Studio</span>
       </div>
       <div className="text-blue-400 font-bold tracking-widest text-sm">
          {activeModuleLabel}
       </div>
    </div>
  );
}

import { Bot, Terminal, Activity, ArrowRight } from 'lucide-react';

function BottomLogger() {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`bg-slate-950/95 backdrop-blur-md border-t border-white/10 shrink-0 flex flex-col z-50 font-mono text-xs shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 absolute bottom-0 left-0 right-0 ${expanded ? 'h-[33vh]' : 'h-10'}`}>
      <div 
        className="flex justify-between items-center bg-black/40 px-4 h-10 border-b border-white/5 cursor-pointer hover:bg-white/5 shrink-0"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Terminal className="h-4 w-4 text-slate-500" />
          <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">系统运行追踪</span>
          <span className="text-slate-600 text-[10px]">|</span>
          <span className="text-green-400 truncate text-[11px] flex items-center gap-2">
            <Activity className="h-3 w-3 animate-pulse" />
            [10:02:45] 订单评审 Agent 正在分析 OR-2026-001 合规性...
          </span>
        </div>
        <div className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-[10px]">
          {expanded ? '收起 (Close)' : '展开链路 (View Details)'}
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-6 overflow-y-auto w-full flex-1 flex flex-col gap-4">
          
          <div className="flex gap-4 items-start group">
            <div className="shrink-0 pt-0.5 relative">
              <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <Terminal className="h-3 w-3" />
              </div>
              <div className="absolute top-6 bottom-[-20px] left-1/2 -translate-x-1/2 w-px bg-slate-800"></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex-1 opacity-70">
              <div className="text-[10px] text-slate-500 font-bold mb-1">[09:58:12] 系统自检</div>
              <div className="text-slate-400 text-xs">本体与流程模型已加载完毕。Agent 调度中心自检完成 (5 个在线 Agent)。</div>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="shrink-0 pt-0.5 relative">
              <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-500">
                <Bot className="h-3 w-3" />
              </div>
              <div className="absolute top-6 bottom-[-20px] left-1/2 -translate-x-1/2 w-px bg-slate-800 group-hover:bg-emerald-900/50 transition-colors"></div>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] text-emerald-500 font-bold">库存检查 Agent</span>
                 <span className="text-[10px] text-slate-500">[10:01:05]</span>
                 <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-800/50">巡检动作</span>
              </div>
              <div className="text-emerald-200/70 text-xs">执行物料安全水位线自动巡检。触发 SQL 探针查询可用库存... <span className="text-emerald-400">正常 (12,450/10,000)</span>。</div>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="shrink-0 pt-0.5 relative">
              <div className="w-6 h-6 rounded-full bg-blue-900 border border-blue-500 flex items-center justify-center text-white shadow-[0_0_10px_rgba(59,130,246,0.3)] z-10 relative">
                <Activity className="h-3 w-3 animate-pulse" />
              </div>
              <div className="absolute top-6 bottom-[-20px] left-1/2 -translate-x-1/2 w-px bg-blue-900/50"></div>
            </div>
            <div className="bg-blue-950/20 border border-blue-900/50 p-3 rounded-xl flex-1">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] text-blue-400 font-bold uppercase">业务流转触发</span>
                 <span className="text-[10px] text-slate-500">[10:02:10]</span>
              </div>
              <div className="flex items-center gap-3 text-xs bg-black/40 p-2 rounded-lg border border-blue-900/30 w-max">
                 <span className="text-slate-300">客户提交新需求</span>
                 <ArrowRight className="h-3 w-3 text-blue-500" />
                 <span className="text-blue-300 font-bold">生成订单 OR-2026-001</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="shrink-0 pt-0.5 relative">
              <div className="w-6 h-6 rounded bg-emerald-900 border border-emerald-400 flex items-center justify-center text-white shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                <Bot className="h-3 w-3" />
              </div>
              <div className="absolute top-6 bottom-[-10px] left-1/2 -translate-x-1/2 w-px bg-transparent"></div>
            </div>
            <div className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-xl flex-1 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-900/20 to-transparent pointer-events-none"></div>
              <div className="flex items-center gap-2 mb-1 relative z-10">
                 <span className="text-[10px] text-emerald-400 font-bold">订单评审 Agent</span>
                 <span className="text-[10px] text-slate-500">[10:02:45] 当前链路</span>
                 <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    THINKING...
                 </span>
              </div>
              <div className="text-emerald-100 text-xs mt-2 relative z-10 space-y-1.5">
                 <p className="text-emerald-300/70">{'>'} 加载本体定义「订单 (Order)」及规则集合...</p>
                 <p className="text-emerald-300/70">{'>'} 调用风控服务检查客户 [信用等级]...</p>
                 <p className="animate-pulse">{`> 正在验证 BOM 拆解物料前置依赖条件..._`}</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [rightPanelContent, setRightPanelContent] = useState<React.ReactNode | null>(null);

  const getActiveModuleLabel = () => {
    switch (activeModule) {
      case 'dashboard': return '总览';
      case 'ontology': return '业务本体';
      case 'object': return '业务对象';
      case 'relation': return '关系图谱';
      case 'state': return '状态机';
      case 'process': return '流程编排';
      case 'rule': return '规则引擎';
      case 'agent': return 'Agent配置';
      case 'task': return '任务中心';
      case 'audit': return '审计日志';
      default: return '工作台';
    }
  };

  const renderMainContent = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'ontology': return <OntologyDesigner setRightPanel={setRightPanelContent} />;
      case 'object': return <ObjectModeler />;
      case 'relation': return <RelationGraph />;
      case 'state': return <StateMachineDesigner />;
      case 'process': return <ProcessDesigner setRightPanel={setRightPanelContent} />;
      case 'rule': return <RuleEnginePanel />;
      case 'agent': return <AgentConfig />;
      case 'task': return <TaskCenter setRightPanel={setRightPanelContent} />;
      case 'audit': return <AuditLog />;
      default: return <div className="text-white">Under Construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans selection:bg-blue-500/30">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        setRightPanel={setRightPanelContent} 
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
        <Topbar activeModuleLabel={getActiveModuleLabel()} />
        
        <div className="flex-1 overflow-hidden z-10 flex relative bg-[#0B0F19]">
          <main className="flex-1 overflow-hidden p-6 relative h-full">
            <div className="h-full w-full max-w-7xl mx-auto">
               {renderMainContent()}
            </div>
          </main>
          <div className={`${rightPanelContent ? 'w-[450px] border-l border-white/10 bg-slate-900 shadow-2xl relative z-20 transition-all duration-300' : 'w-0 overflow-hidden transition-all duration-300'}`}>
             <RightPanel content={rightPanelContent} onClose={() => setRightPanelContent(null)} />
          </div>
        </div>

        <BottomLogger />
      </div>
    </div>
  );
}