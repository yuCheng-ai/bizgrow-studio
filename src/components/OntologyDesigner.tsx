import { useState } from 'react';
import { Database, Link2, Zap, LayoutGrid } from 'lucide-react';
import { mockOntologies } from '../data/mockData';
import { OntologyConcept } from '../types';

export function OntologyDesigner({ setRightPanel }: { setRightPanel: (content: any) => void }) {
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-indigo-400" />
          业务本体设计 (Ontology)
        </h2>
        <p className="text-slate-400 text-sm mt-1">不是向量知识库，而是对真实业务世界运行规律的结构化、元数据化定义。</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockOntologies.map((concept, idx) => (
            <div 
              key={concept.id}
              className="p-5 rounded-2xl border bg-black/40 border-white/10 hover:border-white/20 transition-all flex flex-col"
            >
              <div className="mb-3 border-b border-white/10 pb-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-indigo-300">{concept.name}</h3>
                  <span className="text-[10px] font-mono border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10">{concept.type.split(' ')[0]}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{concept.description}</p>
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Database className="h-3 w-3"/> 核心属性 (Attributes)</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {concept.attributes.slice(0, 4).map(attr => (
                       <span key={attr} className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-700">{attr}</span>
                    ))}
                    {concept.attributes.length > 4 && <span className="text-slate-500 text-[10px]">...</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Zap className="h-3 w-3 text-amber-500"/> 可执行动作 (Actions)</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {concept.actions.slice(0, 3).map(act => (
                       <span key={act} className="bg-amber-900/10 text-amber-500/80 text-[10px] px-1.5 py-0.5 rounded border border-amber-900/30">{act}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-2 border-t border-white/5">
                   <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Link2 className="h-3 w-3 text-emerald-500"/> 业务关联 (Relations)</h4>
                   <div className="flex flex-col gap-1">
                     {concept.relations.map(rel => (
                       <div key={rel} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono">
                         {rel}
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
