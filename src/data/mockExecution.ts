import { Task, AuditEvent } from '../types';

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
