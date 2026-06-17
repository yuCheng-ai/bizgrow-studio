# BizGrow Studio 后端架构设计 v0.1

## 1. 后端目标

BizGrow Studio 的后端不是普通表单低代码后端。

最低产品要求：

```text
简道云能做的，我们都应该能做。
但我们的底层不能是大宽表和弱关联。
我们要支持业务持续演进，而不是只能支撑一期、二期交付。
```

核心差异：

- 不是表单驱动，而是对象元模型驱动
- 不是大宽表，而是对象记录 + 字段定义 + 关系定义 + 动作模型
- 不是弱关联，而是关系有语义、方向、基数、影响范围和级联策略
- 不是流程脚本堆叠，而是对象动作 + 生命周期 + 规则 DSL
- 不是配置越自由越好，而是通过运行边界保证长期可维护
- 不是 Agent 随意执行，而是 Agent 通过授权动作进入系统
- 不是只给人手工配置，而是要通过 MCP 让 Codex 安全代劳配置工作

## 2. 架构总览

建议采用 Java / Spring Boot 作为核心后端。

整体架构：

```text
配置端 Frontend
  -> Meta Model API
  -> Rule DSL API
  -> Publish API

运行端 Frontend
  -> Object Runtime API
  -> Action Runtime API
  -> Task API
  -> Audit API

核心后端 Java
  -> Tenant Service
  -> Ontology Service
  -> Object Model Service
  -> Relation Model Service
  -> View Model Service
  -> Action Service
  -> Lifecycle Service
  -> Rule Engine Service
  -> Permission Service
  -> Publish Service
  -> Runtime Object Service
  -> Event Service
  -> Audit Service
  -> MCP Bridge Service

Agent Service Python
  -> 元模型读取
  -> 规则草稿生成
  -> 配置建议
  -> 动作计划生成
  -> 知识检索

Storage
  -> PostgreSQL
  -> Redis
  -> OpenSearch
  -> pgvector
```

## 3. 技术选型

### 3.1 核心后端

推荐：

```text
Java 21 + Spring Boot 3
```

原因：

- 企业客户接受度高
- 事务和权限生态成熟
- 适合复杂元模型长期维护
- 强类型适合规则、动作、状态等核心模型
- 团队招聘和交付风险低

Kotlin 可以作为可选项，但第一版如果追求稳，优先 Java。

### 3.2 数据库

推荐：

```text
PostgreSQL
```

原因：

- 支持 JSONB，适合早期元模型演进
- 支持事务和复杂查询
- 可用 pgvector 承载早期向量检索
- 可逐步从 JSONB 演进到结构化冷热字段

辅助：

- Redis：缓存、锁、幂等、短任务状态
- OpenSearch：全文检索、知识库检索、审计检索
- pgvector：向量检索起步

第一版不强依赖图数据库。关系图谱先存在 PostgreSQL 中。

## 4. 与传统低代码的底层区别

### 4.1 不采用大宽表作为核心抽象

大宽表的问题：

- 字段越来越多后难以治理
- 关系弱，跨对象查询麻烦
- 业务语义散落在字段名和流程里
- 后期迭代容易失控
- 复杂规则难审计

BizGrow Studio 的核心抽象：

```text
ObjectType
FieldDefinition
RelationDefinition
ActionDefinition
LifecycleDefinition
RuleBinding
ViewDefinition
ObjectRecord
RelationRecord
ActionRequest
AuditLog
```

对象记录可以用 JSONB 存业务值，但这不等于大宽表。

区别在于：

- 字段有独立定义
- 关系有独立定义
- 动作有独立定义
- 规则引用字段和动作
- 视图只是对象投影
- 运行过程有事件和审计

### 4.2 关系是一级模型

传统低代码常见问题是“表之间有关联，但关联只是字段引用”。

BizGrow Studio 中关系必须是一级模型：

```text
sourceObjectType
targetObjectType
relationKind
cardinality
direction
cascadePolicy
impactPolicy
```

这能支持：

- 影响分析
- 关系图谱
- 规则命中分析
- Agent 上下文理解
- 后续数据治理

### 4.3 动作是业务变化入口

不允许表单、流程、规则、Agent 各自直接改核心业务数据。

所有核心写入必须通过动作：

```text
createObject
updateObject
submit
approve
reject
transitionState
generateObject
```

动作执行时统一经过：

```text
权限校验
参数校验
状态校验
规则校验
幂等校验
事务处理
事件发布
审计记录
```

这正是系统长期可演进的关键。

## 5. 后端模块

### 5.1 Tenant Service

负责租户、组织、角色、用户基础能力。

第一版保留多租户结构，即使只跑单租户。

核心能力：

- 租户管理
- 用户管理
- 角色管理
- 组织架构
- 数据隔离

