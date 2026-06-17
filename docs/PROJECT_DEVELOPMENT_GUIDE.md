# BizGrow Studio 项目开发说明

## 1. 项目定位

BizGrow Studio 不是传统 ERP，也不是普通表单低代码平台。它的目标是成为一个面向企业业务系统的元建模与运行平台。

系统先描述企业业务世界的底层结构，再基于这些结构生成可运行、可审计、可演进的业务应用。

产品最低要求：

```text
简道云能做的基础低代码能力，BizGrow Studio 都应该能做。
但 BizGrow Studio 不能沿用大宽表、弱关联、流程脚本堆叠的底层路线。
它必须支持企业业务从一期、二期继续向三期、四期长期演进。
```

核心定位：

```text
业务对象元系统 + 轻量本体论 + 规则 DSL + 受控 Agent 执行
```

配置端还需要原生支持 MCP 协作能力，让 Codex 可以读取元模型、生成配置草稿、运行校验和提交变更建议。但 MCP 只能进入草稿和审核流程，不能绕过权限、发布和审计。MCP 授权必须同时识别项目和授权用户，可以采用 Project Key + User Identity Key，也可以生成短期 AI Operation Key，但系统必须能追踪“哪个用户授权 AI 操作了哪个项目”。

第一阶段不要把产品绑定到某个具体行业场景，也不要把目标设为完整替代 ERP。当前重点是验证元系统是否成立。

更准确地说：

```text
传统低代码面向表单交付。
BizGrow Studio 面向业务对象系统演进。
```

## 2. 设计原则

### 2.1 元系统优先

系统优先设计通用业务底座：

- 对象
- 字段
- 关系
- 动作
- 事件
- 状态
- 规则
- 视图
- 权限
- 审计
- Agent 能力边界

订单、客户、BOM、物料、工单等只是用于验证元模型表达力的示例对象，不是当前阶段的产品边界。

### 2.2 基础低代码能力必须覆盖

BizGrow Studio 不能只讲“本体论”“Agent”“规则 DSL”这些高级概念。产品上必须先覆盖企业客户对低代码平台的基础预期。

基础能力包括：

- 表单设计
- 列表视图
- 详情页
- 搜索和筛选
- 字段权限
- 数据权限
- 对象关联
- 审批
- 规则校验
- 仪表盘
- 导入导出
- 操作日志
- 运行端页面

但这些能力的底层实现不能退回传统表单系统。

正确路径是：

```text
表单是对象的输入界面
列表是对象集合的投影
详情页是对象、关系、状态、规则和审计的聚合视图
审批是对象动作的人工确认机制
仪表盘是对象运行数据的统计视图
```

也就是说，低代码能力要有，但它们应该建立在对象元模型之上。

### 2.3 受控配置，不做无限自由

传统低代码的问题通常不是配置能力不够，而是配置太自由以后失控：

- 字段触发规则互相调用
- 对象关系级联导致死循环
- 流程分叉越来越复杂
- 规则散落在表单、流程、按钮、脚本里
- 配置上线后无法审计和回放

BizGrow Studio 的方向是用更强的约束换取可维护性。

配置能力应该被限制在明确边界内：

- 只允许通过对象动作修改核心数据
- 规则只能挂在明确事件点或动作点
- Agent 只能调用系统授权的动作
- 关系级联必须显式配置，并且有深度限制
- 每次运行必须有审计轨迹

### 2.4 本体论是思想，不是全部工程实现

系统应该吸收本体论框架，但不建议第一版直接实现完整 RDF / OWL / SPARQL 平台。

建议路线：

- 内部使用自研 JSON 元模型
- 概念建模参考 OWL / RDFS
- 约束校验参考 SHACL
- 决策规则参考 DMN
- 对外交换可兼容 JSON-LD
- 后期根据需要再考虑 RDF、SPARQL 或图数据库

## 3. 核心元模型

### 3.1 ObjectType 对象类型

