import { MarkerType, Position, type Edge, type Node } from '@xyflow/react';

export type ObjectStatus = '运行中' | '需治理';

export interface BusinessObjectMock {
  id: string;
  name: string;
  code: string;
  type: string;
  domain: string;
  meaning: string;
  records: string;
  running: string;
  health: string;
  status: ObjectStatus;
  configurable: boolean;
}

export interface ObjectFieldMock {
  id: string;
  name: string;
  code: string;
  type: string;
  semantic: string;
  risk: '低' | '中' | '高';
  agentPermission: string;
  views: string;
  ruleHits: string;
}

export interface ObjectMetricMock {
  label: string;
  value: string;
}

export interface RelationMock {
  id: string;
  source: string;
  target: string;
  label: string;
  sourceType: string;
}

export interface LifecycleTransitionMock {
  id: string;
  source: string;
  target: string;
  label: string;
  trigger: string;
  tone: 'normal' | 'system' | 'exception';
}

export interface ObjectRuleMock {
  id: string;
  name: string;
  fieldIds: string[];
  actionIds: string[];
  transitionIds: string[];
  trigger: string;
  condition: string;
  action: string;
  risk: '低' | '中' | '高';
  owner: string;
  enabled: boolean;
  dsl: {
    triggerBlockId: string;
    conditionBlockIds: string[];
    actionBlockIds: string[];
    when: Record<string, unknown>;
    then: Array<Record<string, unknown>>;
  };
}

export type RuleBlockKind = 'trigger' | 'condition' | 'logic' | 'action';

export interface RuleBlockMock {
  id: string;
  kind: RuleBlockKind;
  name: string;
  description: string;
  params: Array<{
    name: string;
    label: string;
    type: 'field' | 'number' | 'text' | 'role' | 'action' | 'state' | 'enum';
    accept?: string[];
    required?: boolean;
  }>;
  dslShape: Record<string, unknown>;
  examples: string[];
}

export const businessObjects: BusinessObjectMock[] = [
  { id: 'order', name: '订单', code: 'Order', type: '核心业务对象', domain: '销售交付域', meaning: '客户交付承诺，驱动BOM、库存、采购、生产与发货', records: '12,486', running: '327', health: '87%', status: '运行中', configurable: true },
  { id: 'customer', name: '客户', code: 'Customer', type: '主数据对象', domain: '客户域', meaning: '客户档案、信用、偏好、账期与历史合作记录', records: '2,184', running: '42', health: '91%', status: '运行中', configurable: false },
  { id: 'product', name: '产品', code: 'Product', type: '资源对象', domain: '产品域', meaning: '标准产品、产品族、变体和BOM入口', records: '816', running: '73', health: '84%', status: '运行中', configurable: false },
  { id: 'bom', name: 'BOM', code: 'BillOfMaterial', type: '结构对象', domain: '工程域', meaning: '产品结构、物料用量、替代料和订单级BOM模板', records: '1,342', running: '109', health: '79%', status: '需治理', configurable: false },
  { id: 'material', name: '物料', code: 'Material', type: '资源对象', domain: '供应链域', meaning: '采购和生产所需的基础物料、规格与替代关系', records: '6,730', running: '214', health: '82%', status: '运行中', configurable: false },
  { id: 'inventory', name: '库存', code: 'Inventory', type: '状态对象', domain: '仓储域', meaning: '可用量、冻结量、占用量、库位和库存风险', records: '9,456', running: '188', health: '76%', status: '运行中', configurable: false },
  { id: 'purchase_request', name: '采购需求', code: 'PurchaseRequest', type: '执行对象', domain: '采购域', meaning: '由缺料、补货和订单需求触发的采购建议与确认', records: '428', running: '61', health: '74%', status: '运行中', configurable: false },
  { id: 'work_order', name: '生产任务', code: 'WorkOrder', type: '执行对象', domain: '生产域', meaning: '排产、开工、报工、完工和异常处理', records: '693', running: '96', health: '81%', status: '运行中', configurable: false },
  { id: 'delivery_note', name: '发货单', code: 'DeliveryNote', type: '执行对象', domain: '物流域', meaning: '发货准备、承运、签收与交付完成确认', records: '1,028', running: '54', health: '86%', status: '运行中', configurable: false },
];

