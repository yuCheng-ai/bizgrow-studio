import { Task } from '../types';
import React from 'react';
import { CheckSquare } from 'lucide-react';
import { mockTasks } from '../data';
import { StatusBadge, TypeBadge, PageHeader, RightPanelItem } from './common';

export function TaskCenter({ setRightPanel }: { setRightPanel: (content: React.ReactNode | null) => void }) {
  const handleSelect = (task: Task) => {
    setRightPanel(
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{task.name}</h3>
          <p className="text-sm text-slate-400">单据引用: <span className="font-mono text-blue-400">{task.targetObject}</span></p>
        </div>
        
        <div className="space-y-4 font-sm">
           <RightPanelItem label="当前状态" value={<StatusBadge status={task.status} />} />
           <RightPanelItem label="任务来源" value={<TypeBadge type={task.source} />} />
           <RightPanelItem label="负责人" value={task.owner} />
           <RightPanelItem label="截止时间" value={task.deadline} valueClass="text-red-400 font-bold" />

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
      <PageHeader 
        title="任务中心" 
        description="承接流程、规则和 Agent 生成的待办任务，处理人工确认、异常和转办。" 
        icon={CheckSquare} 
      />

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
