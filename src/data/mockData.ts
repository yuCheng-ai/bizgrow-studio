import { OntologyConcept, BusinessObject, Relation, State, ProcessNode, Rule, Agent, Task, AuditEvent } from '../types';

export const mockOntologies: OntologyConcept[] = [
  { id: 'ont_1', name: '客户 (Customer)', type: '参与者 (Actor)', description: '发起业务需求的外部实体或企业', attributes: ['身份标识', '信用等级', '联系方式', '历史贡献度'], actions: ['发起需求', '确认交付', '结算货款'], relations: ['拥有 -> 订单'] },
  { id: 'ont_2', name: '订单 (Order)', type: '主业务对象 (Core Entity)', description: '客户需求转化后的正式业务承诺', attributes: ['客户引用', '产品明细', '交付期限', '总金额', '生命周期状态'], actions: ['提交评审', '确认订单', '关闭订单'], relations: ['包含 -> 订单明细'] },
  { id: 'ont_3', name: '产品 (Product)', type: '资源 (Resource)', description: '企业向客户提供的标准或定制化交付物', attributes: ['产品规格', '单价', 'BOM引用'], actions: ['上下架', '版本控制'], relations: ['关联 -> BOM'] },
  { id: 'ont_4', name: 'BOM (Bill of Materials)', type: '结构规范 (Structure)', description: '产品制造所需的基础物料清单', attributes: ['版本号', '展开层级', '替代料规则'], actions: ['生效', '停用'], relations: ['拆解 -> 物料'] },
  { id: 'ont_5', name: '物料 (Material)', type: '资源 (Resource)', description: '组织生产和采购的基础件', attributes: ['物料编码', '分类', '安全库存量'], actions: ['采购入库', '生产领用'], relations: ['影响 -> 库存'] },
  { id: 'ont_6', name: '库存 (Inventory)', type: '状态资源 (Stateful Resource)', description: '物料或产品的当前可用数量与位置', attributes: ['可用数量', '冻结数量', '库位'], actions: ['入库', '出库', '锁定'], relations: ['触发 -> 采购需求'] },
  { id: 'ont_7', name: '采购需求 (Purchase Request)', type: '执行单据 (Execution Document)', description: '面向供应商的物料短缺寻源要求', attributes: ['缺料清单', '建议供应商', '期望到货日期'], actions: ['审核', '下达采购单'], relations: ['推动 -> 生产任务'] },
  { id: 'ont_8', name: '生产任务 (Work Order)', type: '执行单据 (Execution Document)', description: '车间制造的调度执行实体', attributes: ['生产批次', '工艺路线', '投产进度'], actions: ['下达', '报工', '完工入库'], relations: ['触发 -> 发货单'] },
  { id: 'ont_9', name: '发货单 (Delivery Note)', type: '物流单据 (Logistics Document)', description: '面向客户的实物交付凭证', attributes: ['物流承运商', '运单号', '签收状态'], actions: ['发运', '签收'], relations: ['生成 -> 应收款'] },
  { id: 'ont_10', name: '应收款 (Receivable)', type: '财务凭证 (Financial Voucher)', description: '业务产生的资金回款权利', attributes: ['账期', '待核金额', '逾期状态'], actions: ['认领汇款', '核销'], relations: ['关联回 -> 客户'] }
];