export const orderMetrics: ObjectMetricMock[] = [
  { label: '记录总数', value: '12,486' },
  { label: '运行中', value: '327' },
  { label: '异常挂起', value: '18' },
  { label: 'Agent调用', value: '2,194' },
  { label: '规则命中', value: '846' },
  { label: '对象健康度', value: '87%' },
];

export const orderFields: ObjectFieldMock[] = [
  { id: 'orderNo', name: '订单编号', code: 'orderNo', type: '文本', semantic: '交易唯一标识', risk: '低', agentPermission: '只读', views: '3个视图', ruleHits: '0' },
  { id: 'customer', name: '客户', code: 'customer', type: '引用对象', semantic: '交付对象与账期主体', risk: '中', agentPermission: '可读', views: '5个视图', ruleHits: '2' },
  { id: 'product', name: '产品', code: 'product', type: '引用对象', semantic: '交付物与BOM入口', risk: '中', agentPermission: '可读', views: '4个视图', ruleHits: '5' },
  { id: 'qty', name: '数量', code: 'qty', type: '数字', semantic: '物料需求倍数', risk: '中', agentPermission: '可建议', views: '4个视图', ruleHits: '3' },
  { id: 'deliveryDate', name: '承诺交期', code: 'deliveryDate', type: '日期', semantic: '客户交付承诺日期', risk: '高', agentPermission: '不可改', views: '6个视图', ruleHits: '7' },
  { id: 'amount', name: '订单金额', code: 'amount', type: '金额', semantic: '收入与审批风险字段', risk: '高', agentPermission: '不可改', views: '5个视图', ruleHits: '6' },
  { id: 'specialRequirement', name: '特殊要求', code: 'specialRequirement', type: '长文本', semantic: '非标约束入口', risk: '高', agentPermission: '可建议', views: '4个视图', ruleHits: '4' },
  { id: 'status', name: '订单状态', code: 'status', type: '状态', semantic: '对象生命周期主字段', risk: '中', agentPermission: '系统控制', views: '6个视图', ruleHits: '8' },
];

