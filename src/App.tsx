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

function Topbar({ activeModuleLabel }: { activeModuleLabel: string }) {
  return (
    <div className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6 shrink-0 z-10 w-full relative">
       <div className="flex items-center gap-4">
         <span className="text-slate-400 font-mono text-sm opacity-50">&gt;_ sys.workspace.invoke</span>
         <span className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            LIVE ENVIRONMENT
         </span>
       </div>
       <div className="text-blue-400 font-bold tracking-widest uppercase text-xs">
          [ {activeModuleLabel} ]
       </div>
    </div>
  );
}

function BottomLogger() {
  return (
    <div className="h-48 bg-slate-950 border-t border-white/10 shrink-0 flex flex-col z-20 font-mono text-xs shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center bg-black/40 px-4 py-1 border-b border-white/5">
        <span className="text-slate-500 uppercase tracking-widest text-[10px]">&gt; Terminal_Stdout</span>
        <span className="text-green-500 uppercase tracking-widest text-[10px]">Connected</span>
      </div>
      <div className="p-4 overflow-y-auto space-y-1 text-slate-400 flex-1">
        <div className="text-slate-600">[SYSTEM] Core initialized. Ontology graph loaded.</div>
        <div className="text-slate-600">[SYSTEM] Registering agents... OK (5 agents)</div>
        <div className="text-blue-400 opacity-80">[AGENT-002] Order Evaluator Online. Awaiting requests.</div>
        <div>[CRON] Rule "交期风险拦截" triggered check... No matches found.</div>
        <div>[PROCESS] Node "库存水位检查" successfully returned result to flow instance {`#FL_891`}</div>
        <div className="text-amber-500/80">[WARN] High memory consumption detected in Relation Graph Traversal.</div>
        <div className="text-green-500 animate-pulse blink">&gt; _</div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [rightPanelContent, setRightPanelContent] = useState<React.ReactNode | null>(null);

  const getActiveModuleLabel = () => {
    switch (activeModule) {
      case 'dashboard': return '总体监控看板';
      case 'ontology': return '本体流形设计';
      case 'object': return '业务对象建模';
      case 'relation': return '逻辑图谱构造';
      case 'state': return '状态机管理';
      case 'process': return '执行流编排';
      case 'rule': return '断言规则中心';
      case 'agent': return '智能体平台';
      case 'task': return '调度指挥中心';
      case 'audit': return '全域防调包审计';
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
    <div className="flex h-screen bg-black overflow-hidden font-sans selection:bg-blue-500/30">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        setRightPanel={setRightPanelContent} 
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/10 via-slate-900/0 to-purple-900/10 pointer-events-none"></div>

        <Topbar activeModuleLabel={getActiveModuleLabel()} />
        
        <div className="flex-1 overflow-hidden z-10 flex relative">
          <main className="flex-1 overflow-hidden p-6 relative h-full">
            <div className="h-full w-full max-w-7xl mx-auto">
               {renderMainContent()}
            </div>
          </main>
          
          <RightPanel content={rightPanelContent} onClose={() => setRightPanelContent(null)} />
        </div>

        <BottomLogger />
      </div>
    </div>
  );
}
