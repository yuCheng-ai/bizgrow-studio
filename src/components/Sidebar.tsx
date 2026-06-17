import {
  BarChart3,
  Bot,
  Database,
  Factory,
  FileText,
  Layers3,
  Puzzle,
} from 'lucide-react';
import type React from 'react';

export type ModuleId = 'object' | 'ruleBlocks' | 'agent' | 'knowledge' | 'analytics';

const modules: Array<{
  id: ModuleId;
  label: string;
  desc: string;
  icon: React.ElementType;
}> = [
  { id: 'object', label: '业务对象', desc: '对象底座与视图', icon: Database },
  { id: 'ruleBlocks', label: '规则构件', desc: 'DSL积木与能力', icon: Puzzle },
  { id: 'agent', label: 'Agent工作台', desc: '对话执行业务', icon: Bot },
  { id: 'knowledge', label: '知识库', desc: '经验参与运行', icon: FileText },
  { id: 'analytics', label: '运行分析', desc: '对象健康观测', icon: BarChart3 },
];

export function Sidebar({
  activeModule,
  setActiveModule,
}: {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
}) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-14 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
          <Factory className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-slate-950">BizGrow Studio</h1>
          <p className="text-xs text-slate-500">Object Low-code</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">设计态与运行态</div>
        <div className="space-y-1">
          {modules.map((module) => {
            const active = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                  active
                    ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                    : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <module.icon className={`h-5 w-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>
                  <span className="block text-sm font-medium">{module.label}</span>
                  <span className={`mt-0.5 block text-xs ${active ? 'text-slate-300' : 'text-slate-400'}`}>
                    {module.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Layers3 className="h-4 w-4 text-slate-500" />
            当前底座
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            表单只是对象视图。对象承载字段、关系、生命周期、规则、权限、知识库与 Agent 边界。
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-500">当前示例对象</p>
          <p className="mt-1 text-sm font-semibold text-slate-950">订单 Order</p>
          <p className="mt-1 text-xs text-slate-500">销售交付域 / 核心业务对象</p>
        </div>
      </div>
    </aside>
  );
}