export const orderRules: ObjectRuleMock[] = [
  {
    id: 'rule_delivery_urgent',
    name: '交期小于7天标记高风险',
    fieldIds: ['deliveryDate', 'status'],
    actionIds: ['submitReview'],
    transitionIds: ['review_confirmed'],
    trigger: '订单提交评审 / 交期变更',
    condition: '承诺交期距当前日期小于7天',
    action: '风险等级设为高，并创建老板审批任务',
    risk: '高',
    owner: '销售主管',
    enabled: true,
    dsl: {
      triggerBlockId: 'trigger.before_action',
      conditionBlockIds: ['condition.date.days_from_now_lt'],
      actionBlockIds: ['action.set_field', 'action.create_task'],
      when: { all: [{ blockId: 'condition.date.days_from_now_lt', params: { field: 'deliveryDate', days: 7 } }] },
      then: [
        { blockId: 'action.set_field', params: { field: 'riskLevel', value: '高' } },
        { blockId: 'action.create_task', params: { role: '销售主管', title: '复核紧急交期订单' } },
      ],
    },
  },
  {
    id: 'rule_delivery_recheck',
    name: '交期变更触发重新齐套检查',
    fieldIds: ['deliveryDate', 'product', 'qty'],
    actionIds: ['saveOrder'],
    transitionIds: [],
    trigger: '承诺交期被修改',
    condition: '订单状态不为草稿',
    action: '重新计算BOM需求、库存齐套率和采购到货风险',
    risk: '中',
    owner: '计划员',
    enabled: true,
    dsl: {
      triggerBlockId: 'trigger.field_changed',
      conditionBlockIds: ['condition.field.changed', 'condition.field.neq'],
      actionBlockIds: ['action.call_agent', 'action.write_audit'],
      when: { all: [{ blockId: 'condition.field.changed', params: { field: 'deliveryDate' } }, { blockId: 'condition.field.neq', params: { field: 'status', value: '草稿' } }] },
      then: [{ blockId: 'action.call_agent', params: { agent: 'inventory-check', task: 'recalculate_shortage' } }, { blockId: 'action.write_audit', params: { level: 'info' } }],
    },
  },
  {
    id: 'rule_delivery_manager_confirm',
    name: '客户承诺日变更需销售主管确认',
    fieldIds: ['deliveryDate', 'customer'],
    actionIds: ['saveOrder'],
    transitionIds: [],
    trigger: '承诺交期向前或向后变更',
    condition: '订单已进入待评审或之后状态',
    action: '阻断自动保存，要求填写变更原因并由销售主管确认',
    risk: '高',
    owner: '销售主管',
    enabled: true,
    dsl: {
      triggerBlockId: 'trigger.field_changed',
      conditionBlockIds: ['condition.field.changed', 'condition.state.in'],
      actionBlockIds: ['action.require_approval', 'action.block_action'],
      when: { all: [{ blockId: 'condition.field.changed', params: { field: 'deliveryDate' } }, { blockId: 'condition.state.in', params: { field: 'status', values: ['待评审', '已确认', '缺料中', '生产中'] } }] },
      then: [{ blockId: 'action.require_approval', params: { role: '销售主管' } }, { blockId: 'action.block_action', params: { reason: '交期变更需确认' } }],
    },
  },
  {
    id: 'rule_amount_approval',
    name: '订单金额超限需老板审批',
    fieldIds: ['amount', 'customer'],
    actionIds: ['confirmOrder', 'submitReview'],
    transitionIds: ['review_confirmed'],
    trigger: '订单提交评审',
    condition: '订单金额大于100000或客户信用等级低于B',
    action: '插入老板审批节点，Agent只能生成风险说明',
    risk: '高',
    owner: '老板',
    enabled: true,
    dsl: {
      triggerBlockId: 'trigger.before_action',
      conditionBlockIds: ['condition.number.gt', 'logic.any'],
      actionBlockIds: ['action.require_approval', 'action.block_action'],
      when: { any: [{ blockId: 'condition.number.gt', params: { field: 'amount', value: 100000 } }, { blockId: 'condition.field.lt', params: { field: 'customer.creditLevel', value: 'B' } }] },
      then: [{ blockId: 'action.require_approval', params: { role: '老板' } }, { blockId: 'action.block_action', params: { reason: '金额或信用风险' } }],
    },
  },
  {
    id: 'rule_amount_modify',
    name: '金额字段修改必须记录原因',
    fieldIds: ['amount'],
    actionIds: ['saveOrder'],
    transitionIds: [],
    trigger: '订单金额被修改',
    condition: '订单已保存或已提交评审',
    action: '要求填写修改原因，写入审计日志',
    risk: '中',
    owner: '财务',
    enabled: true,
    dsl: {
      triggerBlockId: 'trigger.field_changed',
      conditionBlockIds: ['condition.field.changed', 'condition.field.neq'],
      actionBlockIds: ['action.require_reason', 'action.write_audit'],
      when: { all: [{ blockId: 'condition.field.changed', params: { field: 'amount' } }, { blockId: 'condition.field.neq', params: { field: 'status', value: '草稿' } }] },
      then: [{ blockId: 'action.require_reason', params: { field: 'amount' } }, { blockId: 'action.write_audit', params: { level: 'warning' } }],
    },
  },
  {
    id: 'rule_special_material',
    name: '特殊材料需技术确认',
    fieldIds: ['specialRequirement', 'product'],
    actionIds: ['submitReview', 'confirmOrder'],
    transitionIds: ['review_confirmed'],
    trigger: '特殊要求包含材料、结构或工艺变更',
    condition: '知识库命中特殊材料或非标工艺',
    action: '创建技术确认任务，订单保持待评审',
    risk: '高',
    owner: '技术主管',
    enabled: true,
    dsl: {
      triggerBlockId: 'trigger.before_action',
      conditionBlockIds: ['condition.knowledge_hit'],
      actionBlockIds: ['action.create_task', 'action.block_action'],
      when: { all: [{ blockId: 'condition.knowledge_hit', params: { sourceField: 'specialRequirement', category: '特殊材料' } }] },
      then: [{ blockId: 'action.create_task', params: { role: '技术主管', title: '确认特殊材料' } }, { blockId: 'action.block_action', params: { reason: '特殊材料未确认' } }],
    },
  },
  {
    id: 'rule_qty_inventory',
    name: '数量变更触发库存占用重算',
    fieldIds: ['qty', 'product'],
    actionIds: ['saveOrder'],
    transitionIds: [],
    trigger: '订单数量变更',
    condition: '产品已绑定BOM模板',
    action: '重新展开物料需求并刷新缺料清单',
    risk: '中',
    owner: '计划员',
    enabled: true,
    dsl: {
      triggerBlockId: 'trigger.field_changed',
      conditionBlockIds: ['condition.field.changed', 'condition.related.exists'],
      actionBlockIds: ['action.call_agent', 'action.write_audit'],
      when: { all: [{ blockId: 'condition.field.changed', params: { field: 'qty' } }, { blockId: 'condition.related.exists', params: { relation: 'product.bom' } }] },
      then: [{ blockId: 'action.call_agent', params: { agent: 'inventory-check', task: 'expand_bom' } }, { blockId: 'action.write_audit', params: { level: 'info' } }],
    },
  },
  {
    id: 'rule_status_audit',
    name: '关键状态流转必须留痕',
    fieldIds: ['status'],
    actionIds: ['transitionState'],
    transitionIds: ['review_confirmed', 'any_hold', 'delivery_done'],
    trigger: '订单状态发生流转',
    condition: '状态进入已确认、已挂起、已完成',
    action: '记录触发人、触发方式、规则命中和上下文快照',
    risk: '中',
    owner: '系统',
    enabled: true,
    dsl: {
      triggerBlockId: 'trigger.before_transition',
      conditionBlockIds: ['condition.state.in'],
      actionBlockIds: ['action.write_audit'],
      when: { all: [{ blockId: 'condition.state.in', params: { field: 'status', values: ['已确认', '已挂起', '已完成'] } }] },
      then: [{ blockId: 'action.write_audit', params: { level: 'info', includeSnapshot: true } }],
    },
  },
  {
    id: 'rule_customer_credit',
    name: '客户信用不足阻断确认订单',
    fieldIds: ['customer', 'amount'],
    actionIds: ['confirmOrder'],
    transitionIds: ['review_confirmed'],
    trigger: '订单评审通过前',
    condition: '客户信用等级低于B且订单金额大于50000',
    action: '阻断进入已确认状态，创建风控复核任务',
    risk: '高',
    owner: '风控',
    enabled: true,
    dsl: {
      triggerBlockId: 'trigger.before_transition',
      conditionBlockIds: ['condition.field.lt', 'condition.number.gt', 'logic.all'],
      actionBlockIds: ['action.create_task', 'action.block_action'],
      when: { all: [{ blockId: 'condition.field.lt', params: { field: 'customer.creditLevel', value: 'B' } }, { blockId: 'condition.number.gt', params: { field: 'amount', value: 50000 } }] },
      then: [{ blockId: 'action.create_task', params: { role: '风控', title: '复核客户信用风险' } }, { blockId: 'action.block_action', params: { reason: '客户信用不足' } }],
    },
  },
];

