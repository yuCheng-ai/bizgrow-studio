# 03. BizDSL 设计草案

BizDSL 是 BizGrow Studio 的核心低代码语言层，用于把业务语义转换成系统可运行的结构。

它不是编程语言，也不是拖拽流程图。它是一种 **声明式、结构化、面向业务语义的 DSL**。

---

## 1. DSL 层次

1. Object DSL：定义业务对象
2. Relation DSL：定义对象关系
3. State DSL：定义状态机
4. Rule DSL：定义业务规则
5. Agent DSL：定义 Agent 权限和动作边界
6. Loop DSL：定义业务闭环模板

---

## 2. DSL 设计原则

- 声明式，不是命令式
- 非图灵完备，不能随意写循环和函数
- 人可读，AI 可生成
- 支持版本管理
- 可校验，可编译成运行模型
- 输出结构化数据，可被 Runtime 消费

---

## 3. Object DSL 示例

```yaml
object:
  type: Order
  name: 订单
  meaning: 客户需求转化后的正式业务承诺
  fields:
    - name: orderNo
      label: 订单号
      type: string
      required: true
    - name: customer
      label: 客户
      type: ref
      ref: Customer
      required: true
    - name: amount
      label: 订单金额
      type: money
      required: true
    - name: deliveryDate
      label: 承诺交期
      type: date
      required: true
    - name: status
      label: 状态
      type: enum
      values: [草稿, 待评审, 已确认, 执行中, 已发货, 已完成, 已取消]
  actions:
    - submit_review
    - confirm_order
    - update_delivery_date
    - mark_risk
    - complete_order
```

---

## 4. Relation DSL 示例

```yaml
relations:
  - from: Customer
    relation: places
    to: Order
    meaning: 客户发起订单
  - from: Order
    relation: contains
    to: OrderLine
    meaning: 订单包含订单明细
  - from: Product
    relation: uses
    to: BOM
    meaning: 产品使用 BOM
  - from: BOM
    relation: consumes
    to: Material
    meaning: BOM 消耗物料
  - from: Inventory
    relation: triggers
    to: PurchaseRequest
    when: Inventory.availableQty < Material.safetyQty
    meaning: 库存不足触发采购需求
```

---

## 5. Rule DSL 示例

```yaml
rules:
  - id: high_value_order_review
    name: 高金额订单人工确认
    when: Order.submitted
    if:
      - Order.amount > 100000
    then:
      - create_task:
          name: 老板审批
          owner_role: boss
          object: Order
  - id: inventory_shortage_purchase
    name: 库存不足生成采购建议
    when: Inventory.checked
    if:
      - Inventory.availableQty < Material.safetyQty
    then:
      - create_object:
          type: PurchaseRequest
      - assign_agent:
          agent: purchase_agent
      - require_human_confirm: true
```

---

## 6. Agent DSL 示例

```yaml
agent:
  id: order_review_agent
  name: 订单评审 Agent
  responsibility:
    - 检查订单字段完整性
    - 判断客户信用风险
    - 判断交期风险
    - 生成评审建议
  can_read:
    - Order
    - Customer.creditLevel
    - Customer.historyOrders
    - Product.deliveryCycle
    - Inventory.summary
  can_execute:
    - mark_order_risk
    - create_review_suggestion
    - create_human_confirm_task
  cannot_execute:
    - delete_order
    - confirm_order
    - change_amount
    - ship_goods
  require_human_confirm_when:
    - Order.amount > 100000
    - Customer.creditLevel = 风险
    - Order.deliveryDate < today + 7d
  output:
    - ReviewSuggestion
    - RiskAssessment
    - HumanConfirmTask
```

---

## 7. Loop DSL 示例

```yaml
business_loop:
  id: order_delivery_loop
  name: 订单驱动型交付闭环
  goal: 完成客户订单交付
  start_from: 客户需求
  end_when:
    - Order.status = 已完成
    - DeliveryNote.status = 已发货
  primary_object:
    type: Order
  stages:
    - id: collect_requirement
      name: 客户需求
      type: human
      object: CustomerRequirement
      output:
        - OrderDraft
    - id: create_order
      name: 创建订单
      type: system
      object: Order
      input:
        - OrderDraft
      output:
        - Order
    - id: review_order
      name: 订单评审
      type: agent
      agent: order_review_agent
      object: Order
      require_human_confirm_when:
        - Order.amount > 100000
        - Customer.creditLevel = 风险
    - id: check_inventory
      name: 库存检查
      type: system
      object: Inventory
      input:
        - BOM
        - Material
        - Inventory
    - id: purchase_suggestion
      name: 采购建议
      type: agent
      agent: purchase_agent
      trigger_when:
        - Inventory.availableQty < Material.safetyQty
      output:
        - PurchaseRequest
      require_human_confirm: true
    - id: create_work_order
      name: 创建生产任务
      type: system
      object: WorkOrder
      input:
        - Order
        - BOM
        - Material
    - id: delivery_reminder
      name: 发货提醒
      type: agent
      agent: delivery_agent
      object: DeliveryNote
    - id: complete_order
      name: 完成订单
      type: system
      object: Order
      set_state:
        Order.status: 已完成
```
