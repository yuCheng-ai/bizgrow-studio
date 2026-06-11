import { useState } from 'react';
import { Network, Link2 } from 'lucide-react';
import { mockRelations } from '../data/mockData';

const GRAPH_NODES = [
  { id: '客户', x: 50, y: 15 },
  { id: '订单', x: 50, y: 35 },
  { id: '订单明细', x: 75, y: 35 },
  { id: '产品', x: 75, y: 50 },
  { id: 'BOM', x: 75, y: 65 },
  { id: '物料', x: 75, y: 80 },
  { id: '库存', x: 50, y: 80 },
  { id: '采购需求', x: 25, y: 80 },
  { id: '生产任务', x: 25, y: 65 },
  { id: '发货单', x: 25, y: 50 },
  { id: '应收款', x: 25, y: 35 },
];

export function RelationGraph() {
  const [selectedRelId, setSelectedRelId] = useState(mockRelations[0].id);
  const selectedRel = mockRelations.find(r => r.id === selectedRelId);

  // Helper to draw lines
  const drawLine = (sourceId: string, targetId: string) => {
    const s = GRAPH_NODES.find(n => n.id === sourceId);
    const t = GRAPH_NODES.find(n => n.id === targetId);
    if (!s || !t) return null;
    
    const isSelected = selectedRel?.source === sourceId && selectedRel?.target === targetId;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <marker id={`arrow-${isSelected}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={isSelected ? '#06b6d4' : '#475569'} />
          </marker>
        </defs>
        <line
          x1={`${s.x}%`}
          y1={`${s.y}%`}
          x2={`${t.x}%`}
          y2={`${t.y}%`}
          stroke={isSelected ? '#06b6d4' : '#475569'}
          strokeWidth={isSelected ? 3 : 1.5}
          markerEnd={`url(#arrow-${isSelected})`}
          className="transition-all duration-300"
          strokeDasharray={isSelected ? '0' : '4 2'}
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Network className="h-6 w-6 text-cyan-400" />
          全链路逻辑关系图谱 (Relation Graph)
        </h2>
        <p className="text-slate-400 text-sm mt-1">展示业务对象之间的传导链条：牵一发而动全身。</p>
        <p className="text-cyan-400 text-sm mt-1 font-medium bg-cyan-900/20 inline-block px-3 py-1 rounded border border-cyan-800/30">
          核心链路：以订单为中心，串联客户、产品、物料、库存、采购、生产、发货、应收。
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left: Graphical Map Canvas */}
        <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative flex items-center justify-center overflow-hidden">
           
           <div className="relative w-full max-w-2xl h-[500px]">
             
             {/* Lines rendered as SVGs */}
             {mockRelations.map(rel => (
               <div key={`line-${rel.id}`}>{drawLine(rel.source, rel.target)}</div>
             ))}

             {/* Nodes rendered as absolute divs */}
             {GRAPH_NODES.map(node => {
               const isSourceOfSelected = selectedRel?.source === node.id;
               const isTargetOfSelected = selectedRel?.target === node.id;
               const isActive = isSourceOfSelected || isTargetOfSelected;

               return (
                 <div 
                   key={node.id} 
                   className={`absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2.5 rounded-xl border text-sm font-bold shadow-lg transition-all z-10 
                     ${isActive ? 'bg-cyan-900/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white' : 'bg-slate-900 border-slate-700 text-slate-300'}
                     ${node.id === '订单' ? 'scale-110 !font-black ring-2 ring-indigo-500/50' : ''}
                   `}
                   style={{ left: `${node.x}%`, top: `${node.y}%` }}
                 >
                   {node.id}
                 </div>
               );
             })}

             {/* Functional hidden clickable hotspots for relationships */}
             {mockRelations.map(rel => {
                const s = GRAPH_NODES.find(n => n.id === rel.source);
                const t = GRAPH_NODES.find(n => n.id === rel.target);
                if (!s || !t) return null;
                const midX = (s.x + t.x) / 2;
                const midY = (s.y + t.y) / 2;
                const isSelected = selectedRel?.id === rel.id;
                return (
                  <div 
                    key={`hit-${rel.id}`}
                    onClick={() => setSelectedRelId(rel.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer px-2 py-0.5 rounded text-[10px] font-mono z-20 
                       transition-all shadow hover:scale-110 ${isSelected ? 'bg-cyan-500 text-slate-950 font-bold border border-cyan-400' : 'bg-slate-800 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'}`}
                    style={{ left: `${midX}%`, top: `${midY}%` }}
                  >
                    {rel.type}
                  </div>
                )
             })}
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
                 <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
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