export const ruleBlocks: RuleBlockMock[] = [
  {
    id: 'trigger.before_action',
    kind: 'trigger',
    name: '动作执行前',
    description: '在对象动作真正执行前运行规则，例如确认订单、提交评审、生成采购建议。',
    params: [{ name: 'actionId', label: '对象动作', type: 'action', required: true }],
    dslShape: { trigger: { type: 'before_action', actionId: '$actionId' } },
    examples: ['确认订单前', '提交评审前'],
  },
  {
    id: 'trigger.field_changed',
    kind: 'trigger',
    name: '字段变更时',
    description: '当指定字段发生变化时运行规则。',
    params: [{ name: 'field', label: '字段', type: 'field', required: true }],
    dslShape: { trigger: { type: 'field_changed', field: '$field' } },
    examples: ['金额被修改', '交期被修改'],
  },
  {
    id: 'trigger.before_transition',
    kind: 'trigger',
    name: '状态流转前',
    description: '在对象生命周期从一个状态流向另一个状态前运行规则。',
    params: [{ name: 'transitionId', label: '状态流转', type: 'state', required: true }],
    dslShape: { trigger: { type: 'before_transition', transitionId: '$transitionId' } },
    examples: ['待评审 -> 已确认'],
  },
  {
    id: 'condition.number.gt',
    kind: 'condition',
    name: '数字大于',
    description: '判断数字或金额字段是否大于指定值。',
    params: [{ name: 'field', label: '字段', type: 'field', accept: ['number', 'money'], required: true }, { name: 'value', label: '阈值', type: 'number', required: true }],
    dslShape: { op: 'gt', field: '$field', value: '$value' },
    examples: ['订单金额 > 100000'],
  },
  {
    id: 'condition.date.days_from_now_lt',
    kind: 'condition',
    name: '日期距今天小于N天',
    description: '判断日期字段距离当前日期是否小于指定天数。',
    params: [{ name: 'field', label: '日期字段', type: 'field', accept: ['date'], required: true }, { name: 'days', label: '天数', type: 'number', required: true }],
    dslShape: { op: 'days_from_now_lt', field: '$field', days: '$days' },
    examples: ['承诺交期距今天 < 7天'],
  },
  {
    id: 'condition.field.changed',
    kind: 'condition',
    name: '字段发生变化',
    description: '判断当前提交是否修改了某个字段。',
    params: [{ name: 'field', label: '字段', type: 'field', required: true }],
    dslShape: { op: 'changed', field: '$field' },
    examples: ['订单金额发生变化'],
  },
  {
    id: 'condition.knowledge_hit',
    kind: 'condition',
    name: '知识库命中',
    description: '使用字段内容检索知识库，判断是否命中特定知识分类。',
    params: [{ name: 'sourceField', label: '来源字段', type: 'field', required: true }, { name: 'category', label: '知识分类', type: 'text', required: true }],
    dslShape: { op: 'knowledge_hit', sourceField: '$sourceField', category: '$category' },
    examples: ['特殊要求命中特殊材料'],
  },
  {
    id: 'logic.all',
    kind: 'logic',
    name: '全部满足',
    description: '所有子条件都满足时通过。',
    params: [],
    dslShape: { all: [] },
    examples: ['A 且 B'],
  },
  {
    id: 'logic.any',
    kind: 'logic',
    name: '任一满足',
    description: '任意子条件满足时通过。',
    params: [],
    dslShape: { any: [] },
    examples: ['A 或 B'],
  },
  {
    id: 'action.set_field',
    kind: 'action',
    name: '设置字段',
    description: '将目标字段设置为指定值。',
    params: [{ name: 'field', label: '目标字段', type: 'field', required: true }, { name: 'value', label: '值', type: 'text', required: true }],
    dslShape: { type: 'set_field', field: '$field', value: '$value' },
    examples: ['风险等级设为高'],
  },
  {
    id: 'action.create_task',
    kind: 'action',
    name: '创建任务',
    description: '给指定角色创建待办任务。',
    params: [{ name: 'role', label: '角色', type: 'role', required: true }, { name: 'title', label: '任务标题', type: 'text', required: true }],
    dslShape: { type: 'create_task', role: '$role', title: '$title' },
    examples: ['创建技术确认任务'],
  },
  {
    id: 'action.require_approval',
    kind: 'action',
    name: '要求审批',
    description: '阻断当前动作并要求指定角色审批。',
    params: [{ name: 'role', label: '审批角色', type: 'role', required: true }],
    dslShape: { type: 'require_approval', role: '$role' },
    examples: ['需要老板审批'],
  },
  {
    id: 'action.block_action',
    kind: 'action',
    name: '阻断动作',
    description: '阻断当前保存、动作或状态流转。',
    params: [{ name: 'reason', label: '阻断原因', type: 'text', required: true }],
    dslShape: { type: 'block_action', reason: '$reason' },
    examples: ['特殊材料未确认，阻断确认订单'],
  },
  {
    id: 'action.write_audit',
    kind: 'action',
    name: '写审计',
    description: '记录规则命中、上下文快照和操作结果。',
    params: [{ name: 'level', label: '审计级别', type: 'enum', required: true }],
    dslShape: { type: 'write_audit', level: '$level' },
    examples: ['记录金额修改原因'],
  },
  {
    id: 'action.call_agent',
    kind: 'action',
    name: '调用Agent',
    description: '调用受控 Agent 执行建议、重算或任务生成。',
    params: [{ name: 'agent', label: 'Agent', type: 'text', required: true }, { name: 'task', label: '任务', type: 'text', required: true }],
    dslShape: { type: 'call_agent', agent: '$agent', task: '$task' },
    examples: ['调用库存检查Agent重新齐套'],
  },
];