### 5.2 Ontology Service

负责本体包管理。

核心能力：

- 创建本体包
- 管理领域 Domain
- 管理对象类型集合
- 管理版本状态
- 导入导出 JSON
- 后期兼容 JSON-LD

### 5.3 Object Model Service

负责对象类型和字段定义。

核心能力：

- ObjectType CRUD
- FieldDefinition CRUD
- 字段类型校验
- 引用字段校验
- 字段权限配置
- Agent 字段访问边界

### 5.4 Relation Model Service

负责对象关系定义。

核心能力：

- 关系类型定义
- 基数校验
- 关系方向定义
- 影响范围定义
- 级联策略定义
- 关系图谱查询

### 5.5 Action Service

负责对象动作定义和运行时动作执行。

配置态：

- ActionDefinition CRUD
- inputSchema 定义
- effect 定义
- 幂等策略定义
- 人工确认策略定义

运行态：

- 创建 ActionRequest
- 执行动作
- 调用规则引擎
- 写入 ObjectRecord
- 发布 EventRecord
- 记录 AuditLog

### 5.6 Lifecycle Service

负责对象生命周期。

核心能力：

- StateDefinition 管理
- Transition 管理
- Action 与 Transition 绑定
- GuardRule 绑定
- 当前状态校验

原则：

```text
状态机绑定对象类型
状态流转由动作触发
规则负责判断能不能流转
```

### 5.7 Rule Engine Service

负责规则 DSL 校验和执行。

核心能力：

- RuleBlock 管理
- RuleBinding 管理
- DSL 结构校验
- 字段和动作引用校验
- 类型检查
- 规则执行
- 动作合并
- 循环检测
- 命中日志

规则引擎第一版只执行有限 DSL，不执行脚本。

### 5.8 View Model Service

负责视图定义。

核心能力：

- 列表视图
- 详情视图
- 表单视图
- 图谱视图
- 时间线视图
- 仪表盘视图

视图只负责展示、输入和触发动作，不承载核心业务逻辑。

### 5.9 Permission Service

负责权限校验。

权限维度：

- 对象权限
- 字段权限
- 动作权限
- 视图权限
- Agent 权限
- 规则发布权限

### 5.10 Publish Service

负责配置发布。

核心能力：

- 草稿保存
- 配置校验
- 版本发布
- 版本冻结
- 回滚
- 配置差异比较
- 影响分析

配置未发布时不能影响运行态。

### 5.11 Runtime Object Service

负责对象实例数据。

核心能力：

- 创建对象实例
- 查询对象实例
- 更新对象实例
- 软删除
- 根据视图返回数据
- 根据关系查询上下文

注意：更新对象实例必须通过 Action Service，不建议暴露任意 update API 给前端。

### 5.12 Event Service

负责运行事件。

事件用于连接动作、规则、审计、Agent。

核心能力：

- 记录 EventRecord
- 查询事件流
- 触发规则评估
- 携带 correlationId / executionId

### 5.13 Audit Service

负责审计。

必须能回答：

- 谁做了什么
- 什么时候做的
- 改了哪些对象
- 哪些规则被检查
- 哪些规则命中
- 是否被阻断
- Agent 是否参与

### 5.14 MCP Bridge Service

负责向 Codex、IDE Agent 和其他受控自动化工具暴露配置端能力。

MCP 不是运行态写入通道，而是配置协作通道。

核心能力：

- 暴露元模型读取工具
- 暴露配置草稿创建工具
- 暴露规则 DSL 草稿创建工具
- 暴露配置校验工具
- 暴露影响分析工具
- 暴露测试样例生成工具
- 暴露变更建议提交工具

硬边界：

- MCP 不能直接发布配置
- MCP 不能直接修改运行态业务数据
- MCP 不能绕过权限系统
- MCP 工具调用必须同时绑定项目和授权用户
- MCP 工具调用必须写审计
- 高风险变更必须人工确认

认证模型：

```text
Project Key
  -> 标识哪个租户、哪个项目、哪个环境允许被 MCP 访问

User Identity Key
  -> 标识哪个用户授权 AI 代劳操作

AI Operation Key
  -> 可选的合并授权 Key，内部同时绑定 projectId、userId、scopes、expiresAt
```

系统可以支持两种方式：

```text
方式一：Codex 同时携带 Project Key + User Identity Key
方式二：系统生成一个短期 AI Operation Key，内部绑定 Project + User + Scope
```

无论使用哪种方式，后端都必须能解析出：

```text
tenantId
projectId
environment
userId
scopes
sessionId
expiresAt
```

审计日志必须记录：

```text
哪个项目
哪个环境
哪个用户
哪个 AI 工具
哪个 MCP 工具
做了什么草稿变更
是否提交审核
是否最终发布
```

