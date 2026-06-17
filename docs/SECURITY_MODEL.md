# BizGrow Studio 安全模型 v0.1

## 1. 目标

BizGrow Studio 的安全模型必须覆盖三类主体：

- 人：用户、管理员、实施人员、业务人员
- 系统：后端服务、规则引擎、发布系统
- AI：Agent、Codex、IDE Agent、MCP 调用方

核心目标：

```text
任何配置变更、业务动作、AI 代劳操作，都必须知道是谁、在哪个项目、基于什么权限、做了什么、结果如何。
```

安全模型必须支撑：

- 多租户隔离
- 项目隔离
- 角色权限
- 字段权限
- 动作权限
- 配置发布权限
- MCP Key 授权
- Agent 能力边界
- 审计追踪

## 2. 安全边界

BizGrow Studio 至少有四层边界。

### 2.1 Tenant 边界

租户是最高隔离边界。

要求：

- 不同 tenant 的配置和运行数据完全隔离
- 所有表必须包含 `tenant_id`
- 所有 API 必须校验 tenant
- Key 不能跨 tenant 使用

### 2.2 Project 边界

项目是业务系统搭建单元。

要求：

- 同一 tenant 下可以有多个 project
- MCP Key 必须绑定 project
- 发布版本必须绑定 project
- 配置草稿必须绑定 project
- 审计日志必须绑定 project

### 2.3 Environment 边界

环境用于区分 dev / test / prod。

要求：

- Key 必须绑定环境
- dev 配置不能直接影响 prod
- prod 环境默认禁止高风险 MCP 写操作
- 发布到 prod 必须人工确认

### 2.4 User 边界

所有操作必须能追溯到用户或服务账号。

要求：

- 人工操作绑定 userId
- Agent 操作绑定 agentId 和授权 userId
- Codex 操作绑定 aiClient、sessionId 和授权 userId
- 系统任务绑定 system actor

## 3. 主体模型

### 3.1 User

```ts
interface User {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  status: 'active' | 'disabled';
  roleIds: string[];
  createdAt: string;
}
```

### 3.2 ServiceAccount

用于系统间调用。

```ts
interface ServiceAccount {
  id: string;
  tenantId: string;
  name: string;
  scopes: string[];
  enabled: boolean;
  createdAt: string;
}
```

### 3.3 AgentIdentity

用于平台内 Agent。

```ts
interface AgentIdentity {
  id: string;
  tenantId: string;
  projectId: string;
  name: string;
  capabilityId: string;
  enabled: boolean;
  createdAt: string;
}
```

### 3.4 AiClientIdentity

用于 Codex、IDE Agent、内部自动化工具。

```ts
interface AiClientIdentity {
  id: string;
  name: 'codex' | 'ide_agent' | 'internal_agent';
  trusted: boolean;
}
```

## 4. ActorRef

所有运行日志、审计日志、事件记录都应使用统一 ActorRef。

```ts
interface ActorRef {
  type: 'user' | 'service_account' | 'agent' | 'ai_client' | 'system';
  id: string;
  displayName?: string;
  delegatedByUserId?: string;
  projectId?: string;
  sessionId?: string;
}
```

示例：

```json
{
  "type": "ai_client",
  "id": "codex",
  "displayName": "Codex",
  "delegatedByUserId": "user.001",
  "projectId": "project.demo",
  "sessionId": "mcp_session.001"
}
```

## 5. 角色与权限

### 5.1 Role

```ts
interface Role {
  id: string;
  tenantId: string;
  projectId?: string;
  name: string;
  code: string;
  permissions: Permission[];
}
```

### 5.2 Permission

```ts
interface Permission {
  resourceType:
    | 'object_type'
    | 'field'
    | 'view'
    | 'action'
    | 'rule'
    | 'publish'
    | 'mcp'
    | 'agent'
    | 'audit'
    | 'system';
  resourceId?: string;
  operation:
    | 'read'
    | 'create'
    | 'update'
    | 'delete'
    | 'execute'
    | 'approve'
    | 'publish'
    | 'revoke'
    | 'admin';
  effect: 'allow' | 'deny';
  condition?: Record<string, unknown>;
}
```