export const orderRelations: RelationMock[] = [
  { id: 'r_customer_order', source: 'customer', target: 'order', label: '下达', sourceType: '客户引用字段' },
  { id: 'r_order_line', source: 'order', target: 'order_line', label: '包含', sourceType: '订单明细子表' },
  { id: 'r_line_product', source: 'order_line', target: 'product', label: '引用', sourceType: '产品引用字段' },
  { id: 'r_product_bom', source: 'product', target: 'bom', label: '展开', sourceType: '产品对象动作' },
  { id: 'r_bom_material', source: 'bom', target: 'material', label: '消耗', sourceType: 'BOM结构行' },
  { id: 'r_material_inventory', source: 'material', target: 'inventory', label: '记录', sourceType: '库存引用物料' },
  { id: 'r_inventory_pr', source: 'inventory', target: 'purchase_request', label: '触发', sourceType: '库存不足规则' },
  { id: 'r_order_work', source: 'order', target: 'work_order', label: '生成', sourceType: '确认订单动作' },
  { id: 'r_work_delivery', source: 'work_order', target: 'delivery_note', label: '生成', sourceType: '生产完工动作' },
  { id: 'r_delivery_ar', source: 'delivery_note', target: 'receivable', label: '生成', sourceType: '客户签收规则' },
];

