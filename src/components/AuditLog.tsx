import { History, Search } from 'lucide-react';
import { mockLog } from '../data/mockData';

export function AuditLog() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-slate-400" />
            审计日志
          </h2>
          <p className="text-slate-400 text-sm mt-1">记录每一次业务流转、规则命中、Agent 动作、人工确认和数据修改。</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input type="text" placeholder="Trace ID / 业务单号" className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-500" />
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 overflow-y-auto relative">
         <div className="absolute top-6 bottom-6 left-12 w-[1px] bg-white/10"></div>
         
         <div className="space-y-6">
           {mockLog.map(log => (
             <div key={log.id} className="relative flex gap-6 z-10 group">
                <div className="w-20 text-right shrink-0 py-1">
                  <span className="text-xs font-mono text-slate-500 group-hover:text-amber-400 transition-colors">{log.timestamp}</span>
                </div>
                
                <div className="relative pt-1.5 flex justify-center">
                  <div className={`w-3 h-3 rounded-full border-2 border-slate-900 ${log.event.includes('Agent') ? 'bg-purple-500' : log.event.includes('规则') ? 'bg-amber-500' : 'bg-blue-500'} absolute left-[-6.5px]`}></div>
                </div>

                <div className="flex-1 bg-black/20 border border-white/5 p-4 rounded-xl hover:border-white/20 transition-all hover:bg-black/40">
                   <h4 className="font-bold text-slate-200 mb-2">{log.event}</h4>
                   
                   <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                     {log.reads.length > 0 && (
                       <div>
                         <span className="text-slate-500 block mb-1">读取数据: </span>
                         <span className="text-slate-400">{log.reads.join(', ')}</span>
                       </div>
                     )}
                     
                     {log.rulesHit.length > 0 && (
                       <div>
                         <span className="text-amber-500/80 block mb-1">命中规则: </span>
                         <span className="text-amber-200">{log.rulesHit.join(', ')}</span>
                       </div>
                     )}

                     {log.agentJudgment && (
                       <div className="col-span-2 bg-purple-900/10 border border-purple-500/20 p-2 rounded text-purple-300">
                         <span className="text-purple-500/80 block mb-1">Agent判断: </span>
                         {log.agentJudgment}
                       </div>
                     )}

                     <div className="col-span-2 flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                       <div>
                         <span className="text-slate-500 block mb-1">执行动作: </span>
                         <span className="text-green-400 font-bold">{log.action}</span>
                       </div>
                       
                       <div className="text-right">
                         <span className="text-slate-500 border border-slate-700 px-2 py-0.5 rounded mr-2 inline-block">人工确认: {log.manualConfirmed ? 'TRUE' : 'FALSE'}</span>
                         {log.result === 'success' ? (
                           <span className="text-green-500">成功</span>
                         ) : log.result === 'waiting' ? (
                           <span className="text-amber-500">等待确认</span>
                         ) : (
                           <span className="text-red-500">失败</span>
                         )}
                       </div>
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
