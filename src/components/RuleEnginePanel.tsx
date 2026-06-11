import { FileCheck2, Filter, Zap, Box, Bot } from 'lucide-react';
import { mockRules } from '../data';
import { StatusBadge } from './common';

export function RuleEnginePanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-amber-400" />
            自动化规则引擎
          </h2>
          <p className="text-slate-400 text-sm mt-1">IF-THEN 结构驱动业务断言、风险干预与 Agent 动态调度。</p>
        </div>
        <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium">新建规则</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {mockRules.map((rule) => (
          <div key={rule.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{rule.name}</h3>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={rule.enabled ? '已启用' : '已停用'} />
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider font-mono uppercase bg-slate-800 border ${rule.riskLevel === 'high' ? 'text-red-400 border-red-500/30' : rule.riskLevel === 'medium' ? 'text-amber-400 border-amber-500/30' : 'text-blue-400 border-blue-500/30'}`}>
                    {rule.riskLevel} Risk
                  </span>
                </div>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 shadow-inner">
                  <Box className="h-3 w-3 text-cyan-500" />
                  <span className="text-slate-500 mr-1">关联对象:</span> {rule.relatedObjects.join(', ')}
                </div>
                <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 shadow-inner">
                  <Bot className="h-3 w-3 text-purple-400" />
                  <span className="text-slate-500 mr-1">关联 Agent:</span> {rule.relatedAgent}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-sm">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 relative">
                <div className="absolute right-0 top-1/2 translate-x-3 -translate-y-1/2 w-6 h-0 border-[1.5px] border-dashed border-white/20 z-0"></div>
                <div className="flex items-center gap-2 text-slate-500 font-bold mb-2 uppercase tracking-wider text-xs relative z-10">
                  <Filter className="h-4 w-4" /> WHEN (触发事件)
                </div>
                <div className="text-slate-300 relative z-10">{rule.whenEvent}</div>
              </div>
              
              <div className="bg-black/20 p-4 rounded-xl border border-amber-500/20 border-l-4 border-l-amber-500 shadow-lg shadow-amber-500/5 relative">
                <div className="absolute right-0 top-1/2 translate-x-3 -translate-y-1/2 w-6 h-0 border-[1.5px] border-dashed border-white/20 z-0"></div>
                <div className="flex items-center gap-2 text-amber-500 font-bold mb-2 uppercase tracking-wider text-xs relative z-10">
                  IF (满足条件)
                </div>
                <div className="text-amber-300 leading-relaxed relative z-10">{rule.ifCondition}</div>
              </div>
              
              <div className="bg-black/20 p-4 rounded-xl border border-green-500/20 border-l-4 border-l-green-500 shadow-lg shadow-green-500/5 relative">
                <div className="flex items-center gap-2 text-green-500 font-bold mb-2 uppercase tracking-wider text-xs">
                  <Zap className="h-4 w-4" /> THEN (执行动作)
                </div>
                <div className="text-green-300 leading-relaxed">{rule.thenAction}</div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
