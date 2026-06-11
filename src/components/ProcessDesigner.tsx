import { GitMerge, Bot, User, Cpu, ShieldAlert } from 'lucide-react';
import { mockProcessNodes } from '../data/mockData';
import { TypeBadge } from './StatusBadge';

export function ProcessDesigner({ setRightPanel }: { setRightPanel: (content: any) => void }) {
  
  const handleSelect = (node: any) => {
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
               <span className="text-slate-500 text-xs font-mono">执行主体</span>
               <span className="text-slate-200 text-sm font-bold">{node.executor}</span>
             </div>
             
             <div className="flex justify-between border-b border-white/5 pb-2">
               <span className="text-slate-500 text-xs font-mono">输入对象</span>
               <span className="text-slate-300 text-sm">{node.input}</span>
             </div>
             
             <div className="flex justify-between pb-2">
               <span className="text-slate-500 text-xs font-mono">输出预期</span>
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
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">失败补偿动作</h4>
             <div className="bg-red-500/10 border border-red-500/20 px-3 py-2 rounded text-sm text-red-400">
               {node.failureAction}
             </div>
          </div>

          {node.needManualConfirm && (
            <div className="mt-4 flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-sm font-medium">
               <ShieldAlert className="h-4 w-4" /> 本节点执行动作需要人工二次确认
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
      case 'condition': return <GitMerge className="h-5 w-5 text-amber-400" />;
      default: return <div className="h-5 w-5" />;
    }
  };

  const getStyle = (type: string) => {
    switch(type) {
      case 'agent': return 'border-purple-500/50 bg-purple-900/20 hover:bg-purple-900/30';
      case 'human': return 'border-orange-500/50 bg-orange-900/20 hover:bg-orange-900/30';
      case 'system': return 'border-cyan-500/50 bg-cyan-900/20 hover:bg-cyan-900/30';
      case 'condition': return 'border-amber-500/50 bg-amber-900/20 hover:bg-amber-900/30 rotate-45 scale-75 rounded-lg';
      default: return 'border-white/20 bg-white/5';
    }
  };


  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <GitMerge className="h-6 w-6 text-blue-400" />
          混合执行流编排
        </h2>
        <p className="text-slate-400 text-sm mt-1">编排业务流转。节点可为人工、系统服务或 AI Agent。</p>
      </div>

      <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden flex flex-col items-center justify-start p-8 overflow-y-auto">
         {/* Simplified vertical flowchart representation */}
         {mockProcessNodes.map((node, i) => (
           <div key={node.id} className="flex flex-col items-center cursor-pointer" onClick={() => handleSelect(node)}>
             
             <div className={`p-4 border shadow-xl flex items-center justify-center gap-3 transition-colors text-center w-64 ${getStyle(node.type)} ${node.type !== 'condition' ? 'rounded-xl' : ''}`}>
               <div className={node.type === 'condition' ? '-rotate-45 flex items-center gap-2' : 'flex items-center justify-center gap-3 w-full'}>
                 {getIcon(node.type)}
                 <span className={`font-bold text-slate-200 ${node.type === 'condition' ? 'text-xs' : 'text-sm'}`}>{node.name}</span>
               </div>
             </div>
             
             {i !== mockProcessNodes.length - 1 && (
                <div className="h-10 w-0.5 bg-slate-700 relative my-2">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-700"></div>
                </div>
             )}
           </div>
         ))}
      </div>
    </div>
  );
}
