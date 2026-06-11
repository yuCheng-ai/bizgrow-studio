import { Activity, Database, GitMerge, Bot, Zap, Clock, Network, AlertTriangle, Box, Workflow, Layers } from 'lucide-react';

const KPIS = [
  { label: '本体概念数量', value: '10', icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { label: '业务对象数量', value: '7', icon: Box, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: '对象关系数量', value: '10', icon: GitMerge, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { label: '状态阶段定义', value: '7', icon: Layers, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  { label: '流程节点数量', value: '9', icon: Workflow, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { label: '业务规则数量', value: '5', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { label: '注册 Agent 数', value: '5', icon: Bot, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: '系统自动化率', value: '92.4%', icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
];

const EXEC_STATS = [
  { label: '待人工确认任务数', value: '4', icon: Clock, textClass: 'text-orange-400' },
  { label: '异常处理任务数', value: '1', icon: AlertTriangle, textClass: 'text-red-400' },
];

const BIZ_LINK = [
  { step: '客户需求', status: '已收集' },
  { step: '创建订单', status: '已落库' },
  { step: '订单评审', status: 'Agent执行中', alert: true },
  { step: '库存检查', status: '等待前置条件' },
  { step: '采购建议', status: '未激活' },
  { step: '生产任务', status: '未启动' },
  { step: '发货提醒', status: '休眠状态' },
  { step: '完成订单', status: '终态不可达' },
];

export function Dashboard() {
  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto pr-2">
      <div className="flex justify-between items-end border-b border-white/10 pb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">业务大盘监控</h2>
          <p className="text-slate-400 text-sm mt-2">当前场景：<span className="text-blue-400 font-medium">订单驱动型业务闭环</span></p>
          <p className="text-indigo-400 text-sm mt-1 font-medium bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-md inline-block">先定义业务世界，再生成业务系统，最后由 Agent 推动业务运行。</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 shrink-0">
        {KPIS.map((kpi, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-0.5">{kpi.value}</h3>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 flex-1 min-h-0">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none"></div>
          <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest shrink-0">系统生成构建链路 (底层驱动)</h3>
          <p className="text-xs text-slate-500 mb-6">低代码平台通过以下构件链式组装，最终生成并驱动右上层业务应用的自主运行：</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['业务本体', '业务对象', '关系图谱', '状态机', '流程编排', '规则引擎', 'AI Agent'].map((step, idx, arr) => (
              <div key={idx} className="flex items-center shrink-0">
                <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-sm font-bold text-slate-300 shadow-inner">
                  {step}
                </div>
                {idx !== arr.length - 1 && (
                  <div className="w-8 h-[2px] bg-slate-700 relative mx-1">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-slate-700"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
               <Network className="h-32 w-32" />
            </div>
            <h3 className="text-lg font-bold text-white mb-6 shrink-0">订单业务运行链路 (当前实例)</h3>
            
            <div className="flex-1 relative pr-4">
               <div className="absolute left-[15px] top-4 border-l-2 border-dashed border-slate-700 h-[calc(100%-2rem)] z-0"></div>
               
               <div className="space-y-6 relative z-10">
                  {BIZ_LINK.map((node, i) => (
                    <div key={i} className="flex items-center gap-6">
                       <div className={`w-8 h-8 rounded-full border-4 border-slate-950 flex items-center justify-center ${['已收集', '已落库'].includes(node.status) ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : node.alert ? 'bg-amber-500 text-white animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-800'}`}>
                          {['已收集', '已落库'].includes(node.status) && <div className="w-2 h-2 bg-slate-900 rounded-full"></div>}
                          {node.alert && <div className="w-2 h-2 bg-slate-900 rounded-full animate-ping"></div>}
                       </div>
                       <div className={`bg-black/40 border px-4 py-3 rounded-xl flex-1 flex justify-between items-center transition-all cursor-default ${node.alert ? 'border-amber-500/30 bg-amber-950/20' : 'border-white/5 hover:border-white/20'}`}>
                          <span className={`${node.alert ? 'font-bold text-amber-200' : 'font-bold text-slate-200'}`}>{node.step}</span>
                          <span className={`text-xs font-mono px-2 py-1 rounded bg-black/50 ${['已收集', '已落库'].includes(node.status) ? 'text-green-400' : node.alert ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{node.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 shrink-0">实时待办墙</h3>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {EXEC_STATS.map((stat, i) => (
                <div key={i} className={`flex items-center justify-between p-4 bg-black/20 rounded-xl border ${stat.textClass === 'text-orange-400' ? 'border-orange-500/20 bg-orange-950/10' : 'border-red-500/20 bg-red-950/10'}`}>
                  <div className="flex items-center gap-3 text-slate-300">
                    <stat.icon className={`h-5 w-5 ${stat.textClass}`} />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <span className={`text-2xl font-bold font-mono ${stat.textClass}`}>{stat.value}</span>
                </div>
              ))}
              
              <div className="mt-8 border-t border-white/10 pt-4">
                <span className="text-xs text-slate-500 font-bold uppercase block mb-3">运行摘要</span>
                <div className="space-y-3 font-mono text-[10px] text-slate-400">
                  <p><span className="text-blue-400">[10:02]</span> 订单 OR-2026-001 已分配评审Agent</p>
                  <p><span className="text-blue-400">[09:58]</span> 库存水位线巡检完成 (正常)</p>
                  <p><span className="text-amber-400">[09:45]</span> 供应商打分接口延迟 230ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