原则：

- deny 优先于 allow
- 权限默认拒绝
- 发布权限必须单独授予
- MCP Key 管理权限必须单独授予
- Agent 能力配置权限必须单独授予

## 6. 对象权限

对象权限控制业务对象访问。

维度：

- 对象类型权限
- 对象实例权限
- 字段权限
- 动作权限
- 视图权限

### 6.1 Object Permission

```ts
interface ObjectPermissionPolicy {
  id: string;
  tenantId: string;
  projectId: string;
  objectTypeId: string;
  readRoles: string[];
  createRoles: string[];
  updateRoles: string[];
  deleteRoles: string[];
}
```

### 6.2 Field Permission

```ts
interface FieldPermissionPolicy {
  fieldId: string;
  readRoles: string[];
  writeRoles: string[];
  maskRoles?: string[];
}
```

字段权限必须作用于：

- 表单渲染
- 列表展示
- 详情展示
- API 返回
- Agent 上下文
- MCP 读取工具

### 6.3 Action Permission

```ts
interface ActionPermissionPolicy {
  actionId: string;
  executeRoles: string[];
  requireConfirmationRoles?: string[];
}
```

动作权限是运行态安全核心。

任何用户、Agent、Codex 都不能绕过动作权限。

## 7. 配置权限

配置权限控制配置端。

建议拆分：

```text
meta:read
meta:write
rule:write
rule:publish
view:write
action:write
lifecycle:write
publish:validate
publish:execute
publish:rollback
```

第一版建议：

- 实施管理员可以写配置
- 普通业务管理员只能改轻量表单和视图
- 发布配置需要单独权限
- 高风险规则发布需要二次确认

## 8. MCP 安全模型

MCP 是配置协作通道，不是后门。

### 8.1 Key 类型

```text
Project Key
  -> 标识项目和环境

User Identity Key
  -> 标识授权用户

AI Operation Key
  -> 短期合并授权，绑定项目、环境、用户、scope、session
```

第一版建议优先实现 AI Operation Key。

### 8.2 AI Operation Key

```ts
interface AiOperationKey {
  id: string;
  tenantId: string;
  projectId: string;
  environment: 'dev' | 'test' | 'prod';
  userId: string;
  aiClient: 'codex' | 'ide_agent' | 'internal_agent';
  sessionId: string;
  keyHash: string;
  scopes: McpScope[];
  enabled: boolean;
  expiresAt: string;
  createdAt: string;
  revokedAt?: string;
}
```

### 8.3 MCP Scope

允许：

```text
meta:read
draft:write
draft:delete
validate:run
analyze:run
submit:proposal
rule:generate
view:generate
agent:read
audit:read
```

谨慎开放：

```text
runtime:read
```

第一版禁止：

```text
config:publish
runtime:write
permission:admin
key:admin
```

### 8.4 MCP 调用校验

每次 MCP 工具调用必须校验：

```text
Key 是否存在
Key 是否启用
Key 是否过期
Key 是否被吊销
scope 是否满足工具要求
用户是否仍然有效
用户是否仍有项目权限
项目是否有效
环境是否匹配
工具是否允许在当前环境执行
```

### 8.5 MCP 审计

每次调用必须记录：

- tenantId
- projectId
- environment
- userId
- aiClient
- sessionId
- toolName
- scopes
- status
- createdDraftIds
- proposalId
- startedAt
- endedAt

## 9. Agent 安全模型

Agent 不是超级用户。

Agent 能力必须由 AgentCapability 控制：

```ts
interface AgentCapability {
  id: string;
  tenantId: string;
  projectId: string;
  readableObjectTypeIds: string[];
  readableFieldIds: string[];
  callableActionIds: string[];
  knowledgeScopeIds: string[];
  maxExecutionSteps: number;
  requireHumanConfirmation: boolean;
  auditLevel: 'normal' | 'strict';
}
```

