import { OntologyConcept } from '../types';

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