export const mockObjects: BusinessObject[] = [
  {
    id: 'obj_1',
    name: '订单 (Order)',
    code: 'ORD',
    ontologyConcept: '订单 (Order)',
    businessMeaning: '承载对客户的正式商业承诺，是供应链运转的第一驱动力',
    lifecycleStates: ['草稿', '待评审', '已确认', '执行中', '已发货', '已完成', '已取消', '已阻塞'],
    relatedObjects: ['客户', '订单明细'],
    triggerableEvents: ['订单金额超限', '交期变更', '客户信用降级'],
    executableActions: ['提交评审', '修改交期', '异常挂起', '发货确认'],
    agentOperableScope: ['读取订单全量信息', '更新风险等级', '生成评审建议'],
    fields: [
      { id: 'f_1', name: '订单编号', code: 'orderNo', type: 'string', required: true, unique: true, description: '唯一标识' },
      { id: 'f_2', name: '客户ID', code: 'customerId', type: 'relation', required: true, unique: false, description: '关联客户' },
      { id: 'f_3', name: '订单总额', code: 'totalAmount', type: 'number', required: true, unique: false, description: '结算总价' },
      { id: 'f_4', name: '承诺交期', code: 'deliveryDate', type: 'date', required: true, unique: false, description: '交付底线时间' },
      { id: 'f_5', name: '当前状态', code: 'status', type: 'enum', required: true, unique: false, description: '流转状态' },
    ]
  },
  {
    id: 'obj_2',
    name: '订单明细 (Order Line)',
    code: 'ORD_LINE',
    ontologyConcept: '订单明细 (Order Line)',
    businessMeaning: '订单中包含的具体产品及数量交付要求',
    lifecycleStates: ['待分配资源', '齐套可用', '生产中', '已出库'],
    relatedObjects: ['订单', '产品'],
    triggerableEvents: ['明细缺料', '单项取消'],
    executableActions: ['拆解为生产BOM'],
    agentOperableScope: ['查询绑定产品BOM'],
    fields: [
      { id: 'f_21', name: '所属订单', code: 'orderId', type: 'relation', required: true, unique: false, description: '' },
      { id: 'f_22', name: '产品ID', code: 'productId', type: 'relation', required: true, unique: false, description: '' },
      { id: 'f_23', name: '需求数量', code: 'quantity', type: 'number', required: true, unique: false, description: '' },
    ]
  },
  {
    id: 'obj_3',
    name: '客户 (Customer)',
    code: 'CUST',
    ontologyConcept: '客户 (Customer)',
    businessMeaning: '交易履约的最终接收方及付款方',
    lifecycleStates: ['潜在', '活跃', '冻结', '流失'],
    relatedObjects: ['订单', '应收款'],
    triggerableEvents: ['信用额度耗尽', '等级提升'],
    executableActions: ['冻结交易权', '提升授信'],
    agentOperableScope: ['读取近期履约记录', '输出风险评分'],
    fields: [
      { id: 'f_31', name: '客户名称', code: 'name', type: 'string', required: true, unique: false, description: '' },
      { id: 'f_32', name: '信用等级', code: 'creditLevel', type: 'enum', required: true, unique: false, description: '' },
    ]
  },
  {
    id: 'obj_4',
    name: '产品 (Product)',
    code: 'PROD',
    ontologyConcept: '产品 (Product)',
    businessMeaning: '可供销售的标准或定制输出物',
    lifecycleStates: ['研发中', '可售', '停产'],
    relatedObjects: ['订单明细', 'BOM'],
    triggerableEvents: ['BOM版本升级'],
    executableActions: ['设定默认BOM'],
    agentOperableScope: ['读取基本参数'],
    fields: [
      { id: 'f_41', name: '产品型号', code: 'model', type: 'string', required: true, unique: true, description: '' },
      { id: 'f_42', name: '单价', code: 'unitPrice', type: 'number', required: true, unique: false, description: '' },
    ]
  },
  {
    id: 'obj_5',
    name: '物料 (Material)',
    code: 'MAT',
    ontologyConcept: '物料 (Material)',
    businessMeaning: '采购和生产消耗的最小物理单元',
    lifecycleStates: ['正常可用', '淘汰预警', '禁止使用'],
    relatedObjects: ['BOM', '库存', '采购需求'],
    triggerableEvents: ['停产通知'],
    executableActions: ['更新安全库存量'],
    agentOperableScope: ['查询最新采购价', '预测交期'],
    fields: [
      { id: 'f_51', name: '物料编码', code: 'matCode', type: 'string', required: true, unique: true, description: '' },
      { id: 'f_52', name: '安全库存', code: 'safeQty', type: 'number', required: true, unique: false, description: '' },
    ]
  },
  {
    id: 'obj_6',
    name: '采购需求 (Purchase Request)',
    code: 'PR',
    ontologyConcept: '采购需求 (Purchase Request)',
    businessMeaning: '为补齐缺料产生的内部请购动作据点',
    lifecycleStates: ['待寻源', '审批中', '已转PO', '已关闭'],
    relatedObjects: ['物料', '库存', '生产任务'],
    triggerableEvents: ['预测延期', '金额超预算'],
    executableActions: ['推荐供应商', '转采购单'],
    agentOperableScope: ['全量读写', '生成寻源组合方案'],
    fields: [
      { id: 'f_61', name: '请购清单', code: 'items', type: 'subtable', required: true, unique: false, description: '' },
      { id: 'f_62', name: '建议总金额', code: 'estAmount', type: 'number', required: false, unique: false, description: '' },
    ]
  },
  {
    id: 'obj_7',
    name: '生产任务 (Work Order)',
    code: 'WO',
    ontologyConcept: '生产任务 (Work Order)',
    businessMeaning: '车间加工制造的指令包',
    lifecycleStates: ['待排程', '缺料等待', '加工中', '已完工'],
    relatedObjects: ['订单', '物料'],
    triggerableEvents: ['良率异常', '设备宕机'],
    executableActions: ['下达产线', '报工验收'],
    agentOperableScope: ['规划排程', '异常停线建议'],
    fields: [
      { id: 'f_71', name: '排产数量', code: 'qty', type: 'number', required: true, unique: false, description: '' },
      { id: 'f_72', name: '完工进度', code: 'progress', type: 'number', required: true, unique: false, description: '' },
    ]
  }
];

