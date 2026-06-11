import { useState } from 'react';
import { Bot, TerminalSquare, Eye, Ban, AlertOctagon, Target, FileOutput } from 'lucide-react';
import { mockAgents } from '../data/mockData';

export function AgentConfig() {
  const [selectedAgentId, setSelectedAgentId] = useState(mockAgents[2].id);
  const agent = mockAgents.find(a => a.id === selectedAgentId);

  return (
    <div className="flex h-full gap-6">
      <div className="w-64 flex flex-col gap-4 border-r border-white/10 pr-6 shrink-0">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">已注册业务智能体</h3>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
           {mockAgents.map(a => (
             <button 
               key={a.id}
               onClick={() => setSelectedAgentId(a.id)}
               className={`w-full text-left p-3 rounded-xl border transition-all ${selectedAgentId === a.id ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'}`}
             >
               <div className="font-bold flex justify-between">{a.name} <span className={`text-[10px] flex items-center ${selectedAgentId === a.id ? 'text-green-400' : 'text-slate-600'}`}>● {selectedAgentId === a.id ? '在线' : '待命'}</span></div>
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {agent && (
          <>
            <div className="mb-6 shrink-0">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Bot className="h-6 w-6 text-purple-400" />
                {agent.name} 职责与权限配置
              </h2>
              <p className="text-slate-400 text-sm mt-1">{agent.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-6 mb-6">
                 {/* Permissions Section */}
                 <div className="space-y-4">
                   
                   <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                     <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-3"><Eye className="h-4 w-4"/> 可读取的数据</h4>
                     <div className="flex flex-wrap gap-2">
                       {agent.readAccess.map(r => <span key={r} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded">{r}</span>)}
                     </div>
                   </div>

                   <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                     <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-3"><Target className="h-4 w-4"/> 负责业务对象</h4>
                     <div className="flex flex-wrap gap-2">
                       {agent.targetObjects.map(r => <span key={r} className="bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-xs px-2 py-1 rounded">{r}</span>)}
                     </div>
                   </div>

                   <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                     <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-3"><TerminalSquare className="h-4 w-4"/> 允许执行的动作</h4>
                     <div className="flex flex-col gap-2">
                       {agent.allowedActions.map(r => <span key={r} className="text-green-400 text-sm flex items-center gap-2 border-b border-white/5 pb-1 last:border-0">• {r}</span>)}
                     </div>
                   </div>

                   <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl shadow-inner">
                     <h4 className="text-xs font-bold text-red-500 mb-3 flex items-center gap-2"><Ban className="h-4 w-4"/> 禁止执行的动作</h4>
                     <div className="flex flex-col gap-2 text-sm text-red-300 font-medium">
                       {agent.forbiddenActions.map(r => <span key={r} className="flex items-center gap-2 border-b border-red-500/10 pb-1 last:border-0">⛔️ {r}</span>)}
                     </div>
                   </div>

                   <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl shadow-inner">
                     <h4 className="text-xs font-bold text-amber-500 mb-3 flex items-center gap-2"><AlertOctagon className="h-4 w-4"/> 需要人工确认的动作</h4>
                     <div className="flex flex-col gap-2 text-sm text-amber-200/90 font-medium">
                       {agent.manualConfirmRules.map(r => <span key={r} className="flex items-center gap-2 border-b border-amber-500/10 pb-1 last:border-0">⚠️ {r}</span>)}
                     </div>
                   </div>

                   <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                     <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-3"><FileOutput className="h-4 w-4"/> 输出结果</h4>
                     <div className="flex flex-wrap gap-2">
                       {agent.outputs.map(r => <span key={r} className="bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs px-2 py-1 rounded">{r}</span>)}
                     </div>
                   </div>

                 </div>

                 {/* Live Trajectory Section */}
                 <div className="bg-[#0a0a0f] border border-purple-500/30 rounded-2xl flex flex-col overflow-hidden backdrop-blur-xl shadow-2xl shadow-purple-900/10 sticky top-0" style={{maxHeight: 'calc(100vh - 12rem)'}}>
                   <div className="p-4 bg-purple-500/20 border-b border-purple-500/30 flex justify-between items-center shrink-0">
                     <h3 className="font-bold text-purple-300 text-sm flex items-center gap-2"><Bot className="h-4 w-4"/> 执行过程回放</h3>
                     <div className="flex gap-1 items-center">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                       <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest">Active</span>
                     </div>
                   </div>
                   <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-[11px] text-slate-300">
                     {agent.executionLog.length > 0 ? agent.executionLog.map((log, i) => {
                       let colorClass = 'text-slate-300';
                       if (log.includes('防御拦截') || log.includes('触发系统拦截')) colorClass = 'text-amber-400 font-bold';
                       else if (log.includes('动作执行') || log.includes('断言生效')) colorClass = 'text-green-400';
                       else if (log.includes('推理启动') || log.includes('策略回测')) colorClass = 'text-purple-300';

                       return (
                         <div key={i} className={`pb-2 border-b border-white/5 ${colorClass}`}>
                           {log}
                         </div>
                       );
                     }) : (
                        <div className="text-slate-500 flex flex-col items-center justify-center h-full gap-4 opacity-50">
                          <Bot className="h-10 w-10" />
                          <span>当前 Agent 日志流暂无活动记录</span>
                        </div>
                     )}
                     {agent.executionLog.length > 0 && <div className="text-purple-500 animate-pulse mt-4">&gt;_ 等待下一次业务事件...</div>}
                   </div>
                 </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
