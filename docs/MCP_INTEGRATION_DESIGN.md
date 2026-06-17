# BizGrow Studio MCP 集成设计 v0.1

## 1. 目标

BizGrow Studio 配置端需要原生支持 MCP，让 Codex 可以作为实施助手参与业务系统搭建。

MCP 的定位：

```text
配置协作通道，不是系统后门。
```

Codex 可以通过 MCP 做：

- 读取元模型
- 理解当前项目配置
- 生成对象、字段、表单、规则草稿
- 运行配置校验
- 生成影响分析
- 提交变更建议

Codex 不能通过 MCP 做：

- 直接发布配置
- 绕过权限
- 直接修改运行态业务数据
- 调用未授权工具
- 跳过审计

## 2. 核心原则

### 2.1 项目身份和用户身份必须同时存在

MCP 调用必须回答两个问题：

```text
AI 正在操作哪个项目？
是谁授权 AI 操作这个项目？
```

因此系统需要同时识别：

- Project Identity
- User Identity

技术上可以使用两个 Key，也可以合并成一个短期授权 Key。

### 2.2 MCP 只能进入草稿流程

Codex 生成的内容必须先成为草稿。

流程：

```text
Codex 生成草稿
  -> 系统校验
  -> 影响分析
  -> 人工审核
  -> 发布配置
```

### 2.3 所有调用必须可审计

每一次 MCP 工具调用都必须写日志。

审计必须能回答：

- 哪个项目
- 哪个环境
- 哪个用户
- 哪个 AI 工具
- 调用了哪个 MCP 工具
- 输入是什么
- 输出是什么
- 创建了什么草稿
- 是否提交审核
- 是否最终发布

## 3. 授权模型

### 3.1 Project Key

Project Key 标识一个项目允许被 MCP 访问。

字段：

```ts
interface McpProjectKey {
  id: string;
  tenantId: string;
  projectId: string;
  environment: 'dev' | 'test' | 'prod';
  name: string;
  keyHash: string;
  scopes: McpScope[];
  enabled: boolean;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
  lastUsedAt?: string;
}
```

要求：

- 由项目管理员创建
- 明文只展示一次
- 数据库存储 hash
- 支持禁用
- 支持轮换
- 支持环境隔离

### 3.2 User Identity Key

User Identity Key 标识哪个用户授权 AI 代劳。

字段：

```ts
interface McpUserIdentityKey {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  keyHash: string;
  scopes: McpScope[];
  enabled: boolean;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
  lastUsedAt?: string;
}
```

要求：

- 必须由用户本人授权，或由登录态换取
- 可设置短期有效
- 可随时吊销
- 权限不能超过用户自身权限

### 3.3 AI Operation Key

AI Operation Key 是可选的合并授权 Key。

它把项目身份、用户身份、权限范围、过期时间绑定成一个短期 token。

字段：

```ts
interface McpOperationKey {
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
  createdBy: string;
  revokedAt?: string;
}
```

建议：

- 默认使用 AI Operation Key
- 有效期建议 1 小时到 24 小时
- 可以按任务创建
- 每次 Codex 会话创建一个 sessionId
- 生产环境 scope 默认最小化

## 4. 认证方式

### 4.1 双 Key 模式

Codex 请求同时携带：

```http
X-BizGrow-Project-Key: bgp_xxx
X-BizGrow-User-Key: bgu_xxx
```

后端校验：

```text
Project Key 有效
User Key 有效
二者属于同一 tenant
User 对 project 有权限
scope 交集满足工具要求
```

### 4.2 合并 Key 模式

Codex 请求携带：

```http
Authorization: Bearer bgo_xxx
```

后端通过 AI Operation Key 解析：

```text
tenantId
projectId
environment
userId
aiClient
sessionId
scopes
expiresAt
```

推荐第一版优先实现合并 Key 模式，因为 Codex 侧接入更简单。

## 5. Scope 权限

Scope 必须细分，不允许一个万能 key。

