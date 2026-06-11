import { Workflow, ArrowRight } from 'lucide-react';
import { mockStates } from '../data';
import { StatusBadge } from './common';

export function StateMachineDesigner() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Workflow className="h-6 w-6 text-green-400" />
            对象状态机引擎
          </h2>
          <p className="text-slate-400 text-sm mt-1">控制业务核心对象（当前：订单 ORD）的生命周期与流转约束。</p>
        </div>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium border border-white/10">切换对象对象</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {mockStates.map((state, i) => (
          <div key={state.id} className="relative flex items-start gap-6">
            
            <div className="flex flex-col items-center pt-6">
              <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-green-500 flex items-center justify-center font-bold text-white shadow-lg shadow-green-900/20 z-10">
                {i + 1}
              </div>
              {i !== mockStates.length - 1 && (
                <div className="w-0.5 h-full min-h-[100px] bg-white/10 absolute top-18 bottom-[-24px] z-0"></div>
              )}
            </div>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 mt-2 hover:bg-white/10 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{state.name}</h3>
                  <StatusBadge status={state.type} />
                </div>
                <div className="flex gap-2">
                  {state.roles.map(role => (
                    <span key={role} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">{role}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-300">
                <div>
                  <span className="text-slate-500 text-xs font-mono uppercase block mb-1">允许动作 (Actions)</span>
                  <div className="flex gap-2">
                    {state.allowedActions.map(act => (
                      <span key={act} className="inline-flex items-center text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded text-xs">{act} <ArrowRight className="h-3 w-3 ml-1 opacity-50"/></span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-mono uppercase block mb-1">进入前置条件</span>
                  <p className="font-medium text-slate-200">{state.enterCondition}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-mono uppercase block mb-1">离开校验规则</span>
                  <p className="font-medium text-slate-200">{state.leaveValidation}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-mono uppercase block mb-1">SLA 超时策略</span>
                  <p className="font-medium text-amber-400">{state.timeoutPolicy}</p>
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