export const relationGraphNodes: Node[] = [
  { id: 'customer', position: { x: 0, y: 130 }, data: { label: '客户' }, type: 'input', sourcePosition: Position.Right },
  { id: 'order', position: { x: 230, y: 130 }, data: { label: '订单' }, sourcePosition: Position.Right, targetPosition: Position.Left, style: { borderColor: '#0f172a', background: '#0f172a', color: '#fff', fontWeight: 700 } },
  { id: 'order_line', position: { x: 460, y: 130 }, data: { label: '订单明细' }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'product', position: { x: 690, y: 130 }, data: { label: '产品' }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'bom', position: { x: 920, y: 130 }, data: { label: 'BOM' }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'material', position: { x: 1150, y: 130 }, data: { label: '物料' }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'inventory', position: { x: 1380, y: 130 }, data: { label: '库存' }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'purchase_request', position: { x: 1610, y: 20 }, data: { label: '采购需求' }, type: 'output', targetPosition: Position.Left },
  { id: 'work_order', position: { x: 460, y: 360 }, data: { label: '生产任务' }, type: 'output', sourcePosition: Position.Right, targetPosition: Position.Top },
  { id: 'delivery_note', position: { x: 690, y: 360 }, data: { label: '发货单' }, type: 'output', sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: 'receivable', position: { x: 920, y: 360 }, data: { label: '应收款' }, type: 'output', targetPosition: Position.Left },
];