建议第一版 scope：

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
runtime:read
audit:read
```

禁止第一版开放：

```text
config:publish
runtime:write
permission:admin
key:admin
```

说明：

- `meta:read`：读取对象、字段、关系、动作、规则构件
- `draft:write`：创建或修改配置草稿
- `validate:run`：运行配置校验
- `analyze:run`：运行影响分析
- `submit:proposal`：提交变更建议给人工审核
- `runtime:read`：只读运行态数据，默认不开生产环境

## 6. MCP 工具分组

### 6.1 meta 工具

读取元模型。

```text
meta.list_object_types
meta.get_object_type
meta.list_fields
meta.get_field
meta.list_relations
meta.list_actions
meta.list_lifecycles
meta.list_rule_blocks
meta.list_views
```

### 6.2 draft 工具

创建配置草稿。

```text
draft.create_object_type
draft.update_object_type
draft.create_fields
draft.update_fields
draft.create_relation
draft.create_action
draft.create_lifecycle
draft.create_form_view
draft.create_list_view
draft.create_detail_view
draft.create_rule_binding
draft.update_rule_binding
```

### 6.3 validate 工具

校验配置。

```text
validate.config_draft
validate.rule_dsl
validate.view_definition
validate.lifecycle
```

### 6.4 analyze 工具

分析影响。

```text
analyze.change_impact
analyze.field_references
analyze.rule_references
analyze.action_references
analyze.publish_diff
```

### 6.5 submit 工具

提交给人工审核。

```text
submit.change_proposal
submit.rule_test_cases
```

## 7. 工具定义示例

### 7.1 meta.get_object_type

Scope：

```text
meta:read
```

输入：

```json
{
  "objectTypeId": "object.order",
  "includeFields": true,
  "includeRelations": true,
  "includeActions": true,
  "includeRules": true
}
```

输出：

```json
{
  "objectType": {},
  "fields": [],
  "relations": [],
  "actions": [],
  "rules": []
}
```

### 7.2 draft.create_fields

Scope：

```text
draft:write
```

输入：

```json
{
  "objectTypeId": "object.order",
  "fields": [
    {
      "name": "订单金额",
      "code": "amount",
      "dataType": "money",
      "required": true,
      "semanticType": "commercial.amount"
    }
  ],
  "reason": "根据销售订单对象补充金额字段"
}
```

输出：

```json
{
  "draftId": "draft.001",
  "createdFieldIds": ["field.order.amount"],
  "warnings": []
}
```

### 7.3 draft.create_rule_binding

Scope：

```text
draft:write
rule:generate
```

输入：

```json
{
  "name": "大额订单需要老板审批",
  "scope": {
    "objectTypeId": "object.order",
    "actionId": "action.order.submit_review"
  },
  "trigger": {
    "type": "action_requested",
    "actionId": "action.order.submit_review"
  },
  "condition": {
    "op": "compare",
    "left": {
      "type": "field",
      "fieldId": "field.order.amount"
    },
    "comparator": "gt",
    "right": {
      "type": "literal",
      "value": 100000
    }
  },
  "actions": [
    {
      "type": "require_approval",
      "roleId": "role.boss",
      "reason": "订单金额超过审批阈值"
    }
  ],
  "reason": "用户要求超过 10 万的订单需要老板审批"
}
```

输出：

```json
{
  "draftId": "draft.rule.001",
  "ruleBindingId": "rule_binding.order.high_amount_approval",
  "validation": {
    "passed": true,
    "errors": [],
    "warnings": []
  }
}
```

### 7.4 validate.config_draft

Scope：

```text
validate:run
```

输入：

```json
{
  "draftId": "draft.001"
}
```

输出：

```json
{
  "passed": false,
  "errors": [
    {
      "code": "FIELD_CODE_DUPLICATED",
      "message": "字段编码 amount 已存在",
      "path": "fields[0].code"
    }
  ],
  "warnings": []
}
```

### 7.5 submit.change_proposal

Scope：

```text
submit:proposal
```

输入：

```json
{
  "draftIds": ["draft.001", "draft.rule.001"],
  "title": "补充订单金额字段和大额审批规则",
  "summary": "新增订单金额字段，并在提交评审时要求大额订单审批。",
  "riskLevel": "medium"
}
```

输出：

```json
{
  "proposalId": "proposal.001",
  "status": "pending_review",
  "reviewUrl": "/studio/proposals/proposal.001"
}
```

## 8. 审计模型

每次 MCP 调用记录 `McpToolCallLog`。

```ts
interface McpToolCallLog {
  id: string;
  tenantId: string;
  projectId: string;
  environment: 'dev' | 'test' | 'prod';
  userId: string;
  aiClient: 'codex' | 'ide_agent' | 'internal_agent';
  sessionId: string;
  toolName: string;
  scopes: McpScope[];
  requestHash: string;
  responseHash?: string;
  status: 'succeeded' | 'failed' | 'blocked';
  errorCode?: string;
  createdDraftIds: string[];
  proposalId?: string;
  startedAt: string;
  endedAt?: string;
}
```

敏感数据处理：

- 请求和响应可以存摘要 hash
- 非敏感字段可以存完整 JSON
- key 明文绝不入库
- 生产环境运行数据默认不写完整返回

## 9. 草稿与变更建议

MCP 写入只能创建或修改 Draft。

```ts
interface ConfigDraft {
  id: string;
  tenantId: string;
  projectId: string;
  environment: 'dev' | 'test' | 'prod';
  draftType:
    | 'object_type'
    | 'field'
    | 'relation'
    | 'action'
    | 'lifecycle'
    | 'view'
    | 'rule_binding';
  targetId?: string;
  payload: Record<string, unknown>;
  source: 'user' | 'codex' | 'agent' | 'import';
  createdBy: string;
  createdByAiClient?: string;
  mcpSessionId?: string;
  status: 'draft' | 'validated' | 'submitted' | 'rejected' | 'applied';
  validationResult?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
```

变更建议：

```ts
interface ChangeProposal {
  id: string;
  tenantId: string;
  projectId: string;
  environment: 'dev' | 'test' | 'prod';
  title: string;
  summary: string;
  draftIds: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  submittedBy: string;
  submittedByAiClient?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'published';
  reviewerId?: string;
  reviewedAt?: string;
  createdAt: string;
}
```

## 10. Codex 典型工作流

### 10.1 新建业务对象

```text
用户：帮我创建一个合同对象，包含合同编号、客户、金额、生效日期、状态。

Codex:
  -> meta.list_object_types
  -> draft.create_object_type
  -> draft.create_fields
  -> draft.create_form_view
  -> draft.create_list_view
  -> validate.config_draft
  -> analyze.change_impact
  -> submit.change_proposal
```

### 10.2 新增规则

```text
用户：合同金额超过 50 万需要总经理审批。

Codex:
  -> meta.get_object_type
  -> meta.list_actions
  -> meta.list_rule_blocks
  -> draft.create_rule_binding
  -> validate.rule_dsl
  -> analyze.rule_references
  -> submit.change_proposal
```

### 10.3 分析字段删除影响

```text
用户：这个字段能不能删？

Codex:
  -> meta.get_field
  -> analyze.field_references
  -> analyze.change_impact
```

此类操作只读，不创建草稿。

## 11. 安全边界

必须阻断：

- 无项目身份的调用
- 无用户身份的调用
- scope 不足的调用
- 已过期 key
- 已吊销 key
- 生产环境高风险草稿直接提交
- 尝试调用发布配置的工具
- 尝试修改运行态业务数据的工具
- 尝试读取无权限字段

## 12. 第一版实现范围

第一版必须实现：

- AI Operation Key
- meta.get_object_type
- meta.list_object_types
- meta.list_fields
- meta.list_rule_blocks
- draft.create_fields
- draft.create_form_view
- draft.create_rule_binding
- validate.config_draft
- validate.rule_dsl
- analyze.change_impact
- submit.change_proposal
- McpToolCallLog

第一版暂缓：

- 双 Key 模式
- runtime:read
- 自动发布
- 生产环境运行态读取
- MCP 直接创建权限策略
- MCP 管理 Key

## 13. 结论

MCP 能力是 BizGrow Studio 的重要差异化。

它让配置端不只是一个人手工操作的后台，而是一个可以被 Codex 安全调用的业务系统生成平台。

但 MCP 必须建立在：

```text
项目身份
用户授权
scope 权限
草稿机制
人工审核
发布管控
审计追踪
```

之上。

否则 MCP 会变成绕过系统治理的后门。
