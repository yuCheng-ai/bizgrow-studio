import { Agent } from '../types';

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