对象类型是业务系统的核心单位，表达一个企业业务概念。

示例：

```json
{
  "id": "order",
  "name": "订单",
  "code": "Order",
  "domain": "sales",
  "description": "承载客户交易、交付承诺和后续履约的业务对象",
  "version": 1,
  "status": "active"
}
```

对象类型不等于数据库表。它是一个语义对象，后续会绑定字段、关系、动作、状态、规则、视图和权限。

### 3.2 Field 字段

字段定义对象的属性。

字段不只是表单输入项，还要承载语义、校验、索引、权限、影响范围。

示例：

```json
{
  "id": "order.amount",
  "objectTypeId": "order",
  "name": "订单金额",
  "type": "money",
  "required": true,
  "semanticType": "commercial.amount",
  "validation": {
    "min": 0
  },
  "permission": {
    "read": ["sales", "finance"],
    "write": ["sales"]
  }
}
```

### 3.3 RelationType 关系类型

关系定义对象之间如何连接。

关系不能只是外键。它需要表达业务语义。

常见关系语义：

- 引用
- 包含
- 生成
- 依赖
- 消耗
- 影响
- 归属
- 汇总

示例：

```json
{
  "id": "order_contains_order_line",
  "sourceObjectTypeId": "order",
  "targetObjectTypeId": "order_line",
  "relation": "contains",
  "cardinality": "one_to_many",
  "sourceField": "order.id",
  "targetField": "order_line.order_id",
  "cascadePolicy": "none",
  "impactDirection": "source_to_target"
}
```

### 3.4 ActionType 动作类型

动作是系统修改业务事实的唯一入口。

这是 BizGrow Studio 和普通低代码的重要区别。不要允许表单、规则、Agent 随意直接改核心对象。

所有变化应该收敛为动作：

```text
用户点击按钮 -> 发起动作
Agent 建议执行 -> 发起动作
规则自动处理 -> 发起动作
外部 API 调用 -> 发起动作
```

示例：

```json
{
  "id": "order.submit_for_review",
  "objectTypeId": "order",
  "name": "提交评审",
  "inputSchema": {
    "comment": "string"
  },
  "preconditions": ["order.required_fields_completed"],
  "effects": [
    {
      "type": "state_transition",
      "from": "draft",
      "to": "reviewing"
    }
  ],
  "permission": ["sales"],
  "auditLevel": "required"
}
```

### 3.5 EventType 事件类型

事件是系统运行过程中发生的事实。

事件可以触发规则，但事件本身不应该直接承载复杂业务逻辑。

建议第一版只允许有限事件类型：

- object.created
- object.updated
- field.changed
- action.requested
- action.succeeded
- action.failed
- state.changed
- rule.matched
- agent.suggested
- approval.completed

事件必须携带：

- eventId
- eventType
- objectTypeId
- objectId
- actionId
- actor
- correlationId
- occurredAt
- payload

### 3.6 Lifecycle 生命周期

状态机必须绑定对象类型，而不是独立存在。

结构关系：

```text
ObjectType
  -> Lifecycle
    -> State
    -> Transition
      -> ActionType
      -> GuardRule
```

状态流转不应该被规则随意推动，应该由动作触发，规则负责判断动作是否允许执行。

### 3.7 Rule 规则

规则不是自然语言，也不是任意脚本。

第一版建议使用结构化 JSON DSL：

```json
{
  "id": "rule.order.high_amount_review",
  "name": "大额订单需要财务审批",
  "scope": {
    "objectTypeId": "order",
    "actionTypeId": "order.submit_for_review"
  },
  "trigger": {
    "type": "action_requested",
    "actionTypeId": "order.submit_for_review"
  },
  "conditions": [
    {
      "field": "order.amount",
      "operator": ">",
      "value": 500000
    }
  ],
  "actions": [
    {
      "type": "require_approval",
      "role": "finance_director"
    }
  ]
}
```

AI 可以辅助生成 DSL 草稿，但最终必须经过：

