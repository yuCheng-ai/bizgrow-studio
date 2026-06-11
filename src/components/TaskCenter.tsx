import { CheckSquare } from 'lucide-react';
import { mockTasks } from '../data/mockData';
import { StatusBadge, TypeBadge } from './StatusBadge';

export function TaskCenter({ setRightPanel }: { setRightPanel: (content: any) => void }) {
  const handleSelect = (task: any) => {
    setRightPanel(
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{task.name}</h3>
          <p className="text-sm text-slate-400">单据引用: <span className="font-mono text-blue-400">{task.targetObject}</span></p>
        </div>
        
        <div className="space-y-4 font-sm">
           <div className="flex justify-between border-b border-white/10 pb-2">
             <span className="text-slate-500">当前状态</span>
             <StatusBadge status={task.status} />
           </div>
           
           <div className="flex justify-between border-b border-white/10 pb-2">
             <span className="text-slate-500">任务来源</span>
             <TypeBadge type={task.source} />
           </div>
           
           <div className="flex justify-between border-b border-white/10 pb-2">
             <span className="text-slate-500">负责人</span>
             <span className="text-white">{task.owner}</span>
           </div>
           
           <div className="flex justify-between border-b border-white/10 pb-2">
             <span className="text-slate-500">截止时间</span>
             <span className="text-red-400 font-bold">{task.deadline}</span>
           </div>

           <div className="pt-6 flex gap-3">
             <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold">立即处理</button>
             <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg font-bold border border-white/10">转办</button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-orange-400" />
            干预调度中心 (Task Center)
          </h2>
          <p className="text-slate-400 text-sm mt-1">处理人工介入、Agent挂起、以及规则流转的待办任务。</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-black/20 text-slate-400 border-b border-white/10 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">任务名称</th>
                <th className="px-6 py-4 font-semibold">生成来源</th>
                <th className="px-6 py-4 font-semibold">业务对象</th>
                <th className="px-6 py-4 font-semibold">当前状态</th>
                <th className="px-6 py-4 font-semibold">优先级</th>
                <th className="px-6 py-4 font-semibold">限办时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {mockTasks.map(task => (
                <tr key={task.id} onClick={() => handleSelect(task)} className="hover:bg-white/10 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-bold text-white">{task.name}</td>
                  <td className="px-6 py-4"><TypeBadge type={task.source} /></td>
                  <td className="px-6 py-4 font-mono text-xs">{task.targetObject}</td>
                  <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${task.priority === 'high' ? 'bg-red-500/20 text-red-500' : task.priority==='medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-500/20 text-slate-500'}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{task.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