要求：

- Agent 只能读取授权对象
- Agent 只能读取授权字段
- Agent 只能调用授权动作
- Agent 不能直接写 object_record
- Agent 生成配置必须进入草稿
- Agent 发起动作必须经过权限、规则和审计

## 10. 发布安全

配置发布是高风险操作。

发布前必须校验：

- 字段引用是否存在
- 关系引用是否存在
- 动作引用是否存在
- 规则 DSL 是否合法
- 权限是否完整
- 是否存在高风险规则
- 是否存在循环依赖
- 是否影响运行端

发布要求：

- 发布必须由有权限用户执行
- 高风险发布需要二次确认
- prod 发布必须人工确认
- 发布后生成不可变版本
- 运行态记录必须关联 publishVersion

## 11. 运行安全

运行态写入必须通过动作。

动作执行必须校验：

```text
tenant
project
environment
actor
objectType
objectId
action permission
input schema
current state
pre rules
idempotency
execution depth
```

禁止：

- 前端直接 update object_record
- Agent 直接 update object_record
- MCP 直接 update object_record
- 规则直接执行任意脚本

## 12. 审计模型

所有关键操作写 AuditLog。

```ts
interface AuditLog {
  id: string;
  tenantId: string;
  projectId: string;
  environment: 'dev' | 'test' | 'prod';
  actor: ActorRef;
  category:
    | 'config'
    | 'runtime'
    | 'action'
    | 'rule'
    | 'agent'
    | 'mcp'
    | 'permission'
    | 'publish'
    | 'system';
  operation: string;
  targetType?: string;
  targetId?: string;
  beforeHash?: string;
  afterHash?: string;
  correlationId?: string;
  executionId?: string;
  sessionId?: string;
  result: 'succeeded' | 'failed' | 'blocked';
  message?: string;
  createdAt: string;
}
```

审计要求：

- 高风险操作必须记录 before / after 摘要
- MCP 调用必须记录 sessionId
- Agent 操作必须记录 delegatedByUserId 或触发来源
- 规则命中必须记录 evaluation log
- 发布必须记录版本和差异摘要

## 13. Key 存储要求

所有 Key：

- 明文只展示一次
- 数据库存 hash
- 支持过期
- 支持吊销
- 支持轮换
- 支持最后使用时间
- 支持最后使用 IP / client 信息

禁止：

- 日志打印明文 Key
- 前端本地长期保存高权限 Key
- 生产环境使用永不过期 AI Operation Key

## 14. 数据库表建议

安全相关表：

```text
tenant
project
environment
user_account
role
permission_policy
service_account
agent_identity
agent_capability
mcp_project_key
mcp_user_identity_key
mcp_operation_key
mcp_tool_call_log
audit_log
```

所有表保留：

```text
tenant_id
project_id
created_at
updated_at
created_by
updated_by
```

Key 表额外保留：

```text
key_hash
scopes
enabled
expires_at
revoked_at
last_used_at
last_used_ip
```

## 15. 第一版实现范围

MVP 必须实现：

- tenant 预留
- project
- user
- role
- 基础权限校验
- 对象权限
- 字段权限
- 动作权限
- 发布权限
- AI Operation Key
- MCP scope 校验
- MCP 调用审计
- Action audit
- Rule evaluation log

MVP 暂缓：

- 完整组织架构
- 复杂数据权限表达式
- 双 Key 模式
- SSO
- 细粒度 ABAC
- 外部 IAM 集成
- Key 自动轮换

## 16. 核心结论

BizGrow Studio 的安全模型要保证：

```text
人不能越权操作。
Agent 不能绕过动作。
Codex 不能绕过草稿和发布。
规则不能绕过审计。
系统不能不知道是谁授权了 AI。
```

这套安全模型是产品能否进入企业现场的前提。
