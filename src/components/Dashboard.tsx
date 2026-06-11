import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const BAR_DATA = [
  { name: '周一', completed: 400, failed: 24 },
  { name: '周二', completed: 300, failed: 13 },
  { name: '周三', completed: 550, failed: 8 },
  { name: '周四', completed: 278, failed: 39 },
  { name: '周五', completed: 189, failed: 48 },
  { name: '周六', completed: 239, failed: 38 },
  { name: '周日', completed: 349, failed: 43 },
];

const PIE_DATA = [
  { name: '销售部', value: 400, color: '#06b6d4' },
  { name: '人力资源', value: 300, color: '#8b5cf6' },
  { name: '客户支持', value: 300, color: '#10b981' },
  { name: 'IT研发', value: 200, color: '#f59e0b' },
];

export function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">系统概览</h2>
          <p className="text-sm text-slate-400 mt-1">实时业务指标与流程健康度监控</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '活跃流程', value: '1,248', desc: '较昨日增长12%', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: '成功率', value: '98.2%', desc: '较昨日上升0.5%', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: '待办任务', value: '342', desc: '需要人工干预', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: '系统异常', value: '18', desc: '自动任务执行失败', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-white mt-2">{kpi.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-3">{kpi.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">本周任务执行情况</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fff" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f5f9', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">各部门资源消耗</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f5f9', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {PIE_DATA.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Exception List */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
           <h3 className="text-sm font-bold text-white uppercase tracking-wider">近期异常告警</h3>
        </div>
        <div className="divide-y divide-white/5">
          {[1,2,3].map((i) => (
            <div key={i} className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
              <div className="p-2 rounded-full bg-red-500/10 text-red-400 mt-1">
                 <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-slate-200">API 连接超时</p>
                  <span className="text-xs text-slate-500 font-mono">10 分钟前</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">流程："供应商入驻" 在 "校验税号" 节点执行失败。</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
