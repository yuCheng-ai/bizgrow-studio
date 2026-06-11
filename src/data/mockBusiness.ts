import { BusinessObject, Relation, State } from '../types';

export const mockObjects: BusinessObject[] = [
  {
    id: 'obj_1',
    name: '正式订单',
    code: 'Order',
    ontologyConcept: '订单 (Order)',
    businessMeaning: '指确认后的正式业务合同或承诺单据',
    lifecycleStates: ['创建中', '待评审', '已确认', '挂起', '已完成'],
    relatedObjects: ['客户', '订单明细'],
    triggerableEvents: ['提交订单', '评审通过', '交期延误'],
    executableActions: ['修改价格', '加急发货', '取消订单'],
    agentOperableScope: ['订单评审 Agent', '发货提醒 Agent'],
    fields: [
      { id: 'f_1', name: '订单编号', code: 'orderNo', type: 'string', required: true, unique: true, description: '唯一标识' },
      { id: 'f_2', name: '总金额', code: 'totalAmount', type: 'number', required: true, unique: false, description: '订单总价' }
    ]
  },
  {
    id: 'obj_2',
    name: '物料库存',
    code: 'Inventory',
    ontologyConcept: '库存 (Inventory)',
    businessMeaning: '物理物料的实时状态记录',
    lifecycleStates: ['正常', '短缺', '冻结'],
    relatedObjects: ['物料', '采购需求'],
    triggerableEvents: ['出库', '入库', '盘点短缺'],
    executableActions: ['冻结库存', '盘库平衡'],
    agentOperableScope: ['库存检查 Agent', '采购建议 Agent'],
    fields: [
      { id: 'f_3', name: 'SKU', code: 'sku', type: 'string', required: true, unique: true, description: '物料唯一标识' },
      { id: 'f_4', name: '可用数量', code: 'qty', type: 'number', required: true, unique: false, description: '当前可用件数' }
    ]
  }
];

export const mockRelations: Relation[] = [
  { id: 'rel_1', source: '客户', target: '订单', type: '拥有', description: '客户关联自身下的所有订单' },
  { id: 'rel_2', source: '订单', target: '产品', type: '包含', description: '订单中包含的产品项' },
  { id: 'rel_3', source: '库存', target: '物料', type: '记录', description: '库存记录具体物料' },
  { id: 'rel_4', source: '采购需求', target: '供应商', type: '分配', description: '向供应商分配的采购份额' },
  { id: 'rel_5', source: '生产任务', target: '发货单', type: '触发', description: '生产完工后触发发货提醒' }
];

export const mockStates: State[] = [
  { id: 'st_1', name: '已驳回', type: 'exception', allowedActions: ['修改', '重新提交'], enterCondition: '审批拒绝', leaveValidation: '信息修正', roles: ['制单人'], timeoutPolicy: '无' },
  { id: 'st_2', name: '待评审', type: 'normal', allowedActions: ['审批同意', '驳回'], enterCondition: '提交订单', leaveValidation: '无阻挡规则', roles: ['评审组成员', 'Agent'], timeoutPolicy: '24小时后升迁异常' },
  { id: 'st_3', name: '已核准', type: 'normal', allowedActions: ['排产', '锁定'], enterCondition: '通过评审', leaveValidation: '-', roles: ['生产计划员'], timeoutPolicy: '无' },
  { id: 'st_4', name: '已完成', type: 'end', allowedActions: ['归档'], enterCondition: '所有链条结束', leaveValidation: '-', roles: ['系统'], timeoutPolicy: '常驻' }
];

