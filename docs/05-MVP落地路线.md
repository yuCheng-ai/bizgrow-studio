# 05. MVP 落地路线

BizGrow Studio 不能第一版就做成全行业平台。

第一版必须克制，只打穿一个小而真的业务闭环。

---

## 1. MVP 目标

第一版目标：

```text
用业务语义 DSL + 运行时，跑通一个订单交付局部闭环。
```

最小闭环：

```text
订单评审
→ 库存检查
→ 采购建议
→ 人工确认
→ 生产任务
```

这条链跑通后，系统就不再只是前端 demo。

---

## 2. MVP 不做什么

第一版不要做：

```text
全行业通用
复杂拖拽画布
完整 ERP 替代
完整采购系统
完整财务系统
复杂组织权限
复杂图数据库推理
全自动 Agent 决策
多 Agent 自治协同
```

否则会变成 PPT。

---

## 3. MVP 必须做什么

第一版必须具备：

```text
1. Object DSL
2. Relation DSL
3. State DSL
4. Rule DSL
5. Agent DSL 简化版
6. Loop DSL
7. DSL 校验器
8. 业务闭环模板发布
9. 业务闭环实例生成
10. 规则触发
11. 任务中心
12. 人工确认
13. 审计日志
```

---

## 4. MVP 核心对象

只保留最少对象：

```text
Order
BOM
Material
Inventory
PurchaseRequest
WorkOrder
ReviewSuggestion
HumanConfirmTask
```

可选对象：

```text
Customer
Product
Supplier
```

第一版不要把对象扩太多。

---

## 5. MVP 核心关系

```text
Order references Product
Product uses BOM
BOM consumes Material
Material affects Inventory
Inventory triggers PurchaseRequest
PurchaseRequest enables WorkOrder
```

第一版只需要支持 2~3 层关系追踪。

---

## 6. MVP 核心状态

### Order

```text
草稿
待评审
已确认
执行中
已完成
```

### PurchaseRequest

```text
草稿
待确认
已确认
已取消
```

### WorkOrder

```text
待创建
已创建
执行中
完成
```

---

## 7. MVP 核心规则

### 高金额订单规则

```text
WHEN Order.submitted
IF Order.amount > 100000
THEN create HumanConfirmTask
```

### 库存不足规则

```text
WHEN Inventory.checked
IF Inventory.availableQty < Material.requiredQty
THEN create PurchaseRequest AND require_human_confirm
```

### 人工确认后创建生产任务

```text
WHEN PurchaseRequest.confirmed
IF no_pending_human_task
THEN create WorkOrder
```

---

## 8. MVP Agent 范围

### 订单评审 Agent

可做：

```text
检查字段完整性
判断高金额风险
生成评审建议
创建人工确认任务
```

不可做：

```text
直接确认订单
删除订单
修改金额
直接发货
```

### 采购建议 Agent

可做：

```text
读取缺料信息
生成采购建议
推荐采购优先级
创建人工确认任务
```

不可做：

```text
直接下采购单
直接付款
修改供应商账户
```

---

## 9. MVP 用户流程

### 9.1 配置阶段

```text
创建订单交付场景
→ 定义对象
→ 定义关系
→ 定义状态机
→ 定义规则
→ 配置 Agent 边界
→ 定义业务闭环模板
→ 编译校验
→ 预览图谱和流程
→ 发布模板
```

### 9.2 运行阶段

```text
创建订单 OR-2026-001
→ 系统生成业务闭环实例 BR-2026-0001
→ 订单进入评审
→ Agent 生成评审建议
→ 系统检查库存
→ 库存不足触发采购建议
→ 生成待人工确认任务
→ 人工确认
→ 创建生产任务
→ 写审计日志
```

---

## 10. MVP 验收标准

如果以下 10 条能做到，MVP 就成立：

```text
1. 可以通过 DSL 定义 Order / Material / Inventory / PurchaseRequest / WorkOrder
2. 可以通过 DSL 定义对象关系
3. 可以通过 DSL 定义状态机
4. 可以通过 DSL 定义库存不足规则
5. 可以发布 order_delivery_loop 模板
6. 可以生成 BR-2026-0001 业务闭环实例
7. 库存不足时自动生成 PurchaseRequest
8. PurchaseRequest 进入人工确认
9. 人工确认后生成 WorkOrder
10. 全过程产生 AuditLog
```

---

## 11. Phase 计划

### Phase 0：前端概念原型

周期：1~2 周

目标：让用户看懂产品方向。

状态：当前已基本完成。

---

### Phase 1：DSL 编辑器和编译器

周期：2~4 周

功能：

```text
DSL 文件结构
YAML 编辑
JSON Schema 校验
Zod Runtime 校验
错误提示
图谱预览
模板预览
```

---

### Phase 2：BizRuntime MVP

周期：4~8 周

功能：

```text
模板发布
实例创建
规则判断
状态流转
任务生成
审计日志
```

---

### Phase 3：受控 Agent 执行

周期：4~8 周

功能：

```text
AgentPolicy
上下文裁剪
结构化输出
动作权限检查
人工确认
审计记录
```

---

### Phase 4：真实数据接入

周期：8~12 周

功能：

```text
Excel 导入
API Connector
Webhook
SOP 文档挂载
ERP 只读同步
```

---

## 12. 最小技术实现建议

第一版：

```text
React + TypeScript + Vite
Node.js + Fastify
PostgreSQL
YAML + Zod
自研轻量规则引擎
自研状态机
模型 API 抽象层
Docker Compose
```

先不要上：

```text
Neo4j
Camunda
Temporal
复杂微服务
复杂权限系统
```

---

## 13. 第一版成功标志

第一版成功不是页面多漂亮，而是能回答：

```text
为什么当前业务闭环实例走到这一步？
为什么这个任务可执行？
为什么命中了这个规则？
Agent 读了哪些数据？
Agent 被允许做什么？
哪些动作需要人工确认？
最终是谁确认的？
整个过程能不能追责？
```

能回答这些问题，系统就从 demo 进入产品内核阶段。