export const mockRelations: Relation[] = [
  { id: 'r_1', source: '客户', target: '订单', type: '拥有', description: '客户发出购买需求，拥有该订单' },
  { id: 'r_2', source: '订单', target: '订单明细', type: '包含', description: '订单结构化拆分为多项交付明细' },
  { id: 'r_3', source: '订单明细', target: '产品', type: '引用', description: '明细项指向企业产品主数据' },
  { id: 'r_4', source: '产品', target: 'BOM', type: '关联', description: '产品通过BOM确定制造配方' },
  { id: 'r_5', source: 'BOM', target: '物料', type: '拆解', description: 'BOM将产品拆解为基础可采购物料' },
  { id: 'r_6', source: '物料', target: '库存', type: '影响', description: '物料库存水位变化决定供需健康度' },
  { id: 'r_7', source: '库存不足', target: '采购需求', type: '触发', description: '低于安全库存通过计算触发补货' },
  { id: 'r_8', source: '采购到货', target: '生产任务', type: '推动', description: '物料齐套后通知生产调度执行' },
  { id: 'r_9', source: '生产完成', target: '发货单', type: '触发', description: '产成品入库后流转至物流发运环节' },
  { id: 'r_10', source: '发货完成', target: '应收款', type: '生成', description: '物流履约结束生成财务结算单据' }
];

export const mockStates: State[] = [
  { id: 's_1', name: '草稿', type: 'start', allowedActions: ['提交评审', '作废'], enterCondition: '初始创建记录', leaveValidation: '必填字段(客户/明细/交期)完整', roles: ['销售代表'], timeoutPolicy: '无定长超时' },
  { id: 's_2', name: '待评审', type: 'normal', allowedActions: ['通过', '退回修改'], enterCondition: '用户触发表单提交', leaveValidation: '利润率红线校验通过, 客户信用需合规', roles: ['评审Agent', '业务主管'], timeoutPolicy: '超4小时未评审触发升级警告' },
  { id: 's_3', name: '已确认', type: 'normal', allowedActions: ['开始执行', '申请变更'], enterCondition: '评审通过，业务锁定', leaveValidation: '锁定当前BOM版本与库存快照', roles: ['系统集成'], timeoutPolicy: '无' },
  { id: 's_4', name: '执行中', type: 'normal', allowedActions: ['标记已发货', '异常挂起'], enterCondition: '关联生产任务或采购全部下达', leaveValidation: '需绑定关联的发货物理单据号', roles: ['车间主管', '物流中心'], timeoutPolicy: '基于承诺交期倒推预警' },
  { id: 's_5', name: '已发货', type: 'normal', allowedActions: ['客户签收确认'], enterCondition: '物流单据出库扫描', leaveValidation: '回传签收证明', roles: ['客户', '系统接口'], timeoutPolicy: '超7天未签收触发催收' },
  { id: 's_6', name: '已完成', type: 'end', allowedActions: ['生成应收'], enterCondition: '客户签收闭环', leaveValidation: '终态不可逆转', roles: ['系统驻留'], timeoutPolicy: '无' },
  { id: 's_7', name: '已取消', type: 'exception', allowedActions: ['重新激活'], enterCondition: '用户主动终止或长时间超时', leaveValidation: '释放占用的库存配额', roles: ['业务代表', '主管'], timeoutPolicy: '无' },
  { id: 's_8', name: '已阻塞', type: 'exception', allowedActions: ['排除障碍恢复'], enterCondition: '由于外部原因(如供应链断裂)导致中断', leaveValidation: '确认供应链或资源已恢复', roles: ['供应链经理'], timeoutPolicy: '预警倒计时挂起' },
  { id: 's_9', name: '需要人工确认', type: 'exception', allowedActions: ['人工放行', '人工驳回'], enterCondition: '触发Agent边界防御规则', leaveValidation: '获得主管级权限授权签字', roles: ['部门经理', '风控专员'], timeoutPolicy: '立刻派发Task进行强提醒' },
];