Key 管理要求：

- Project Key 可以由项目管理员创建、禁用、轮换
- User Identity Key 必须由用户本人授权或由系统登录态换取
- AI Operation Key 必须短期有效
- Key 必须支持 scope 限制
- Key 必须支持吊销
- Key 明文只在创建时展示一次
- 存储时只保存 hash

建议第一版工具：

```text
meta.list_object_types
meta.get_object_type
meta.list_fields
meta.list_relations
meta.list_actions
meta.list_rule_blocks
draft.create_object_type
draft.create_fields
draft.create_form_view
draft.create_rule_binding
draft.update_lifecycle
validate.config_draft
analyze.impact
submit.change_proposal
```
- 人工是否确认

## 6. 数据表建议

第一版建议用配置表 + JSONB 起步。

### 6.1 配置态表

```text
tenant
user_account
role
organization
ontology_package
object_type
field_definition
relation_definition
action_definition
lifecycle_definition
rule_block
rule_binding
view_definition
permission_policy
agent_capability
publish_version
```

配置表通用字段：

```text
id
tenant_id
code
name
description
definition_json
version
status
created_at
updated_at
created_by
updated_by
```

### 6.2 运行态表

```text
object_record
relation_record
action_request
event_record
rule_evaluation_log
execution_trace
task_record
approval_record
audit_log
```

运行态表重点字段：

```text
tenant_id
object_type_id
object_id
action_id
event_type
correlation_id
execution_id
idempotency_key
actor_type
actor_id
status
created_at
updated_at
```

### 6.3 object_record 建议

第一版：

```text
id
tenant_id
object_type_id
values_json
state_id
version
created_at
updated_at
created_by
updated_by
deleted_at
```

`values_json` 使用 JSONB。

后期对高频字段做冗余列：

```text
display_name
status
owner_id
created_at
updated_at
```

不要一开始为每个业务对象建一张宽表。

## 7. API 设计

### 7.1 配置态 API

```text
POST   /api/meta/object-types
GET    /api/meta/object-types
GET    /api/meta/object-types/{id}
PUT    /api/meta/object-types/{id}

POST   /api/meta/field-definitions
POST   /api/meta/relation-definitions
POST   /api/meta/action-definitions
POST   /api/meta/lifecycles
POST   /api/meta/rule-blocks
POST   /api/meta/rule-bindings
POST   /api/meta/views

POST   /api/meta/publish/validate
POST   /api/meta/publish
GET    /api/meta/publish/versions
POST   /api/meta/publish/rollback
```

### 7.2 运行态 API

```text
GET    /api/runtime/objects/{objectTypeId}
GET    /api/runtime/objects/{objectTypeId}/{objectId}
POST   /api/runtime/objects/{objectTypeId}

POST   /api/runtime/actions/{actionId}/request
POST   /api/runtime/actions/{actionRequestId}/confirm
GET    /api/runtime/actions/{actionRequestId}

GET    /api/runtime/events
GET    /api/runtime/audit-logs
GET    /api/runtime/execution-traces/{executionId}
```

注意：

```text
POST /api/runtime/objects/{objectTypeId}
```

也应该内部转成 create action，而不是绕过动作系统。

### 7.3 Agent API

Java 后端提供受控工具接口，Python Agent 调用。

```text
GET    /api/agent/context/object-types
GET    /api/agent/context/object-types/{id}
GET    /api/agent/context/rule-blocks
POST   /api/agent/drafts/rule
POST   /api/agent/action-plans
POST   /api/runtime/actions/{actionId}/request
```

Agent 不能调用任意数据写入接口。

### 7.4 MCP Tool API

MCP Bridge Service 对外暴露工具协议，对内调用配置态 API。

建议工具分组：

```text
meta.*
draft.*
validate.*
analyze.*
submit.*
```

工具示例：

```text
meta.get_object_type
draft.create_rule_binding
validate.config_draft
analyze.impact
submit.change_proposal
```

调用原则：

```text
读取可以直接返回
写入只能写草稿
发布必须人工确认
运行态数据默认只读
所有调用必须审计
```

MCP 不直接暴露数据库，不直接暴露内部 Java Service，也不直接接受任意 JSON 写入。每个工具都必须有明确入参 Schema 和权限校验。

### 7.5 MCP Auth API

MCP 需要专门的授权 API。

建议接口：

```text
POST   /api/mcp/projects/{projectId}/keys
GET    /api/mcp/projects/{projectId}/keys
POST   /api/mcp/projects/{projectId}/keys/{keyId}/revoke

POST   /api/mcp/user-identity-keys
GET    /api/mcp/user-identity-keys
POST   /api/mcp/user-identity-keys/{keyId}/revoke

POST   /api/mcp/operation-keys
POST   /api/mcp/operation-keys/{keyId}/revoke
```

