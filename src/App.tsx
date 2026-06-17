import React, { useState } from 'react';
import { Background, Controls, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Database,
  FileText,
  GitBranch,
  Link2,
  LockKeyhole,
  MessageSquareText,
  PackageCheck,
  PlayCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  Table2,
  TimerReset,
} from 'lucide-react';
import { Sidebar, ModuleId } from './components/Sidebar';
import {
  businessObjects,
  lifecycleGraphEdges,
  lifecycleGraphNodes,
  lifecycleTransitions,
  orderFields,
  orderMetrics,
  orderRelations,
  orderRules,
  relationGraphEdges,
  relationGraphNodes,
  ruleBlocks,
} from './data/platformMock';

type StatusTone = 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'purple';

const toneClasses: Record<StatusTone, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200',
};

function Badge({ children, tone = 'slate' }: { children: React.ReactNode; tone?: StatusTone; key?: React.Key }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string; key?: React.Key }) {
  return <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

function PanelTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function ActionButton({
  children,
  icon: Icon,
  variant = 'primary',
  onClick,
}: {
  children: React.ReactNode;
  icon?: React.ElementType;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium ${
        variant === 'primary'
          ? 'border-slate-950 bg-slate-950 text-white hover:bg-slate-800'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

const objectTabs = [
  '总览',
  '字段模型',
  '关系图谱',
  '表单视图',
  '生命周期',
  '对象动作',
  '规则约束',
  'Agent边界',
  '权限审计',
  '运行分析',
] as const;

type ObjectTab = (typeof objectTabs)[number];

type ObjectView = 'list' | 'detail';

const ruleBlockKindLabel = {
  all: '全部',
  trigger: '触发器',
  condition: '条件',
  logic: '逻辑',
  action: '动作',
} as const;

function AppHeader({ activeModule }: { activeModule: ModuleId }) {
  const labels: Record<ModuleId, string> = {
    object: '业务对象',
    ruleBlocks: '规则构件',
    agent: 'Agent业务工作台',
    knowledge: '知识库',
    analytics: '运行分析',
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-950 text-white">
          <Database className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">BizGrow Studio</p>
          <p className="text-xs text-slate-500">对象型低代码工厂业务平台</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone="green">设计环境已保存</Badge>
        <span className="text-sm font-medium text-slate-700">{labels[activeModule]}</span>
      </div>
    </header>
  );
}

function ObjectShell({
  children,
  activeTab,
  setActiveTab,
  onBack,
}: {
  children: React.ReactNode;
  activeTab: ObjectTab;
  setActiveTab: (tab: ObjectTab) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={onBack} className="font-medium text-slate-600 hover:text-slate-950">
              业务对象库
            </button>
            <ChevronRight className="h-3 w-3" />
            <span>销售交付域</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">订单 Order</h1>
            <Badge tone="blue">核心业务对象</Badge>
            <Badge tone="purple">交付承诺</Badge>
            <Badge tone="green">运行中</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton icon={ArrowRight} variant="secondary" onClick={onBack}>返回列表</ActionButton>
          <ActionButton icon={PlayCircle} variant="secondary">模拟运行</ActionButton>
          <ActionButton icon={PackageCheck}>发布变更</ActionButton>
        </div>
      </div>

      <div className="flex gap-5">
        <aside className="w-44 shrink-0">
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            {objectTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm last:mb-0 ${
                  activeTab === tab
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <span>{tab}</span>
                {activeTab === tab ? <CircleDot className="h-3 w-3" /> : null}
              </button>
            ))}
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function FlowCanvas({
  nodes,
  edges,
  className = 'h-[360px]',
}: {
  nodes: typeof relationGraphNodes;
  edges: typeof relationGraphEdges;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 bg-slate-50 ${className}`}>
      <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable={false} nodesConnectable={false} elementsSelectable>
        <Background color="#cbd5e1" gap={18} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

function ObjectConsoleContent() {
  return (
    <div className="space-y-5">
        <div className="grid grid-cols-6 gap-3">
          {orderMetrics.map(({ label, value }) => (
            <Panel key={label} className="px-4 py-3">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
            </Panel>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5">
          <Panel>
            <PanelTitle
              title="对象关系图谱"
              subtitle="关系主要来自引用字段、子表、对象动作与规则依赖，图上用于校正语义和查看影响链路。"
              action={<Badge tone="blue">自动推导 {orderRelations.length} 条</Badge>}
            />
            <div className="p-5">
              <FlowCanvas nodes={relationGraphNodes} edges={relationGraphEdges} className="h-[460px]" />

              <div className="mt-6 grid grid-cols-3 gap-3">
                {orderRelations.slice(0, 6).map((relation) => (
                  <div key={relation.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{`${relation.source} -> ${relation.target}`}</p>
                      <Badge>{relation.label}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">来源：{relation.sourceType}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <div className="space-y-5">
            <Panel>
              <PanelTitle title="对象摘要" />
              <div className="space-y-3 p-5 text-sm">
                {[
                  ['业务含义', '客户交付承诺'],
                  ['主状态字段', '订单状态'],
                  ['唯一标识', '订单编号'],
                  ['风险字段', '金额 / 交期 / 特殊要求'],
                  ['运行入口', 'Agent对话 / 销售录入视图'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <PanelTitle title="影响分析" subtitle="选中对象后的全局依赖概览" />
              <div className="space-y-3 p-5">
                {[
                  ['影响规则', '12'],
                  ['关联视图', '7'],
                  ['Agent可调用动作', '5'],
                  ['高风险字段', '3'],
                  ['最近异常', '交期变更未确认'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
    </div>
  );
}

function FieldModelContent() {
  const [selectedFieldId, setSelectedFieldId] = useState('deliveryDate');
  const selectedField = orderFields.find((field) => field.id === selectedFieldId) ?? orderFields[0];
  const fieldImpactMap: Record<string, string[]> = {
    orderNo: ['审计日志', '订单详情页', 'Agent查询上下文'],
    customer: ['客户信用', '账期规则', '老板审批视图'],
    product: ['BOM模板', '库存检查', '生产任务'],
    qty: ['物料需求', '采购建议', '产能评估'],
    deliveryDate: ['采购需求', '生产任务', '发货单', '老板审批视图'],
    amount: ['金额审批', '利润测算', '客户授信'],
    specialRequirement: ['技术确认', '订单级BOM', '知识命中'],
    status: ['生命周期', '任务中心', '运行分析'],
  };
  const selectedImpacts = fieldImpactMap[selectedField.id] ?? ['对象详情', '审计日志'];
  const selectedRules = orderRules.filter((rule) => rule.fieldIds.includes(selectedField.id));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <Panel>
          <PanelTitle
            title="字段模型"
            subtitle="字段不仅定义类型，也定义业务语义、风险等级、视图使用范围和 Agent 操作边界。"
            action={<ActionButton icon={Plus} variant="secondary">新增字段</ActionButton>}
          />
          <div className="overflow-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  {['字段名', '编码', '类型', '业务语义', '风险', 'Agent权限', '使用视图', '规则'].map((head) => (
                    <th key={head} className="border-b border-slate-200 px-4 py-3 font-medium">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orderFields.map((field) => (
                  <tr
                    key={field.id}
                    onClick={() => setSelectedFieldId(field.id)}
                    className={`cursor-pointer ${field.id === selectedField.id ? 'bg-blue-50/80 ring-1 ring-inset ring-blue-200' : 'hover:bg-slate-50'}`}
                  >
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{field.name}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{field.code}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{field.type}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{field.semantic}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                      <Badge tone={field.risk === '高' ? 'red' : field.risk === '中' ? 'amber' : 'green'}>{field.risk}</Badge>
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{field.agentPermission}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{field.views}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                      {orderRules.filter((rule) => rule.fieldIds.includes(field.id)).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelTitle title={`${selectedField.name} ${selectedField.code}`} subtitle="当前选中字段的语义与影响范围" />
          <div className="space-y-4 p-5">
            {[
              ['基础属性', [`类型：${selectedField.type}`, `编码：${selectedField.code}`, `使用：${selectedField.views}`]],
              ['业务语义', [selectedField.semantic]],
              ['风险与约束', [`风险等级：${selectedField.risk}`, `关联规则：${selectedRules.length}`]],
              ['Agent边界', [`权限：${selectedField.agentPermission}`, selectedField.agentPermission.includes('不可') ? '需人工确认' : '允许参与建议']],
              ['影响链路', selectedImpacts],
            ].map(([title, items]) => (
              <div key={title as string} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">{title as string}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(items as string[]).map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelTitle
          title="被该字段影响的规则"
          subtitle={`当前字段：${selectedField.name}，关联 ${selectedRules.length} 条规则`}
        />
        <div className="grid grid-cols-3 gap-3 p-5">
          {selectedRules.map((rule) => (
            <div key={rule.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-900">{rule.name}</span>
                </div>
                <Badge tone={rule.risk === '高' ? 'red' : rule.risk === '中' ? 'amber' : 'green'}>{rule.risk}</Badge>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <p><span className="font-medium text-slate-500">触发：</span>{rule.trigger}</p>
                <p><span className="font-medium text-slate-500">条件：</span>{rule.condition}</p>
                <p><span className="font-medium text-slate-500">动作：</span>{rule.action}</p>
                <p><span className="font-medium text-slate-500">负责人：</span>{rule.owner}</p>
              </div>
            </div>
          ))}
          {selectedRules.length === 0 ? (
            <div className="col-span-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              当前字段没有关联规则。
            </div>
          ) : null}
        </div>
      </Panel>
    </div>
  );
}

function RelationGraphContent() {
  return (
    <div className="space-y-5">
      <Panel>
        <PanelTitle
          title="关系图谱"
          subtitle="关系由字段引用、子表、对象动作和规则依赖生成；这里负责查看来源、校正语义和发现影响链路。"
          action={<Badge tone="blue">{orderRelations.length} 条关系</Badge>}
        />
        <div className="p-5">
          <FlowCanvas nodes={relationGraphNodes} edges={relationGraphEdges} className="h-[460px]" />
        </div>
      </Panel>

      <Panel>
        <PanelTitle title="关系来源" />
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              {['源对象', '目标对象', '关系', '来源'].map((head) => (
                <th key={head} className="border-b border-slate-200 px-5 py-3 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderRelations.map((relation) => (
              <tr key={relation.id} className="hover:bg-slate-50">
                <td className="border-b border-slate-100 px-5 py-3 text-slate-700">{relation.source}</td>
                <td className="border-b border-slate-100 px-5 py-3 text-slate-700">{relation.target}</td>
                <td className="border-b border-slate-100 px-5 py-3"><Badge>{relation.label}</Badge></td>
                <td className="border-b border-slate-100 px-5 py-3 text-slate-700">{relation.sourceType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function RuleConstraintsContent() {
  const [selectedRuleId, setSelectedRuleId] = useState(orderRules[0]?.id ?? '');
  const selectedRule = orderRules.find((rule) => rule.id === selectedRuleId) ?? orderRules[0];
  const selectedBlocks = ruleBlocks.filter((block) =>
    [
      selectedRule.dsl.triggerBlockId,
      ...selectedRule.dsl.conditionBlockIds,
      ...selectedRule.dsl.actionBlockIds,
    ].includes(block.id)
  );

  return (
    <div className="grid grid-cols-[380px_1fr_380px] gap-5">
      <Panel className="min-h-[680px]">
        <PanelTitle title="订单规则实例" subtitle="这里不是规则构件库，而是订单对象上已经实例化的规则。" />
        <div className="space-y-2 p-4">
          {orderRules.map((rule) => (
            <button
              key={rule.id}
              onClick={() => setSelectedRuleId(rule.id)}
              className={`w-full rounded-lg border p-3 text-left transition ${
                selectedRule.id === rule.id
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-semibold">{rule.name}</span>
                <span className={`rounded px-1.5 py-0.5 text-[10px] ${selectedRule.id === rule.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {rule.risk}
                </span>
              </div>
              <p className={`mt-2 text-xs ${selectedRule.id === rule.id ? 'text-slate-300' : 'text-slate-500'}`}>
                字段 {rule.fieldIds.length} / 动作 {rule.actionIds.length} / 流转 {rule.transitionIds.length}
              </p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelTitle title="可视化规则审核" subtitle="业务规则实例由全局规则构件组装，发布后才进入运行网关。" />
        <div className="space-y-4 p-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">规则名</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{selectedRule.name}</p>
          </div>

          <div className="grid grid-cols-[90px_1fr] gap-3">
            <div className="rounded-lg bg-slate-950 px-3 py-4 text-center text-sm font-semibold text-white">触发时机</div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{selectedRule.trigger}</p>
              <p className="mt-1 text-xs text-slate-500">构件：{selectedRule.dsl.triggerBlockId}</p>
            </div>

            <div className="rounded-lg bg-blue-600 px-3 py-4 text-center text-sm font-semibold text-white">判断条件</div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-950">{selectedRule.condition}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedRule.dsl.conditionBlockIds.map((id) => <Badge key={id} tone="blue">{id}</Badge>)}
              </div>
            </div>

            <div className="rounded-lg bg-emerald-600 px-3 py-4 text-center text-sm font-semibold text-white">执行动作</div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-950">{selectedRule.action}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedRule.dsl.actionBlockIds.map((id) => <Badge key={id} tone="green">{id}</Badge>)}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">命中位置</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs text-slate-500">字段</p>
                <p className="mt-1 font-medium text-slate-900">{selectedRule.fieldIds.join(', ') || '-'}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs text-slate-500">动作</p>
                <p className="mt-1 font-medium text-slate-900">{selectedRule.actionIds.join(', ') || '-'}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs text-slate-500">流转</p>
                <p className="mt-1 font-medium text-slate-900">{selectedRule.transitionIds.join(', ') || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelTitle title="DSL 与构件来源" subtitle="AI 只能从这些已注册构件中生成规则草稿。" />
        <div className="space-y-4 p-5">
          <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs text-slate-100">
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap">{JSON.stringify(selectedRule.dsl, null, 2)}</pre>
          </div>
          <div className="space-y-2">
            {selectedBlocks.map((block) => (
              <div key={block.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{block.name}</p>
                  <Badge tone={block.kind === 'trigger' ? 'purple' : block.kind === 'condition' ? 'blue' : block.kind === 'action' ? 'green' : 'slate'}>
                    {ruleBlockKindLabel[block.kind]}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{block.id}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function LifecycleContent() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[1fr_360px] gap-5">
        <Panel>
          <PanelTitle
            title="订单对象生命周期"
            subtitle="生命周期绑定在订单对象内，每条流转都要配置触发、条件、动作、权限和审计。"
            action={<ActionButton icon={Plus} variant="secondary">新增流转</ActionButton>}
          />
          <div className="p-5">
            <FlowCanvas nodes={lifecycleGraphNodes} edges={lifecycleGraphEdges} className="h-[360px]" />

            <div className="mt-6 grid grid-cols-2 gap-3">
              {lifecycleTransitions.slice(0, 4).map((transition) => (
                <div key={transition.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{`${transition.source} -> ${transition.target}`}</p>
                    <Badge tone={transition.tone === 'exception' ? 'red' : 'blue'}>{transition.trigger}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">触发：{transition.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">流转模拟结果：暂不可从待评审进入已确认</p>
                  <p className="mt-1 text-xs text-amber-800">
                    样例订单 OR-2026-001 金额超限未审批，特殊材料仍待技术确认。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelTitle title="流转配置" subtitle="待评审 -> 已确认 / 评审通过" />
          <div className="space-y-4 p-5">
            {[
              ['触发方式', '人工按钮 / Agent建议 / 系统规则'],
              ['前置条件', '金额审批通过、特殊材料已确认、交期风险不为高'],
              ['允许角色', '销售主管、老板'],
              ['Agent边界', '可发起建议，不可自动通过'],
              ['成功后动作', '锁定订单版本、触发库存检查、生成审计记录'],
              ['阻断后动作', '进入已挂起、创建待办'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">{label}</p>
                <p className="mt-1 text-sm text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ObjectTabPlaceholder({ tab }: { tab: ObjectTab }) {
  const descriptions: Record<ObjectTab, string> = {
    总览: '对象全局视图',
    字段模型: '语义字段配置',
    关系图谱: '关系图谱由引用字段、子表、对象动作和规则依赖自动推导，允许在这里校正关系语义。',
    表单视图: '同一个订单对象可以生成销售录入、技术确认、采购评估、生产查看、老板审批等多个角色视图。',
    生命周期: '状态生命周期绑定在订单对象内。',
    对象动作: '对象动作定义订单能被怎样操作，例如提交评审、锁定BOM、检查库存、生成采购建议。',
    规则约束: '规则约束定义字段变化、状态流转和对象动作的前置条件、阻断条件与人工确认要求。',
    Agent边界: 'Agent边界定义可读、可建议、可创建草稿、不可自动修改的字段和动作范围。',
    权限审计: '权限审计定义人和Agent的访问边界，以及每次操作如何留痕。',
    运行分析: '运行分析持续观察该对象的流转效率、异常来源、规则命中和Agent采纳情况。',
  };

  return (
    <Panel>
      <PanelTitle title={tab} subtitle={descriptions[tab]} />
      <div className="grid grid-cols-3 gap-4 p-5">
        {[
          ['配置来源', tab === '关系图谱' ? '字段 / 子表 / 动作 / 规则' : '对象定义'],
          ['当前状态', '设计中'],
          ['下一步', '补充交互与真实配置数据结构'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function renderObjectTab(tab: ObjectTab) {
  switch (tab) {
    case '总览':
      return <ObjectConsoleContent />;
    case '字段模型':
      return <FieldModelContent />;
    case '关系图谱':
      return <RelationGraphContent />;
    case '生命周期':
      return <LifecycleContent />;
    case '规则约束':
      return <RuleConstraintsContent />;
    default:
      return <ObjectTabPlaceholder tab={tab} />;
  }
}

function ObjectList({ onOpenOrder }: { onOpenOrder: () => void }) {
  const summary = [
    ['对象总数', String(businessObjects.length)],
    ['核心对象', String(businessObjects.filter((object) => object.type.includes('核心')).length)],
    ['执行对象', String(businessObjects.filter((object) => object.type.includes('执行')).length)],
    ['需治理', String(businessObjects.filter((object) => object.status === '需治理').length)],
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>设计态</span>
            <ChevronRight className="h-3 w-3" />
            <span>业务对象库</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">业务对象库</h1>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton icon={Plus} variant="secondary">新建对象</ActionButton>
          <ActionButton icon={PackageCheck}>发布对象模型</ActionButton>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {summary.map(([label, value]) => (
          <Panel key={label} className="px-4 py-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <PanelTitle
          title="对象列表"
          action={
            <div className="flex items-center gap-2">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                搜索对象
              </div>
              <Badge tone="blue">全部业务域</Badge>
              <Badge>全部类型</Badge>
            </div>
          }
        />
        <div className="overflow-hidden">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                {['对象', '类型', '业务域', '业务含义', '记录', '运行中', '健康度', '状态', '操作'].map((head) => (
                  <th key={head} className="border-b border-slate-200 px-4 py-3 font-medium">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {businessObjects.map((object) => (
                <tr key={object.id} className="hover:bg-slate-50">
                  <td className="border-b border-slate-100 px-4 py-3">
                    <div className="font-semibold text-slate-900">{object.name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{object.code}</div>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{object.type}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{object.domain}</td>
                  <td className="max-w-[520px] border-b border-slate-100 px-4 py-3 text-slate-600">{object.meaning}</td>
                  <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-900">{object.records}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{object.running}</td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{object.health}</td>
                  <td className="border-b border-slate-100 px-4 py-3">
                    <Badge tone={object.status === '需治理' ? 'amber' : 'green'}>{object.status}</Badge>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3">
                    <button
                      onClick={object.configurable ? onOpenOrder : undefined}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                        object.configurable
                          ? 'border-slate-950 bg-slate-950 text-white hover:bg-slate-800'
                          : 'border-slate-200 bg-slate-100 text-slate-400'
                      }`}
                    >
                      {object.configurable ? '进入对象' : '待完善'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function ObjectWorkspace() {
  const [activeObjectTab, setActiveObjectTab] = useState<ObjectTab>('总览');
  const [objectView, setObjectView] = useState<ObjectView>('list');

  if (objectView === 'list') {
    return <ObjectList onOpenOrder={() => setObjectView('detail')} />;
  }

  return (
    <ObjectShell
      activeTab={activeObjectTab}
      setActiveTab={setActiveObjectTab}
      onBack={() => {
        setObjectView('list');
        setActiveObjectTab('总览');
      }}
    >
      {renderObjectTab(activeObjectTab)}
    </ObjectShell>
  );
}

function AgentWorkspace() {
  const tasks = [
    ['技术主管确认材料', '赵工', '待处理', '今天 17:00'],
    ['采购评估不锈钢外壳', '李采购', '进行中', '明天 10:00'],
    ['销售补充图纸版本', '王销售', '待处理', '今天 15:00'],
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>订单</span>
            <ChevronRight className="h-3 w-3" />
            <span>OR-2026-001</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Agent 业务工作台</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="blue">当前状态：待评审</Badge>
          <Badge tone="amber">风险：中</Badge>
          <Badge tone="red">待办：3</Badge>
          <Badge tone="green">预计交付：2026-06-26</Badge>
        </div>
      </div>

      <div className="grid h-[calc(100vh-190px)] min-h-[620px] grid-cols-[330px_1fr_360px] gap-5">
        <Panel className="flex min-h-0 flex-col">
          <PanelTitle title="Agent 对话" subtitle="对话会调用对象、表单、规则和知识库" />
          <div className="flex-1 space-y-4 overflow-auto p-4">
            <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-800">
              帮我创建一张订单：华东机电，控制箱100台，下周五交付，外壳改不锈钢
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4" />
                订单 Agent
              </div>
              <ul className="space-y-2 text-xs leading-5">
                <li>已识别客户：华东机电</li>
                <li>已匹配产品模板：控制箱A型</li>
                <li>已生成订单草稿：OR-2026-001</li>
                <li>命中特殊材料规则：不锈钢外壳需技术确认</li>
                <li>需要补充：图纸版本</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <MessageSquareText className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-400">继续输入业务指令...</span>
            </div>
          </div>
        </Panel>

        <Panel className="min-h-0 overflow-auto">
          <PanelTitle
            title="动态订单表单"
            subtitle="由订单对象的字段模型、视图配置和权限边界生成。"
            action={<ActionButton icon={ClipboardCheck}>提交评审</ActionButton>}
          />
          <div className="space-y-5 p-5">
            {[
              ['基础信息', [['客户', '华东机电'], ['订单类型', '半定制'], ['订单金额', '待报价']]],
              ['产品明细', [['产品', '控制箱A型'], ['数量', '100 台'], ['BOM模板', 'V2.1']]],
              ['特殊要求', [['外壳材料', '不锈钢'], ['图纸版本', '缺失'], ['包装要求', '标准包装']]],
              ['交付承诺', [['承诺交期', '2026-06-26'], ['交期风险', '中'], ['齐套率', '76%']]],
            ].map(([section, rows]) => (
              <div key={section as string} className="rounded-lg border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                  {section as string}
                </div>
                <div className="grid grid-cols-3 gap-3 p-4">
                  {(rows as string[][]).map(([label, value]) => (
                    <label key={label} className="block">
                      <span className="text-xs font-medium text-slate-500">{label}</span>
                      <div
                        className={`mt-1 rounded-md border px-3 py-2 text-sm ${
                          value === '缺失'
                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                            : 'border-slate-200 bg-white text-slate-900'
                        }`}
                      >
                        {value}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="min-h-0 overflow-auto">
          <PanelTitle title="上下文与治理" subtitle="规则、知识命中、Agent边界和审计" />
          <div className="space-y-4 p-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">关联对象</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {['控制箱A型', 'BOM V2.1', '缺料 1项', '历史订单 3条'].map((item) => (
                  <Badge key={item} tone="blue">{item}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-800">规则命中</p>
              <ul className="mt-2 space-y-2 text-xs text-amber-900">
                <li>特殊材料需技术确认</li>
                <li>交期小于7天标记高风险</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold text-slate-500">Agent 边界</p>
              <div className="mt-2 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-600" />可创建订单草稿</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-600" />可发起技术确认</div>
                <div className="flex items-center gap-2"><LockKeyhole className="h-3 w-3 text-rose-600" />不可确认订单</div>
                <div className="flex items-center gap-2"><LockKeyhole className="h-3 w-3 text-rose-600" />不可修改金额</div>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelTitle title="生成的业务待办" />
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              {['任务', '负责人', '状态', '截止时间'].map((head) => (
                <th key={head} className="border-b border-slate-200 px-5 py-3 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task[0]} className="hover:bg-slate-50">
                {task.map((cell) => (
                  <td key={cell} className="border-b border-slate-100 px-5 py-3 text-slate-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function KnowledgeBase() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">工厂知识库</h1>
          <p className="mt-1 text-sm text-slate-500">知识库不是文档仓库，它会被对象、规则和 Agent 在业务运行时调用。</p>
        </div>
        <ActionButton icon={Plus}>新增知识</ActionButton>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          ['产品经验', '126', Brain],
          ['BOM模板', '84', Table2],
          ['替代料规则', '52', Link2],
          ['供应商能力', '38', PackageCheck],
        ].map(([title, count, Icon]) => (
          <Panel key={title as string} className="p-5">
            {React.createElement(Icon as React.ElementType, { className: 'h-5 w-5 text-slate-500' })}
            <p className="mt-4 text-sm font-semibold text-slate-900">{title as string}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{count as string}</p>
          </Panel>
        ))}
      </div>
      <Panel>
        <PanelTitle title="最近命中的知识" subtitle="这些知识会影响字段建议、规则判断和 Agent 回复。" />
        <div className="grid grid-cols-2 gap-4 p-5">
          {[
            ['不锈钢外壳需技术确认', '命中对象：订单 / 产品 / BOM', '用于特殊材料规则'],
            ['控制箱A型历史交付模板', '相似订单：3条', '用于订单级BOM草案'],
            ['供应商华南金属交期波动', '最近延期：2次', '用于采购建议排序'],
            ['客户华东机电包装偏好', '历史订单：12条', '用于发货与包装提醒'],
          ].map(([title, meta, desc]) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-2 text-xs text-slate-500">{meta}</p>
              <p className="mt-3 text-sm text-slate-700">{desc}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function RuleBlocksLibrary() {
  const [activeKind, setActiveKind] = useState<'all' | 'trigger' | 'condition' | 'logic' | 'action'>('all');
  const [selectedBlockId, setSelectedBlockId] = useState(ruleBlocks[0]?.id ?? '');
  const filteredBlocks = activeKind === 'all' ? ruleBlocks : ruleBlocks.filter((block) => block.kind === activeKind);
  const selectedBlock = ruleBlocks.find((block) => block.id === selectedBlockId) ?? filteredBlocks[0] ?? ruleBlocks[0];
  const counts = {
    trigger: ruleBlocks.filter((block) => block.kind === 'trigger').length,
    condition: ruleBlocks.filter((block) => block.kind === 'condition').length,
    logic: ruleBlocks.filter((block) => block.kind === 'logic').length,
    action: ruleBlocks.filter((block) => block.kind === 'action').length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>设计态</span>
            <ChevronRight className="h-3 w-3" />
            <span>规则 DSL 构件库</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">规则构件</h1>
          <p className="mt-1 text-sm text-slate-500">这里定义触发时机、判断条件、逻辑组合、执行动作这些通用能力，不绑定具体业务对象。</p>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton icon={Sparkles} variant="secondary">AI生成构件草稿</ActionButton>
          <ActionButton icon={Plus}>新增构件</ActionButton>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          ['触发器', counts.trigger],
          ['条件', counts.condition],
          ['逻辑', counts.logic],
          ['动作', counts.action],
        ].map(([label, value]) => (
          <Panel key={label as string} className="px-4 py-3">
            <p className="text-xs text-slate-500">{label as string}</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{String(value)}</p>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-[360px_1fr_420px] gap-5">
        <Panel className="min-h-[680px]">
          <PanelTitle
            title="构件列表"
            action={
              <div className="flex gap-1">
                {(['all', 'trigger', 'condition', 'logic', 'action'] as const).map((kind) => (
                  <button
                    key={kind}
                    onClick={() => setActiveKind(kind)}
                    className={`rounded px-2 py-1 text-xs font-medium ${activeKind === kind ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {ruleBlockKindLabel[kind]}
                  </button>
                ))}
              </div>
            }
          />
          <div className="space-y-2 p-4">
            {filteredBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  selectedBlock?.id === block.id
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold">{block.name}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${selectedBlock?.id === block.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {ruleBlockKindLabel[block.kind]}
                  </span>
                </div>
                <p className={`mt-2 text-xs ${selectedBlock?.id === block.id ? 'text-slate-300' : 'text-slate-500'}`}>{block.id}</p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelTitle title={selectedBlock?.name ?? '构件详情'} subtitle={selectedBlock?.description} />
          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-semibold text-slate-500">参数 Schema</p>
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      {['参数', '类型', '限制', '必填'].map((head) => <th key={head} className="border-b border-slate-200 px-4 py-3">{head}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedBlock?.params ?? []).map((param) => (
                      <tr key={param.name}>
                        <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-900">{param.label}</td>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{param.type}</td>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{param.accept?.join(', ') ?? '-'}</td>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{param.required ? '是' : '否'}</td>
                      </tr>
                    ))}
                    {selectedBlock?.params.length === 0 ? (
                      <tr><td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={4}>该构件无参数。</td></tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500">可视化示例</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(selectedBlock?.examples ?? []).map((example) => <Badge key={example} tone="blue">{example}</Badge>)}
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelTitle title="DSL 形状" subtitle="AI 生成业务规则实例时只能使用这些已注册构件。" />
          <div className="p-5">
            <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs text-slate-100">
              <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap">{JSON.stringify(selectedBlock?.dslShape ?? {}, null, 2)}</pre>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">对象运行分析</h1>
        <p className="mt-1 text-sm text-slate-500">持续观察对象配置是否真的支撑业务运行，而不是配置完就结束。</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          ['平均流转时长', '31.6h', TimerReset],
          ['规则阻断次数', '846', ShieldCheck],
          ['Agent采纳率', '72%', Bot],
          ['字段缺失率', '8.4%', FileText],
        ].map(([title, value, Icon]) => (
          <Panel key={title as string} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{title as string}</p>
              {React.createElement(Icon as React.ElementType, { className: 'h-4 w-4 text-slate-400' })}
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{value as string}</p>
          </Panel>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Panel>
          <PanelTitle title="最慢流转" />
          <div className="space-y-3 p-5">
            {['待评审 -> 已确认：18.2h', '缺料中 -> 生产中：42.7h', '待发货 -> 已完成：12.4h'].map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">{item}</div>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelTitle title="最常见异常" />
          <div className="space-y-3 p-5">
            {['图纸版本缺失', '交期变更未确认', '特殊材料未技术确认'].map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">{item}</div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function renderModule(activeModule: ModuleId) {
  switch (activeModule) {
    case 'object':
      return <ObjectWorkspace />;
    case 'ruleBlocks':
      return <RuleBlocksLibrary />;
    case 'agent':
      return <AgentWorkspace />;
    case 'knowledge':
      return <KnowledgeBase />;
    case 'analytics':
      return <Analytics />;
    default:
      return <ObjectWorkspace />;
  }
}

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('object');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans text-slate-950 selection:bg-blue-100">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader activeModule={activeModule} />
        <main className="min-h-0 flex-1 overflow-auto p-6">{renderModule(activeModule)}</main>
      </div>
    </div>
  );
}