export const mockProcessNodes: ProcessNode[] = [
  { id: 'p_1', name: '创建订单', type: 'human', input: '客户需求草稿', output: '标准化订单对象', executor: '销售代表', condition: '-', failureAction: '重新编辑与保存', needManualConfirm: false },
  { id: 'p_2', name: '订单评审', type: 'agent', input: '订单, 客户信用, 利润率预估', output: '风险标识, 评审意见', executor: '订单评审 Agent', condition: '无硬性规则阻挡', failureAction: '降级为全人工审批转交', needManualConfirm: true },
  { id: 'p_3', name: '技术确认', type: 'human', input: '评审后的订单明细', output: '图纸与BOM锁定版', executor: '研发工程师', condition: '需定制化设计', failureAction: '退回销售沟通', needManualConfirm: false },
  { id: 'p_4', name: '库存检查', type: 'system', input: '被锁定的BOM + 实时库存可用量', output: '齐套率, 缺料清单', executor: '供应链ERP服务', condition: '-', failureAction: '触发系统异常堆栈报警', needManualConfirm: false },
  { id: 'p_5', name: '是否缺料', type: 'condition', input: '缺料清单数组', output: 'TRUE/FALSE 分支路由', executor: '分支网关', condition: '缺料项目数 > 0 ?', failureAction: '-', needManualConfirm: false },
  { id: 'p_6', name: '生成采购建议', type: 'agent', input: '缺料清单, 供应商画像档案', output: '优选供应商方案(PR单)', executor: '采购建议 Agent', condition: '分支为 TRUE', failureAction: '生成空白草稿转交人工寻源', needManualConfirm: false },
  { id: 'p_7', name: '创建生产任务', type: 'system', input: '补齐后的物料计划', output: '排产工单(WO)', executor: 'MES生产执行系统', condition: '库存齐套 或 采购到位', failureAction: '任务挂起等待运维', needManualConfirm: false },
  { id: 'p_8', name: '发货提醒', type: 'agent', input: '工单完工信号, 客户提货要求', output: '物流约车指令, 邮件推行', executor: '发货提醒 Agent', condition: '生产进度=100%', failureAction: '打印警报至大屏', needManualConfirm: false },
  { id: 'p_9', name: '完成订单', type: 'system', input: '客户回执电子签', output: '状态迁移至【已完成】', executor: '规则引擎底座', condition: '物流履约结束', failureAction: '系统重试回调', needManualConfirm: false },
];

export const mockRules: Rule[] = [
  { id: 'rl_1', name: '智能补货触发规则', whenEvent: '订单已确认', ifCondition: '库存可用量 < 订单需求量 (库存不足)', thenAction: '生成采购建议并通知采购 Agent', riskLevel: 'low', enabled: true, relatedObjects: ['订单', '库存', '采购需求'], relatedAgent: '采购建议 Agent' },
  { id: 'rl_2', name: '大额订单提级审批', whenEvent: '订单提交评审', ifCondition: '订单总金额 > 100000', thenAction: '在评审流程中增加【公司老板审批】节点', riskLevel: 'medium', enabled: true, relatedObjects: ['订单'], relatedAgent: '订单评审 Agent' },
  { id: 'rl_3', name: '高危交期预警', whenEvent: '订单每日巡检 / 交期变化', ifCondition: '承诺交期距今 < 7天 AND 仍有物料库存不足', thenAction: '标记订单风险等级为【高风险】', riskLevel: 'high', enabled: true, relatedObjects: ['订单', '库存'], relatedAgent: '订单评审 Agent' },
  { id: 'rl_4', name: '供应商违约预防', whenEvent: '供应商连续两次交期延期', ifCondition: '当前订单的缺料项恰好依赖该黑名单供应商', thenAction: '撤销上一次建议，强提醒采购 Agent 重新推荐次优供应商', riskLevel: 'medium', enabled: true, relatedObjects: ['物料', '供应商'], relatedAgent: '采购建议 Agent' },
  { id: 'rl_5', name: '核心字段防篡改网关', whenEvent: 'Agent 执行更新操作准备修改关键字段', ifCondition: '字段属于 (金额类, 承诺交期, 客户信用等级)', thenAction: '拦截自动保存，冻结当前上下文，发布【必须人工确认】防篡改任务', riskLevel: 'high', enabled: true, relatedObjects: ['订单', '客户'], relatedAgent: '所有业务 Agent' }
];

