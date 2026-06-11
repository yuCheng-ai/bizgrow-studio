import { useState } from 'react';
import { Database, Link2, Zap, LayoutGrid, ArrowRight, Info, MousePointerClick } from 'lucide-react';
import { mockOntologies } from '../data/mockData';
import { OntologyConcept } from '../types';

export function OntologyDesigner({ setRightPanel }: { setRightPanel: (content: any) => void }) {
  const [selectedId, setSelectedId] = useState<string>(mockOntologies[1].id);
  
  const selectedConcept = mockOntologies.find(c => c.id === selectedId) || mockOntologies[0];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-indigo-400" />
          业务本体 (Ontology)
        </h2>
        <p className="text-slate-400 text-sm mt-1">不是向量知识库，而是对真实业务世界运行规律的结构化、元数据化定义。</p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-6">
        
        {/* Top: Business World Map */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative flex flex-col shrink-0">
          <h3 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
            业务世界地图
            <span className="text-xs font-normal text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">抽象概念建模</span>
          </h3>
          
          <div className="flex items-center justify-between w-full relative">
            {/* Connecting lines rendered behind nodes */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
            
            {mockOntologies.map((concept, index) => {
              const isSelected = selectedId === concept.id;
              return (
                <div key={concept.id} className="relative z-10 flex flex-col items-center gap-3">
                  <button
                    onClick={() => setSelectedId(concept.id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${isSelected ? 'bg-indigo-600 border-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110' : 'bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-slate-400 hover:scale-105'}`}
                  >
                    <Database className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                  <span className={`text-[10px] font-bold text-center w-20 break-words ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {concept.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom: Concept Details */}
        <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            
            <div className="flex items-start justify-between border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">{selectedConcept.name.split(' ')[0]}</h3>
                  <span className="text-sm text-slate-500 font-mono">({selectedConcept.name.split(' ')[1] || selectedConcept.name})</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono font-medium border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-lg bg-indigo-500/10">
                    实体类型: {selectedConcept.type}
                  </span>
                  <span className="text-sm text-slate-400 flex items-center gap-2">
                    <Info className="h-4 w-4 text-slate-500" />
                    {selectedConcept.description}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Database className="h-4 w-4"/> 核心属性定义 (Attributes)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedConcept.attributes.map(attr => (
                       <span key={attr} className="bg-slate-800/80 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">{attr}</span>
                    ))}
                  </div>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Link2 className="h-4 w-4 text-emerald-500"/> 与其他本体关联 (Relations)
                   </h4>
                   <div className="flex flex-col gap-2">
                     {selectedConcept.relations.map(rel => (
                       <div key={rel} className="bg-emerald-950/20 border border-emerald-500/20 px-4 py-2.5 rounded-lg text-sm text-emerald-400 font-mono flex items-center gap-2">
                         <MousePointerClick className="h-4 w-4 opacity-50" />
                         {rel}
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500"/> 允许的执行动作边界 (Actions)
                </h4>
                <div className="flex flex-col gap-2 mb-8">
                  {selectedConcept.actions.map(act => (
                     <div key={act} className="bg-amber-950/10 text-amber-400 text-sm px-4 py-3 rounded-xl border border-amber-500/20 shadow-inner flex items-center justify-between">
                       <span>{act}</span>
                       <span className="text-[10px] text-amber-500/50 uppercase">Allowed</span>
                     </div>
                  ))}
                </div>

                <div className="bg-slate-900 border border-indigo-500/20 p-5 rounded-xl shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <Link2 className="h-4 w-4"/> 关联资料与接口
                    </h4>
                    <button className="text-xs font-medium text-slate-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/40 px-3 py-1 rounded transition-colors whitespace-nowrap border border-indigo-500/30">
                      + 挂载资产
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4">这些资料不是本体本身，而是 Agent 执行业务时可参考的外部依据。</p>
                  <div className="space-y-3">
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center justify-between group hover:border-white/20 transition-colors cursor-pointer">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-200 font-medium">业务处理 SOP 手册</span>
                        <span className="text-xs text-slate-500 mt-0.5">PDF 文档 | Agent 可解析</span>
                      </div>
                      <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">已挂载</span>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center justify-between group hover:border-white/20 transition-colors cursor-pointer">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-200 font-medium">{selectedConcept.name.split(' ')[0]}操作 OpenAPI</span>
                        <span className="text-xs text-slate-500 mt-0.5">REST API Definition</span>
                      </div>
                      <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">已挂载</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
