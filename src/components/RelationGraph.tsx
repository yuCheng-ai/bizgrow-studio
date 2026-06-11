import { useState } from 'react';
import { Network, Link2 } from 'lucide-react';
import { mockRelations } from '../data/mockData';

export function RelationGraph() {
  const [selectedRelId, setSelectedRelId] = useState(mockRelations[0].id);
  const selectedRel = mockRelations.find(r => r.id === selectedRelId);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Network className="h-6 w-6 text-cyan-400" />
          全链路逻辑关系图谱 (Relation Graph)
        </h2>
        <p className="text-slate-400 text-sm mt-1">展示业务对象之间的传导链条：牵一发而动全身。</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left: Graphical Chain */}
        <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-y-auto p-8 relative flex flex-col items-center">
           <div className="max-w-md w-full relative z-10 flex flex-col items-center pb-20">
             {mockRelations.map((rel, i) => (
               <div 
                  key={rel.id} 
                  className="w-full flex flex-col items-center cursor-pointer group"
                  onClick={() => setSelectedRelId(rel.id)}
               >
                 {/* Object Node */}
                 {i === 0 && (
                   <div className="bg-slate-900 border border-slate-700 px-6 py-3 rounded-xl shadow-lg z-10 min-w-[200px] text-center mb-1 relative">
                     <span className="font-bold text-slate-200">{rel.source}</span>
                   </div>
                 )}
                 
                 {/* Edge connecting them */}
                 <div className={`h-16 w-0.5 relative transition-colors ${selectedRelId === rel.id ? 'bg-cyan-500' : 'bg-slate-700 group-hover:bg-slate-500'}`}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] px-3 py-1 rounded-full border whitespace-nowrap z-20 font-bold transition-all ${selectedRelId === rel.id ? 'bg-cyan-900 text-cyan-300 border-cyan-500 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-800 text-slate-400 border-slate-600 group-hover:bg-slate-700 group-hover:text-slate-300'}`}>
                      {rel.type}
                    </div>
                    {/* Arrow head */}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent transition-colors ${selectedRelId === rel.id ? 'border-t-cyan-500' : 'border-t-slate-700 group-hover:border-t-slate-500'}`}></div>
                 </div>

                 {/* Next Object Node target */}
                 <div className={`mt-1 border px-6 py-3 rounded-xl shadow-lg z-10 min-w-[200px] text-center transition-all ${selectedRelId === rel.id ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-white/10 group-hover:border-white/30'}`}>
                   <span className={`font-bold transition-colors ${selectedRelId === rel.id ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>{rel.target}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="w-80 shrink-0 flex flex-col">
          {selectedRel && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full shadow-2xl backdrop-blur-xl flex flex-col">
               <div className="mb-6 pb-6 border-b border-white/5">
                 <div className="flex items-center justify-center gap-4 mb-8 mt-4">
                   <div className="text-center">
                     <div className="text-lg font-bold text-white mb-2">{selectedRel.source}</div>
                     <div className="w-16 h-1 bg-slate-800 mx-auto rounded-full"></div>
                   </div>
                   <div className="flex flex-col items-center text-cyan-500">
                     <Link2 className="h-5 w-5 mb-1 opacity-80" />
                     <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">{selectedRel.type}</span>
                   </div>
                   <div className="text-center">
                     <div className="text-lg font-bold text-cyan-400 mb-2">{selectedRel.target}</div>
                     <div className="w-16 h-1 bg-cyan-900 mx-auto rounded-full"></div>
                   </div>
                 </div>
               </div>

               <div>
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">关系业务语义 (Semantic Meaning)</h4>
                 <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-slate-300 text-sm leading-relaxed">
                   {selectedRel.description}
                 </div>
               </div>
               
               <div className="mt-6">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Agent 可利用此关系</h4>
                 <ul className="space-y-2 text-xs text-slate-400">
                   <li className="flex gap-2"><span>•</span> 通过 [{selectedRel.target}] 逆向追溯并锁定受影响的 [{selectedRel.source}]</li>
                   <li className="flex gap-2"><span>•</span> 预判 [{selectedRel.source}] 状态变动后产生的全域多米诺骨牌效应</li>
                 </ul>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