export const mockAgents: Agent[] = [
  {
    id: 'ag_ord_01',
    name: '订单评审 Agent',
    description: '负责订单初始状态下的全维评审审查，评估利润率和接单可行性。',
    targetObjects: ['订单', '客户'],
    readAccess: ['历史合作记录', '客户信用评级', '产能日历'],
    allowedActions: ['标记风险订单', '添加评审附注'],
    forbiddenActions: ['直接撤销客户订单', '修改对外承诺单价'],
    manualConfirmRules: ['客户信用评级低于B级'],
    outputs: ['评审风险清单'],
    executionLog: []
  },
  {
    id: 'ag_inv_01',
    name: '库存检查 Agent',
    description: '巡检安全库存与在途库存，预判未来的供应断供风险。',
    targetObjects: ['库存', '物料'],
    readAccess: ['入库流水', '出库流水', '安全库存设置'],
    allowedActions: ['触发出库预警', '触发缺货红灯'],
    forbiddenActions: ['直接冲销库存帐', '强制盘点平账'],
    manualConfirmRules: ['整体库存水位低于总体安全警戒线20%'],
    outputs: ['缺料警报'],
    executionLog: []
  },
  {
    id: 'ag_proc_01',
    name: '采购建议 Agent',
    description: '供应链智能调度核心：根据缺料状况与供应商画像智能组合寻源最优解。',
    targetObjects: ['采购需求', '物料', '库存', '供应商'],
    readAccess: ['订单详情记录', 'BOM层级配方', '当前与锁定库存', '供应商履约打分', '历史采购价格异动记录'],
    allowedActions: ['生成结构化采购建议', '从库中推荐优选供应商名单', '标记特定物料的交期风险', '向采购员发送催办与协同提醒'],
    forbiddenActions: ['直接使用公司账户付款', '未确认情况下直接向供应商下达正式PO', '修改供应商的基础财务与银行账户数据'],
    manualConfirmRules: ['采购总金额预估超过 5000 RMB', '预测由于材料短缺会导致顶层交期违约(高风险)', '所选的最优推荐供应商近期履约质量评分低'],
    outputs: ['采购建议单草稿', '风险预见提醒报告', '寻源推理决策日志'],
    executionLog: [
      '[15:30:00] 接收触发指令: 依据订单 OR-2026-001 解析缺料表单',
      '[15:30:01] 数据汲取: 读取订单 OR-2026-001 需求，层级展开 BOM',
      '[15:30:03] 数据比对: 查询系统实时库存卡片',
      '[15:30:05] 规则命中: 发现物料 M-102 (MCU控制板) 库存缺口达 -5000 units',
      '[15:30:10] 开始分析: 检索合格供应商库，命中 A厂, B厂',
      '[15:30:15] 方案校验: A厂质量靠谱但近期交期波动大；B厂报价低但产能满载',
      '[15:30:18] 生成方案: 智能分配 70% 份额给予A厂锁定交期，30% 份额给B厂对冲成本',
      '[15:30:20] 动作执行: 生成草拟采购建议单 PR-2026-008',
      '[15:30:22] 规则拦截: 触发规则【金额超 5000 需确认】，流程已挂起，等待人工介入。'
    ]
  },
  {
    id: 'ag_mfg_01',
    name: '生产任务 Agent',
    description: '基于齐套与产能安排生产制令。',
    targetObjects: ['生产任务', '物料'],
    readAccess: ['车间资源日历', '工艺路线'],
    allowedActions: ['生成工单方案', '排产'],
    forbiddenActions: ['直接开工特定关键高压设备'],
    manualConfirmRules: ['存在冲突的车间安排时'],
    outputs: ['预排产模型'],
    executionLog: []
  },
  {
    id: 'ag_log_01',
    name: '发货提醒 Agent',
    description: '监控仓配状态，智能预约外部物流。',
    targetObjects: ['发货单'],
    readAccess: ['生产完工信号', '客户地址'],
    allowedActions: ['推送发货提醒邮件'],
    forbiddenActions: ['免受控地释放高价值商品提货权'],
    manualConfirmRules: ['跨境运费异动超20%'],
    outputs: ['物流约车单', '客户通知短邮'],
    executionLog: []
  }
];

