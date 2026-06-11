import { useState } from 'react';
import { mockObjects } from '../data/mockData';
import { TypeBadge } from './StatusBadge';
import { Search, Database, Layers, GitMerge, Zap, Bot, Activity } from 'lucide-react';

export function ObjectModeler() {
  const [selectedObjId, setSelectedObjId] = useState(mockObjects[0].id);
  const selectedObj = mockObjects.find(o => o.id === selectedObjId);

  return (
    <div className="flex h-full gap-6">
      <div className="w-64 flex flex-col gap-4 border-r border-white/10 pr-6 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索系统对象..."
            className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
           {mockObjects.map(obj => (
             <button
               key={obj.id}
               onClick={() => setSelectedObjId(obj.id)}
               className={`w-full text-left p-3 rounded-xl border transition-all ${selectedObjId === obj.id ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'}`}
             >
               <div className="font-bold">{obj.name}</div>
               <div className="text-xs opacity-60 font-mono mt-1">{obj.code}</div>
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 pr-2">
        <div className="mb-6 flex justify-between items-end shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="h-6 w-6 text-blue-400" />
              业务对象建模 - {selectedObj?.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1">将抽象的本体概念实例化为可被系统控制与 Agent 读写的业务实体结构。</p>
          </div>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-lg text-sm font-medium">编译校验模型</button>
        </div>

        {selectedObj && (
           <div className="flex-1 overflow-y-auto">
             <div className="grid grid-cols-2 gap-6 mb-6">
                
                {/* Info Card */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">所属本体概念 (Ontology Reference)</h4>
                    <span className="inline-flex items-center gap-2 text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
                      <Database className="h-4 w-4" /> {selectedObj.ontologyConcept}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">业务含义 (Business Definition)</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{selectedObj.businessMeaning}</p>
                  </div>
                </div>

                {/* Constraints Card */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><GitMerge className="h-4 w-4"/> 关联对象边界 (Relational Boundaries)</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedObj.relatedObjects.map(rel => <span key={rel} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs text-slate-300">{rel}</span>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Activity className="h-4 w-4"/> 生命周期状态树 (Lifecycle States)</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedObj.lifecycleStates.map(state => <span key={state} className="bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-1 rounded text-xs">{state}</span>)}
                    </div>
                  </div>
                </div>

                {/* Behavioral Rules Card */}
                <div className="col-span-2 grid grid-cols-3 gap-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl p-5">
                  <div>
                    <h4 className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" /> 可触发事件 (Events)</h4>
                    <ul className="space-y-2 text-sm text-blue-200">
                      {selectedObj.triggerableEvents.map(evt => <li key={evt} className="flex items-center gap-2">⚡ {evt}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mb-3 flex items-center gap-2">可执行动作 (Actions)</h4>
                    <ul className="space-y-2 text-sm text-blue-200">
                      {selectedObj.executableActions.map(act => <li key={act} className="flex items-center gap-2">• {act}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-400/70 uppercase tracking-widest mb-3 flex items-center gap-2"><Bot className="h-4 w-4 text-purple-400" /> Agent 操作范围许可</h4>
                    <ul className="space-y-2 text-sm text-purple-300">
                      {selectedObj.agentOperableScope.map(scp => <li key={scp} className="flex items-center gap-2">✓ {scp}</li>)}
                    </ul>
                  </div>
                </div>

             </div>

             {/* Fields Table */}
             <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col mb-6">
               <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
                 <h3 className="font-bold text-white">结构化字段设计 (Persist Schema)</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-black/20 text-slate-400 border-b border-white/10 font-mono">
                      <tr>
                        <th className="px-4 py-3 font-semibold">业务字段名称</th>
                        <th className="px-4 py-3 font-semibold">标识符</th>
                        <th className="px-4 py-3 font-semibold">数据类型</th>
                        <th className="px-4 py-3 font-semibold">必填</th>
                        <th className="px-6 py-3 font-semibold">说明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300 bg-black/10">
                      {selectedObj.fields.map(f => (
                        <tr key={f.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-bold text-white">{f.name}</td>
                          <td className="px-4 py-3 text-amber-300/80 font-mono text-xs">{f.code}</td>
                          <td className="px-4 py-3"><TypeBadge type={f.type} /></td>
                          <td className="px-4 py-3">{f.required ? <span className="text-red-400 text-xs font-bold">YES</span> : <span className="text-slate-600 font-mono text-xs">-</span>}</td>
                          <td className="px-6 py-3 text-xs text-slate-500 whitespace-normal">{f.description}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
             </div>

           </div>
        )}
      </div>
    </div>
  );
}