```text
AI 生成 -> 结构校验 -> 人工审核 -> 发布版本 -> 确定性执行 -> 审计记录
```

### 3.8 View 视图

视图是对象模型的投影。

第一版至少支持：

- ListView
- DetailView
- FormView
- GraphView
- TimelineView
- DashboardView

视图不应该持有独立业务逻辑。它只负责展示、输入和触发对象动作。

### 3.9 AgentCapability Agent 能力

Agent 是受控执行者，不是超级管理员。

每个 Agent 必须定义：

- 可读取对象范围
- 可读取字段范围
- 可调用动作
- 是否需要人工确认
- 最大执行步数
- 可使用知识库范围
- 审计级别

Agent 不能直接修改核心数据，只能发起受控动作。

## 4. 系统分层架构

建议后端采用以下分层：

```text
配置端 Frontend
  -> 元模型 API
  -> 规则配置 API
  -> 发布管理 API
  -> MCP 协作 API

运行端 Frontend
  -> 对象运行 API
  -> 动作执行 API
  -> 任务与审批 API

核心后端
  -> 对象模型服务
  -> 关系模型服务
  -> 动作服务
  -> 生命周期服务
  -> 规则引擎
  -> 权限服务
  -> 审计服务
  -> 发布版本服务
  -> MCP Bridge 服务

Agent 服务
  -> 意图理解
  -> 知识检索
  -> DSL 生成辅助
  -> 动作建议
  -> 受控工具调用

存储层
  -> PostgreSQL
  -> Redis
  -> OpenSearch
  -> pgvector 或向量库
```

## 5. 技术选型建议

### 5.1 核心后端

建议使用 Java / Spring Boot 或 Kotlin / Spring Boot。

原因：

- 企业客户接受度高
- 事务、权限、审计、多租户生态成熟
- 适合长期承载核心业务事实
- 强类型适合复杂元模型
- 后期团队招聘和维护更稳

如果团队 Java 经验更强，第一版直接使用 Java。

### 5.2 规则执行层

第一版不建议引入完整自定义语言解释器。

建议：

- DSL 使用 JSON AST
- Java 后端实现确定性规则执行器
- 所有操作符白名单
- 所有动作白名单
- 所有字段引用必须经过元模型校验
- 每次执行生成命中日志

### 5.3 Agent 层

Agent 服务可以独立为 Python 服务。

Agent 适合负责：

- 自然语言理解
- 规则草稿生成
- 配置建议
- 知识库检索
- 动作计划生成

Agent 不负责最终业务事实写入。

### 5.4 数据库

第一版建议：

- PostgreSQL：主数据、元模型、运行实例、规则、审计
- Redis：缓存、锁、短期任务状态
- OpenSearch：全文搜索和知识检索
- pgvector：早期向量能力

第一版不建议强依赖 Neo4j。对象关系图谱可以先存 PostgreSQL，前端用图组件展示。

## 6. 运行安全模型

这个系统能否落地，关键在运行安全模型。

必须优先设计以下机制。

### 6.1 事件边界

不允许任意字段变化随意触发任意规则。

规则只允许绑定明确触发点：

- 对象创建
- 动作请求
- 动作成功
- 状态变化
- 定时检查
- 人工触发
- Agent 建议触发

字段变化可以作为条件，但不建议第一版作为主要触发器。

### 6.2 动作边界

所有核心数据写入必须通过动作完成。

动作执行流程：

```text
请求动作
  -> 权限校验
  -> 参数校验
  -> 前置规则校验
  -> 生成执行计划
  -> 人工确认或自动执行
  -> 写入数据
  -> 发布事件
  -> 写审计日志
```

### 6.3 循环检测

为避免对象关联触发死循环，规则引擎必须支持：

- correlationId
- executionId
- 最大执行步数
- 最大传播深度
- 同一事件同一规则只命中一次
- 同一对象同一动作幂等
- 执行路径记录
- 循环路径阻断

### 6.4 幂等