export const mockTasks: Task[] = [
  { id: 'tsk_1', name: '确认订单 OR-2026-001 的交期', source: 'process', targetObject: 'OR-2026-001', status: 'pending', owner: '王销售', priority: 'medium', deadline: '今天 17:00' },
  { id: 'tsk_2', name: '审核采购建议 PR-2026-008', source: 'agent', targetObject: 'PR-2026-008', status: 'waiting', owner: '李采购', priority: 'high', deadline: '明天 10:00' },
  { id: 'tsk_3', name: '处理高风险订单 OR-2026-003', source: 'rule', targetObject: 'OR-2026-003', status: 'running', owner: '部门经理', priority: 'high', deadline: '紧急处理' },
  { id: 'tsk_4', name: '确认库存缺料清单', source: 'system', targetObject: 'BOM-缺料检视表', status: 'pending', owner: '张计划', priority: 'medium', deadline: '今天 14:00' },
  { id: 'tsk_5', name: '复核 Agent 推荐供应商', source: 'rule', targetObject: '供应商推荐表-32', status: 'blocked', owner: '周风控', priority: 'high', deadline: '本周五 12:00' }
];

export const mockLog: AuditEvent[] = [
  { id: 'adt_1', timestamp: '09:10:00', event: '订单 OR-2026-001 被提交评审', reads: [], rulesHit: [], agentJudgment: '', action: '状态流转 -> 待评审', modifiedObjects: ['OR-2026-001'], manualConfirmed: false, result: 'success' },
  { id: 'adt_2', timestamp: '09:11:00', event: '订单评审 Agent 读取客户信用、历史订单、交期要求', reads: ['客户信用资料', '历史交易订单集', '交期硬性要求'], rulesHit: [], agentJudgment: '综合信控健康，履约能力正常', action: '执行风险打标', modifiedObjects: [], manualConfirmed: false, result: 'success' },
  { id: 'adt_3', timestamp: '09:12:00', event: '命中规则：交期小于 7 天，需要标记风险', reads: [], rulesHit: ['交期小于 7 天，需要标记风险'], agentJudgment: '触发防御动作，标记高危', action: '强制修改属性', modifiedObjects: ['OR-2026-001.riskLevel = 中'], manualConfirmed: false, result: 'success' },
  { id: 'adt_4', timestamp: '09:13:00', event: 'Agent 将订单风险等级设置为“中”', reads: [], rulesHit: [], agentJudgment: '', action: '更新状态', modifiedObjects: [], manualConfirmed: false, result: 'success' },
  { id: 'adt_5', timestamp: '09:14:00', event: '库存检查 Agent 查询 BOM 和库存', reads: ['全量BOM树', 'WMS库存可用量快照'], rulesHit: [], agentJudgment: '', action: '生成差异补货数组', modifiedObjects: [], manualConfirmed: false, result: 'success' },
  { id: 'adt_6', timestamp: '09:15:00', event: '发现物料 M-102 库存不足', reads: [], rulesHit: [], agentJudgment: '', action: '缺料标识符置为 TRUE', modifiedObjects: ['M-102.shortage = true'], manualConfirmed: false, result: 'success' },
  { id: 'adt_7', timestamp: '09:16:00', event: '触发规则：库存不足生成采购建议', reads: [], rulesHit: ['库存不足生成采购建议'], agentJudgment: '', action: '下达并行异步调度指令', modifiedObjects: [], manualConfirmed: false, result: 'success' },
  { id: 'adt_8', timestamp: '09:17:00', event: '采购建议 Agent 创建 PR-2026-008', reads: [], rulesHit: [], agentJudgment: '寻获最优解并整合供应商A与B份额', action: '创建领域单据', modifiedObjects: ['新增记录 PR-2026-008'], manualConfirmed: false, result: 'success' },
  { id: 'adt_9', timestamp: '09:18:00', event: '等待采购员人工确认', reads: [], rulesHit: ['大额采购强制人工介入干预'], agentJudgment: '', action: '中断自动化流，发布协作任务', modifiedObjects: ['Task-tsk_2 生成', 'PR-2026-008 进入挂起态'], manualConfirmed: true, result: 'waiting' }
];