export const relationGraphEdges: Edge[] = orderRelations.map((relation) => ({
  id: relation.id,
  source: relation.source,
  target: relation.target,
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { stroke: '#64748b', strokeWidth: 1.6 },
}));

export const lifecycleTransitions: LifecycleTransitionMock[] = [
  { id: 'draft_review', source: 'draft', target: 'review', label: '提交订单', trigger: '人工按钮', tone: 'normal' },
  { id: 'review_confirmed', source: 'review', target: 'confirmed', label: '评审通过', trigger: '人工按钮 / Agent建议', tone: 'normal' },
  { id: 'confirmed_shortage', source: 'confirmed', target: 'shortage', label: '库存不足', trigger: '系统规则', tone: 'system' },
  { id: 'confirmed_production', source: 'confirmed', target: 'production', label: '齐套通过', trigger: '系统规则', tone: 'system' },
  { id: 'shortage_production', source: 'shortage', target: 'production', label: '采购到货', trigger: '规则校验', tone: 'system' },
  { id: 'production_delivery', source: 'production', target: 'delivery', label: '生产完工', trigger: '系统回写', tone: 'normal' },
  { id: 'delivery_done', source: 'delivery', target: 'done', label: '客户签收', trigger: '人工确认', tone: 'normal' },
  { id: 'review_hold', source: 'review', target: 'hold', label: '规则阻断', trigger: '异常流转', tone: 'exception' },
  { id: 'confirmed_hold', source: 'confirmed', target: 'hold', label: '人工挂起', trigger: '异常流转', tone: 'exception' },
  { id: 'shortage_hold', source: 'shortage', target: 'hold', label: '采购异常', trigger: '异常流转', tone: 'exception' },
];

export const lifecycleGraphNodes: Node[] = [
  { id: 'draft', position: { x: 0, y: 120 }, data: { label: '草稿' }, type: 'input' },
  { id: 'review', position: { x: 170, y: 120 }, data: { label: '待评审' } },
  { id: 'confirmed', position: { x: 340, y: 120 }, data: { label: '已确认' } },
  { id: 'shortage', position: { x: 510, y: 40 }, data: { label: '缺料中' } },
  { id: 'production', position: { x: 690, y: 120 }, data: { label: '生产中' } },
  { id: 'delivery', position: { x: 860, y: 120 }, data: { label: '待发货' } },
  { id: 'done', position: { x: 1030, y: 120 }, data: { label: '已完成' }, type: 'output' },
  { id: 'hold', position: { x: 510, y: 240 }, data: { label: '已挂起' }, type: 'output' },
];

export const lifecycleGraphEdges: Edge[] = lifecycleTransitions.map((transition) => ({
  id: transition.id,
  source: transition.source,
  target: transition.target,
  label: transition.label,
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed },
  style: {
    stroke: transition.tone === 'exception' ? '#e11d48' : transition.tone === 'system' ? '#2563eb' : '#64748b',
    strokeWidth: transition.tone === 'exception' ? 2 : 1.6,
  },
  labelStyle: {
    fill: transition.tone === 'exception' ? '#be123c' : '#475569',
    fontSize: 11,
    fontWeight: 600,
  },
}));
