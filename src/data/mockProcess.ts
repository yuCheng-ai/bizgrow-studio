import { ProcessNode, Rule } from '../types';

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