创建 AI Operation Key 的输入：

```json
{
  "projectId": "project.demo",
  "environment": "dev",
  "userId": "user.001",
  "scopes": [
    "meta:read",
    "draft:write",
    "validate:run",
    "analyze:run",
    "submit:proposal"
  ],
  "expiresInSeconds": 3600
}
```

生成后 Codex 可以用这个 Key 调用 MCP 工具。后端通过 Key 反查项目、用户和权限范围。

## 8. 规则执行链路

动作请求流程：

```text
ActionRequest created
  -> load ActionDefinition
  -> validate permission
  -> validate input
  -> validate state
  -> evaluate pre rules
  -> merge rule actions
  -> block / require approval / execute
  -> apply action effects in transaction
  -> emit event
  -> evaluate post rules
  -> write audit log
```

强约束：

- 同一个 executionId 内同一规则只允许命中一次
- 同一对象同一动作必须幂等
- 规则自动发起动作默认只生成执行计划
- 高风险动作必须人工确认
- Agent 发起动作默认需要经过权限和规则校验

## 9. 事务边界

每次对象动作是一个事务边界。

事务内：

- 校验权限
- 校验参数
- 校验规则
- 写 object_record
- 写 relation_record
- 写 event_record
- 写 audit_log

事务外：

- Agent 推理
- 知识库检索
- 通知发送
- 搜索索引更新
- 后续异步任务

不要把 Agent 推理放进数据库事务。

## 10. 发布机制

配置态必须发布后才能影响运行态。

发布流程：

```text
保存草稿
  -> 静态校验
  -> 影响分析
  -> 规则测试
  -> 人工确认
  -> 生成 publish_version
  -> 冻结版本
  -> 运行态加载新版本
```

运行态记录必须带配置版本：

```text
object_schema_version
rule_version
action_version
publish_version
```

这样后续才能回放历史。

## 11. 可塑性来自哪里

BizGrow Studio 的可塑性不应该来自“随便写脚本”。

它应该来自：

- 对象模型可演进
- 字段可扩展
- 关系可建模
- 动作可定义
- 生命周期可绑定
- 规则 DSL 可组合
- 视图可投影
- Agent 可读取元模型并生成配置建议
- 发布版本可回滚
- 审计链路可追踪

这和传统低代码的差异是：

```text
传统低代码：表单 + 流程 + 脚本
BizGrow Studio：对象 + 关系 + 动作 + 状态 + 规则 + Agent
```

## 12. 第一版后端 MVP

第一版后端不要一次性做全平台。

建议最小闭环：

```text
ObjectType
FieldDefinition
ActionDefinition
RuleBlock
RuleBinding
ObjectRecord
ActionRequest
RuleEvaluationLog
AuditLog
```

先跑通：

```text
定义对象
  -> 定义字段
  -> 定义动作
  -> 定义规则
  -> 发布配置
  -> 创建对象实例
  -> 请求动作
  -> 规则命中
  -> 阻断或要求审批
  -> 写审计
```

暂缓：

- 完整图数据库
- 完整流程引擎
- 完整 BPMN
- 完整 OWL 推理
- 任意脚本语言
- 复杂自动级联
- Agent 自动改核心数据

## 13. 风险与防线

### 13.1 复杂度失控

风险：

```text
配置能力越做越自由，最后变成不可维护平台。
```

防线：

```text
所有写入通过动作
规则 DSL 有限表达
配置发布前强校验
自动化能力分阶段开放
```

### 13.2 规则循环

风险：

```text
对象 A 触发对象 B，对象 B 又触发对象 A。
```

防线：

```text
correlationId
executionId
maxDepth
sameRuleOncePerExecution
sameActionSameObjectOncePerExecution
```

### 13.3 变成大宽表

风险：

```text
为了开发快，把所有字段塞进一张表。
```

防线：

```text
字段定义独立
对象记录 JSONB
关系记录独立
动作和规则独立
高频字段后期冗余
```

### 13.4 Agent 黑盒

风险：

```text
Agent 直接改业务数据，结果不可解释。
```

防线：

```text
Agent 只能生成建议或发起动作
动作必须通过权限和规则校验
所有 Agent 调用写审计
```

## 14. 结论

后端架构的核心不是“支持更多表单能力”，而是支撑一个长期可演进的企业业务元系统。

最低要求是覆盖传统低代码平台的基础能力：

- 表单
- 列表
- 详情
- 关联
- 权限
- 流程
- 规则
- 仪表盘
- 审批
- 移动端或运行端

但底层必须完全不同：

```text
传统低代码面向表单交付
BizGrow Studio 面向业务对象演进
```

这就是项目是否能继续往三期、四期、长期业务系统演进的关键。