所有对象动作必须支持幂等。

示例：

```text
同一个 executionId 下，generate_work_order 只能对同一个订单生成一次工单。
```

### 6.5 审计回放

任何自动化执行都必须能回答：

- 谁触发的
- 什么事件触发的
- 哪些规则命中
- 哪些条件成立
- 执行了哪些动作
- 修改了哪些对象
- 有没有人工确认
- 失败在哪里

## 7. 前端原型当前状态

当前仓库是纯前端原型，主要用于验证配置端产品形态。

当前已有方向：

- 业务对象列表
- 对象详情设计台
- 字段模型
- 关系图谱
- 表单视图
- 生命周期
- 对象动作
- 规则约束
- Agent 边界
- 全局规则构件库
- 知识库
- 运行分析

前端 Mock 数据需要继续向真实后端数据结构靠拢，避免只是静态展示。

## 8. 第一阶段开发目标

第一阶段目标不是做完整业务系统，而是验证元系统闭环。

建议目标：

```text
定义对象 -> 定义字段 -> 定义关系 -> 定义动作 -> 定义状态 -> 定义规则 -> 生成视图 -> 模拟运行 -> 记录审计
```

第一阶段应该完成：

- 元模型 Schema v0.1
- 规则 DSL Schema v0.1
- 对象动作模型 v0.1
- 生命周期模型 v0.1
- Agent 能力边界模型 v0.1
- 前端配置台原型 v0.1
- 后端服务骨架选型
- 一条模拟运行链路

## 9. 不做什么

第一阶段明确不做：

- 不做完整 ERP
- 不做完整 BPMN 引擎
- 不做任意脚本执行平台
- 不做无限自由表单低代码
- 不让 Agent 直接写核心业务数据
- 不直接实现完整 OWL 推理平台
- 不优先引入图数据库作为强依赖
- 不把某个行业模板作为产品核心边界

## 10. 风险清单

主要风险：

- 元模型过度抽象，导致工程不可落地
- 配置能力过度自由，导致复杂度失控
- 规则触发链路死循环
- Agent 权限过大，导致不可审计
- 规则 DSL 太像编程语言，用户无法维护
- 前端原型看起来很强，但后端无法支撑
- 过早绑定某个行业，变成定制 ERP
- 过早宣称替代 ERP，销售预期失控

对应策略：

- 用有限元模型起步
- 所有写操作收敛到动作
- 规则执行必须有边界
- Agent 必须受控调用
- DSL 必须可视化审核
- 每个自动动作必须有审计
- 用示例业务验证元模型，但不绑定业务

## 11. 建议开发路线

### 阶段 0：产品与架构定型

- 明确元系统定位
- 完成元模型说明文档
- 完成规则 DSL v0.1
- 完成后端架构图
- 完成运行安全模型

### 阶段 1：配置端原型

- 对象类型设计
- 字段设计
- 关系设计
- 动作设计
- 生命周期设计
- 规则构件库
- 规则实例配置
- Agent 边界配置

### 阶段 2：后端 MVP

- Java / Spring Boot 服务骨架
- PostgreSQL 元模型存储
- 对象模型 API
- 动作执行 API
- 规则 DSL 校验与执行
- 审计日志
- 简单发布机制

### 阶段 3：运行端 MVP

- 基于对象生成列表页
- 基于对象生成详情页
- 基于视图模型生成表单
- 动作按钮执行
- 规则命中提示
- 审计轨迹展示

### 阶段 4：Agent 辅助能力

- Agent 读取元模型
- Agent 生成规则草稿
- Agent 生成对象配置建议
- Agent 发起动作建议
- 人工确认后执行

## 12. 当前优先级

短期最重要的不是继续扩 UI，而是补齐底层定义：

1. 元模型 Schema
2. 规则 DSL Schema
3. 动作执行模型
4. 运行安全模型
5. 后端服务边界
6. 配置端与运行端边界

这些确定以后，前端原型和后端工程才能对齐。
