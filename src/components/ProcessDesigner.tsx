import { GitMerge, Bot, User, Cpu, ShieldAlert, ArrowDown } from 'lucide-react';
import { mockProcessNodes } from '../data/mockData';
import { TypeBadge } from './StatusBadge';

export function ProcessDesigner({ setRightPanel }: { setRightPanel: (content: any) => void }) {
  
  const handleSelect = (nodeId: string) => {
    const node = mockProcessNodes.find(n => n.id === nodeId);
    if (!node) return;

    setRightPanel(
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{node.name}</h3>
          <p className="text-sm text-slate-400">ID: {node.id}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">节点类型</h4>
            <TypeBadge type={node.type} />
          </div>
          
          <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
             <div className="flex justify-between border-b border-white/5 pb-2">
               <span className="text-slate-500 text-xs font-mono">执行角色</span>
               <span className="text-slate-200 text-sm font-bold">{node.executor}</span>
             </div>
             
             <div className="flex justify-between border-b border-white/5 pb-2">
               <span className="text-slate-500 text-xs font-mono">输入对象</span>
               <span className="text-slate-300 text-sm">{node.input}</span>
             </div>
             
             <div className="flex justify-between pb-2">
               <span className="text-slate-500 text-xs font-mono">预期输出结果</span>
               <span className="text-blue-400 text-sm">{node.output}</span>
             </div>
          </div>

          <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">流转条件</h4>
             <div className="bg-white/5 border border-white/10 px-3 py-2 rounded text-sm text-slate-300 font-mono">
               {node.condition}
             </div>
          </div>

          <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">触发的业务规则</h4>
             <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded text-sm text-indigo-300">
               {node.id === 'p_4' ? '库存不足 → 生成采购建议' : 
                node.id === 'p_2' ? '金额超过 100000 → 增加老板审批节点' :
                node.type === 'agent' ? '关键字段修改 → 必须人工确认' :
                '默认流转规则 (无特殊阻断)'}
             </div>
          </div>
          
          <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">执行失败时动作</h4>
             <div className="bg-red-500/10 border border-red-500/20 px-3 py-2 rounded text-sm text-red-400">
               {node.failureAction}
             </div>
          </div>

          {node.needManualConfirm && (
            <div className="mt-4 flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-sm font-medium">
               <ShieldAlert className="h-4 w-4" /> 此步骤 Agent 动作需要人工核准放行
            </div>
          )}
        </div>
      </div>
    );
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'agent': return <Bot className="h-5 w-5 text-purple-400" />;
      case 'human': return <User className="h-5 w-5 text-orange-400" />;
      case 'system': return <Cpu className="h-5 w-5 text-cyan-400" />;
      case 'condition': return <GitMerge className="h-4 w-4 text-amber-400" />;
      default: return null;
    }
  };

  const getStyle = (type: string) => {
    switch(type) {
      case 'agent': return 'border-purple-500/50 bg-purple-900/20 hover:bg-purple-900/40 text-purple-200';
      case 'human': return 'border-orange-500/50 bg-orange-900/20 hover:bg-orange-900/40 text-orange-200';
      case 'system': return 'border-cyan-500/50 bg-cyan-900/20 hover:bg-cyan-900/40 text-cyan-200';
      case 'condition': return 'border-amber-500/50 bg-amber-900/20 hover:bg-amber-900/40 text-amber-200';
      default: return 'border-white/20 bg-white/5 text-slate-200';
    }
  };

  const renderNode = (id: string, customText?: string) => {
    const n = mockProcessNodes.find(node => node.id === id);
    if (!n) return null;
    
    return (
      <div 
        onClick={() => handleSelect(id)}
        className={`w-48 p-3 shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 border rounded-xl relative z-10 ${getStyle(n.type)}`}
      >
        <div className="flex items-center gap-2">
          {getIcon(n.type)}
          <span className="font-bold text-sm">{customText || n.name}</span>
        </div>
      </div>
    );
  };

  const VerticalLine = ({ h = "h-8" }) => (
    <div className={`${h} w-0.5 bg-slate-700 relative`}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-700 z-0"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <GitMerge className="h-6 w-6 text-blue-400" />
          流程编排 (Process Engine)
        </h2>
        <p className="text-slate-400 text-sm mt-1">混合编排业务流转。节点可为人工、系统底座运算模块或 AI Agent。</p>
      </div>

      <div className="flex-1 bg-[#10131c] border border-white/10 rounded-2xl relative overflow-auto p-8 border-t-[4px] border-t-blue-500/50">
         <div className="flex flex-col items-center max-w-4xl mx-auto w-full pb-16 pt-8">
           
           {/* Trunk */}
           {renderNode('p_1')}
           <VerticalLine />
           
           {renderNode('p_2')}
           <VerticalLine />
           
           {renderNode('p_3')}
           <VerticalLine />
           
           {renderNode('p_4')}
           <VerticalLine />

           {/* Condition Gateway */}
           <div className="relative flex flex-col items-center">
             <div 
               onClick={() => handleSelect('p_5')}
               className="w-32 h-12 bg-amber-900/20 border-2 border-amber-500/50 flex items-center justify-center font-bold text-amber-400 text-xs cursor-pointer hover:bg-amber-900/40 transition-colors z-10"
               style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
             >
               是否缺料？
             </div>

             {/* Branching SVG Lines */}
             <svg className="absolute top-[100%] left-1/2 -translate-x-1/2 w-80 h-16 pointer-events-none z-0 overflow-visible">
               {/* Left path (TRUE) */}
               <path d="M 0 0 V 16 H -140 V 64" fill="none" stroke="#334155" strokeWidth="2" />
               <polygon points="-144,60 -136,60 -140,66" fill="#334155" />
               <text x="-130" y="28" fill="#cbd5e1" fontSize="11" fontWeight="bold">是: 缺料补货</text>

               {/* Right path (FALSE) */}
               <path d="M 0 0 V 16 H 140 V 64" fill="none" stroke="#334155" strokeWidth="2" />
               <polygon points="136,60 144,60 140,66" fill="#334155" />
               <text x="70" y="28" fill="#cbd5e1" fontSize="11" fontWeight="bold">否: 库存齐套</text>
             </svg>
           </div>
           
           <div className="h-16"></div> {/* Spacer for branch lines */}

           {/* Branch Contents */}
           <div className="flex justify-between w-full max-w-[500px]">
             {/* Left Branch */}
             <div className="flex flex-col items-center w-48">
               {renderNode('p_6')}
               <VerticalLine h="h-6" />
               <div className="w-48 p-2 border border-slate-700 bg-slate-900/50 rounded-lg text-center text-xs text-slate-400">
                 等待人工确认
               </div>
               <VerticalLine h="h-6" />
               <div className="w-48 p-2 border border-slate-700 bg-slate-900/50 rounded-lg text-center text-xs text-slate-400">
                 等待采购到货关联
               </div>
             </div>

             {/* Right Branch */}
             <div className="flex flex-col items-center w-48">
               {renderNode('p_7')}
               <VerticalLine h="h-6" />
               <div className="w-48 p-2 border border-slate-700 bg-slate-900/50 flex opacity-0"></div>
               <div className="h-6 w-0 border-l-2 border-dashed border-slate-700"></div>
               <div className="w-48 p-2 border border-slate-700 bg-slate-900/50 flex opacity-0"></div>
             </div>
           </div>

           {/* Merge SVG Lines */}
           <div className="relative flex justify-center w-full mt-4 h-16">
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                <path d="M calc(50% - 140px) 0 V 20 H 50%" fill="none" stroke="#334155" strokeWidth="2" />
                <path d="M calc(50% + 140px) 0 V 20 H 50%" fill="none" stroke="#334155" strokeWidth="2" />
                <path d="M 50% 20 V 64" fill="none" stroke="#334155" strokeWidth="2" />
                <polygon points="46%,60 54%,60 50%,66" fill="#334155" />
             </svg>
           </div>
           
           <div className="h-12 w-0.5 relative shrink-0">
             {/* Gap filled by SVG */}
           </div>
           
           {/* Trunk resumed */}
           {renderNode('p_8')}
           <VerticalLine />
           
           {renderNode('p_9')}

         </div>
      </div>
    </div>
  );
}
