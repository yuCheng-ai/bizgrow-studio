# BizGrow Studio 元模型 Schema v0.1

## 1. 说明

本文档定义 BizGrow Studio 第一版元系统的核心数据结构。

目标不是一次性定义完整平台，而是给后端建模、前端配置台、规则执行器、Agent 工具调用提供统一数据契约。

设计原则：

- 配置态与运行态分离
- 对象动作是核心数据写入入口
- 规则使用结构化 DSL，不执行任意脚本
- Agent 只能通过授权工具调用系统动作
- 所有自动化执行必须可审计、可回放
- Schema 优先支持 JSON 存储与 API 传输，后续可映射到数据库表

## 2. 命名约定

### 2.1 ID

所有元模型对象使用稳定字符串 ID。

建议格式：

```text
object.order
field.order.amount
relation.order.customer
action.order.submit_review
event.action.requested
state.order.reviewing
rule.order.high_amount_approval
view.order.default_detail
agent.sales_assistant
```

### 2.2 Version

配置对象必须支持版本。

```json
{
  "version": 1,
  "status": "draft"
}
```

配置状态建议：

```text
draft
published
archived
disabled
```

### 2.3 Tenant

从第一版开始保留多租户字段。

```json
{
  "tenantId": "tenant.demo"
}
```

即使 MVP 阶段只做单租户，也不要删除该字段。

## 3. 配置态总览

配置态用于定义系统如何运行。

核心结构：

```text
OntologyPackage
  -> ObjectType
    -> FieldDefinition
    -> RelationDefinition
    -> ActionDefinition
    -> LifecycleDefinition
    -> RuleBinding
    -> ViewDefinition
    -> PermissionPolicy
  -> RuleBlock
  -> AgentCapability
```

## 4. OntologyPackage 本体包

本体包用于组织一组对象、关系、规则和视图。

```ts
interface OntologyPackage {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  version: number;
  status: ConfigStatus;
  domains: DomainDefinition[];
  objectTypeIds: string[];
  ruleBlockIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
```

示例：

```json
{
  "id": "ontology.manufacturing_core",
  "tenantId": "tenant.demo",
  "name": "企业核心业务本体",
  "code": "ManufacturingCore",
  "version": 1,
  "status": "draft",
  "domains": [
    {
      "id": "domain.sales",
      "name": "销售域"
    }
  ],
  "objectTypeIds": ["object.order", "object.customer"],
  "ruleBlockIds": ["rule_block.number.gt", "rule_block.require_approval"],
  "createdAt": "2026-06-17T10:00:00+08:00",
  "updatedAt": "2026-06-17T10:00:00+08:00",
  "createdBy": "user.admin",
  "updatedBy": "user.admin"
}
```

## 5. ObjectType 对象类型

对象类型是业务元系统的核心。

```ts
interface ObjectType {
  id: string;
  tenantId: string;
  packageId: string;
  name: string;
  code: string;
  description?: string;
  domainId?: string;
  category: ObjectCategory;
  semanticType?: string;
  primaryFieldId?: string;
  displayFieldIds: string[];
  fieldIds: string[];
  relationIds: string[];
  actionIds: string[];
  lifecycleId?: string;
  viewIds: string[];
  ruleBindingIds: string[];
  permissionPolicyId?: string;
  version: number;
  status: ConfigStatus;
  createdAt: string;
  updatedAt: string;
}
```

建议分类：

```ts
type ObjectCategory =
  | 'master_data'
  | 'transaction'
  | 'document'
  | 'resource'
  | 'state'
  | 'execution'
  | 'knowledge'
  | 'system';
```

示例：

```json
{
  "id": "object.order",
  "tenantId": "tenant.demo",
  "packageId": "ontology.manufacturing_core",
  "name": "订单",
  "code": "Order",
  "description": "客户交付承诺和后续履约的业务对象",
  "domainId": "domain.sales",
  "category": "transaction",
  "semanticType": "business.transaction.order",
  "primaryFieldId": "field.order.id",
  "displayFieldIds": ["field.order.order_no", "field.order.customer", "field.order.status"],
  "fieldIds": ["field.order.id", "field.order.order_no", "field.order.amount"],
  "relationIds": ["relation.order.customer"],
  "actionIds": ["action.order.submit_review"],
  "lifecycleId": "lifecycle.order.default",
  "viewIds": ["view.order.list", "view.order.detail"],
  "ruleBindingIds": ["rule_binding.order.high_amount_approval"],
  "version": 1,
  "status": "draft",
  "createdAt": "2026-06-17T10:00:00+08:00",
  "updatedAt": "2026-06-17T10:00:00+08:00"
}
```

## 6. FieldDefinition 字段定义

```ts
interface FieldDefinition {
  id: string;
  tenantId: string;
  objectTypeId: string;
  name: string;
  code: string;
  description?: string;
  dataType: FieldDataType;
  semanticType?: string;
  required: boolean;
  unique: boolean;
  multiple: boolean;
  defaultValue?: unknown;
  reference?: FieldReference;
  enumOptions?: EnumOption[];
  validation?: FieldValidation;
  index?: FieldIndex;
  permission?: FieldPermission;
  agentAccess: AgentFieldAccess;
  version: number;
  status: ConfigStatus;
}
```

字段类型：

```ts
type FieldDataType =
  | 'string'
  | 'text'
  | 'number'
  | 'decimal'
  | 'money'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'enum'
  | 'reference'
  | 'file'
  | 'json'
  | 'state';
```

引用字段：

```ts
interface FieldReference {
  targetObjectTypeId: string;
  targetFieldId: string;
  displayFieldId?: string;
  relationId?: string;
}
```

Agent 字段权限：

```ts
type AgentFieldAccess =
  | 'none'
  | 'read'
  | 'suggest'
  | 'write_via_action';
```

示例：

```json
{
  "id": "field.order.amount",
  "tenantId": "tenant.demo",
  "objectTypeId": "object.order",
  "name": "订单金额",
  "code": "amount",
  "dataType": "money",
  "semanticType": "commercial.amount",
  "required": true,
  "unique": false,
  "multiple": false,
  "validation": {
    "min": 0
  },
  "index": {
    "enabled": true,
    "type": "btree"
  },
  "permission": {
    "readRoles": ["role.sales", "role.finance"],
    "writeRoles": ["role.sales"]
  },
  "agentAccess": "read",
  "version": 1,
  "status": "draft"
}
```

## 7. RelationDefinition 关系定义

关系定义对象类型之间的语义连接。

```ts
interface RelationDefinition {
  id: string;
  tenantId: string;
  packageId: string;
  name: string;
  code: string;
  description?: string;
  sourceObjectTypeId: string;
  targetObjectTypeId: string;
  relationKind: RelationKind;
  cardinality: Cardinality;
  sourceFieldId?: string;
  targetFieldId?: string;
  direction: RelationDirection;
  cascadePolicy: CascadePolicy;
  impactPolicy: ImpactPolicy;
  version: number;
  status: ConfigStatus;
}
```

关系语义：

```ts
type RelationKind =
  | 'reference'
  | 'contains'
  | 'generates'
  | 'depends_on'
  | 'consumes'
  | 'affects'
  | 'belongs_to'
  | 'summarizes';
```

基数：

```ts
type Cardinality =
  | 'one_to_one'
  | 'one_to_many'
  | 'many_to_one'
  | 'many_to_many';
```

级联策略：

```ts
interface CascadePolicy {
  mode: 'none' | 'restrict' | 'manual' | 'automatic';
  maxDepth: number;
  allowedActionIds: string[];
}
```

影响策略：

```ts
interface ImpactPolicy {
  enabled: boolean;
  direction: 'source_to_target' | 'target_to_source' | 'bidirectional';
  maxDepth: number;
}
```

第一版建议默认：

```json
{
  "cascadePolicy": {
    "mode": "none",
    "maxDepth": 0,
    "allowedActionIds": []
  },
  "impactPolicy": {
    "enabled": true,
    "direction": "source_to_target",
    "maxDepth": 1
  }
}
```

## 8. ActionDefinition 动作定义

动作是修改业务事实的唯一入口。

```ts
interface ActionDefinition {
  id: string;
  tenantId: string;
  objectTypeId: string;
  name: string;
  code: string;
  description?: string;
  actionKind: ActionKind;
  inputSchema: JsonSchema;
  outputSchema?: JsonSchema;
  preRuleBindingIds: string[];
  postRuleBindingIds: string[];
  effects: ActionEffect[];
  permissionPolicyId?: string;
  idempotency: IdempotencyPolicy;
  auditLevel: AuditLevel;
  confirmationPolicy: ConfirmationPolicy;
  version: number;
  status: ConfigStatus;
}
```

动作类型：

```ts
type ActionKind =
  | 'create'
  | 'update'
  | 'delete'
  | 'submit'
  | 'approve'
  | 'reject'
  | 'state_transition'
  | 'generate_object'
  | 'call_external'
  | 'custom';
```

动作影响：

```ts
type ActionEffect =
  | {
      type: 'set_field';
      fieldId: string;
      valueExpression: Expression;
    }
  | {
      type: 'state_transition';
      lifecycleId: string;
      fromStateId: string;
      toStateId: string;
    }
  | {
      type: 'create_object';
      targetObjectTypeId: string;
      mapping: Record<string, Expression>;
    }
  | {
      type: 'emit_event';
      eventTypeId: string;
      payloadExpression?: Expression;
    };
```

幂等策略：

```ts
interface IdempotencyPolicy {
  enabled: boolean;
  keyFields: string[];
  withinExecution: boolean;
}
```

确认策略：

```ts
interface ConfirmationPolicy {
  required: boolean;
  requiredWhenRuleBindingIds?: string[];
  confirmRoles?: string[];
}
```

示例：

```json
{
  "id": "action.order.submit_review",
  "tenantId": "tenant.demo",
  "objectTypeId": "object.order",
  "name": "提交评审",
  "code": "submitReview",
  "actionKind": "submit",
  "inputSchema": {
    "type": "object",
    "properties": {
      "comment": {
        "type": "string"
      }
    }
  },
  "preRuleBindingIds": ["rule_binding.order.high_amount_approval"],
  "postRuleBindingIds": [],
  "effects": [
    {
      "type": "state_transition",
      "lifecycleId": "lifecycle.order.default",
      "fromStateId": "state.order.draft",
      "toStateId": "state.order.reviewing"
    }
  ],
  "idempotency": {
    "enabled": true,
    "keyFields": ["objectId", "actionId"],
    "withinExecution": true
  },
  "auditLevel": "required",
  "confirmationPolicy": {
    "required": false
  },
  "version": 1,
  "status": "draft"
}
```

## 9. LifecycleDefinition 生命周期定义

```ts
interface LifecycleDefinition {
  id: string;
  tenantId: string;
  objectTypeId: string;
  name: string;
  initialStateId: string;
  stateIds: string[];
  transitions: StateTransition[];
  version: number;
  status: ConfigStatus;
}
```

```ts
interface StateDefinition {
  id: string;
  tenantId: string;
  objectTypeId: string;
  name: string;
  code: string;
  category: 'initial' | 'normal' | 'terminal' | 'exception';
}
```

```ts
interface StateTransition {
  id: string;
  name: string;
  fromStateId: string;
  toStateId: string;
  actionId: string;
  guardRuleBindingIds: string[];
}
```

原则：

- 状态机绑定对象类型
- 状态流转通过动作触发
- 规则只作为 guard，不直接任意改状态

## 10. RuleBlock 规则构件

规则构件是全局、业务无关的 DSL 积木。

它不是具体业务规则，而是可复用的规则表达能力。

```ts
interface RuleBlock {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  kind: RuleBlockKind;
  description?: string;
  paramSchema: JsonSchema;
  outputType?: string;
  dslTemplate: Record<string, unknown>;
  examples: string[];
  version: number;
  status: ConfigStatus;
}
```

```ts
type RuleBlockKind =
  | 'trigger'
  | 'condition'
  | 'logic'
  | 'action';
```

示例：

```json
{
  "id": "rule_block.number.gt",
  "tenantId": "tenant.demo",
  "name": "数字大于",
  "code": "numberGreaterThan",
  "kind": "condition",
  "description": "判断某个数字字段是否大于给定值",
  "paramSchema": {
    "type": "object",
    "required": ["fieldId", "value"],
    "properties": {
      "fieldId": {
        "type": "string"
      },
      "value": {
        "type": "number"
      }
    }
  },
  "dslTemplate": {
    "operator": "gt"
  },
  "examples": ["订单金额大于 100000"],
  "version": 1,
  "status": "published"
}
```

## 11. RuleBinding 业务规则实例

RuleBinding 是挂到某个对象、动作、状态或事件上的业务规则实例。

```ts
interface RuleBinding {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  scope: RuleScope;
  trigger: RuleTrigger;
  condition: RuleExpression;
  actions: RuleAction[];
  affectedFieldIds: string[];
  affectedActionIds: string[];
  affectedTransitionIds: string[];
  priority: number;
  enabled: boolean;
  riskLevel: RiskLevel;
  ownerRoleId?: string;
  version: number;
  status: ConfigStatus;
}
```

规则作用域：

```ts
interface RuleScope {
  objectTypeId?: string;
  actionId?: string;
  lifecycleId?: string;
  viewId?: string;
  global?: boolean;
}
```

触发时机：

```ts
type RuleTrigger =
  | {
      type: 'object_created';
      objectTypeId: string;
    }
  | {
      type: 'field_changed';
      objectTypeId: string;
      fieldId: string;
    }
  | {
      type: 'action_requested';
      actionId: string;
    }
  | {
      type: 'action_succeeded';
      actionId: string;
    }
  | {
      type: 'state_changed';
      lifecycleId: string;
      fromStateId?: string;
      toStateId?: string;
    }
  | {
      type: 'manual';
    }
  | {
      type: 'scheduled';
      cron: string;
    };
```

条件表达式：

```ts
type RuleExpression =
  | {
      op: 'all';
      items: RuleExpression[];
    }
  | {
      op: 'any';
      items: RuleExpression[];
    }
  | {
      op: 'not';
      item: RuleExpression;
    }
  | {
      op: 'compare';
      left: Expression;
      comparator: Comparator;
      right: Expression;
    }
  | {
      op: 'block';
      blockId: string;
      params: Record<string, unknown>;
    };
```

比较符：

```ts
type Comparator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'not_in'
  | 'contains'
  | 'empty'
  | 'not_empty';
```

规则动作：

```ts
type RuleAction =
  | {
      type: 'block_action';
      reason: string;
    }
  | {
      type: 'require_approval';
      roleId: string;
      reason?: string;
    }
  | {
      type: 'set_field';
      fieldId: string;
      value: Expression;
    }
  | {
      type: 'create_task';
      assigneeRoleId: string;
      title: string;
    }
  | {
      type: 'call_agent';
      agentId: string;
      task: string;
    }
  | {
      type: 'write_audit';
      level: 'info' | 'warning' | 'error';
      message: string;
    };
```

示例：

```json
{
  "id": "rule_binding.order.high_amount_approval",
  "tenantId": "tenant.demo",
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
  "affectedFieldIds": ["field.order.amount"],
  "affectedActionIds": ["action.order.submit_review"],
  "affectedTransitionIds": ["transition.order.draft_to_reviewing"],
  "priority": 100,
  "enabled": true,
  "riskLevel": "high",
  "ownerRoleId": "role.finance",
  "version": 1,
  "status": "published"
}
```

## 12. Expression 表达式

规则、动作、视图条件都可以复用表达式。

第一版表达式必须保持有限能力，避免演变成不可控脚本语言。

```ts
type Expression =
  | {
      type: 'literal';
      value: unknown;
    }
  | {
      type: 'field';
      fieldId: string;
    }
  | {
      type: 'context';
      path: string;
    }
  | {
      type: 'function';
      functionId: string;
      args: Expression[];
    };
```

第一版函数必须白名单：

```text
date.days_from_now
date.now
number.sum
number.multiply
text.concat
object.exists
relation.count
```

## 13. ViewDefinition 视图定义

```ts
interface ViewDefinition {
  id: string;
  tenantId: string;
  objectTypeId: string;
  name: string;
  code: string;
  viewType: ViewType;
  layout: ViewLayout;
  dataSource: ViewDataSource;
  actionIds: string[];
  permissionPolicyId?: string;
  version: number;
  status: ConfigStatus;
}
```

```ts
type ViewType =
  | 'list'
  | 'detail'
  | 'form'
  | 'graph'
  | 'timeline'
  | 'dashboard'
  | 'kanban';
```

视图原则：

- 视图不持有核心业务逻辑
- 视图只负责展示、输入和触发动作
- 字段显隐和只读状态可以由规则控制，但必须可解释

## 14. AgentCapability Agent 能力定义

```ts
interface AgentCapability {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  readableObjectTypeIds: string[];
  readableFieldIds: string[];
  callableActionIds: string[];
  knowledgeScopeIds: string[];
  maxExecutionSteps: number;
  requireHumanConfirmation: boolean;
  toolPolicies: AgentToolPolicy[];
  auditLevel: AuditLevel;
  version: number;
  status: ConfigStatus;
}
```

```ts
interface AgentToolPolicy {
  toolId: string;
  allowed: boolean;
  requireConfirmation: boolean;
  rateLimit?: {
    maxCalls: number;
    windowSeconds: number;
  };
}
```

原则：

- Agent 可以读元模型和运行数据
- Agent 可以生成建议
- Agent 可以发起动作请求
- Agent 不直接写业务表
- Agent 生成的 DSL 必须经过校验和人工发布

## 15. 运行态模型

运行态用于记录真实业务实例和执行过程。

### 15.1 ObjectRecord 对象实例

```ts
interface ObjectRecord {
  id: string;
  tenantId: string;
  objectTypeId: string;
  version: number;
  values: Record<string, unknown>;
  stateId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  deletedAt?: string;
}
```

说明：

- values 的 key 建议使用 fieldId 或 field code
- 第一版建议 API 使用 fieldId，前端显示时再映射为 name
- 后端落库可以采用主表 + JSONB，也可以逐步拆冷热字段

### 15.2 RelationRecord 关系实例

```ts
interface RelationRecord {
  id: string;
  tenantId: string;
  relationDefinitionId: string;
  sourceObjectTypeId: string;
  sourceObjectId: string;
  targetObjectTypeId: string;
  targetObjectId: string;
  createdAt: string;
  createdBy: string;
}
```

### 15.3 ActionRequest 动作请求

```ts
interface ActionRequest {
  id: string;
  tenantId: string;
  actionId: string;
  objectTypeId: string;
  objectId: string;
  input: Record<string, unknown>;
  actor: ActorRef;
  source: ActionSource;
  correlationId: string;
  idempotencyKey: string;
  status: 'pending' | 'approved' | 'running' | 'succeeded' | 'failed' | 'blocked';
  createdAt: string;
  updatedAt: string;
}
```

```ts
type ActionSource =
  | 'user'
  | 'agent'
  | 'rule'
  | 'api'
  | 'system';
```

### 15.4 ExecutionTrace 执行轨迹

```ts
interface ExecutionTrace {
  id: string;
  tenantId: string;
  correlationId: string;
  executionId: string;
  actionRequestId?: string;
  eventIds: string[];
  matchedRuleIds: string[];
  executedActionIds: string[];
  status: 'running' | 'succeeded' | 'failed' | 'blocked';
  maxDepth: number;
  currentDepth: number;
  startedAt: string;
  endedAt?: string;
}
```

### 15.5 EventRecord 事件记录

```ts
interface EventRecord {
  id: string;
  tenantId: string;
  eventType: string;
  objectTypeId?: string;
  objectId?: string;
  actionRequestId?: string;
  actor: ActorRef;
  correlationId: string;
  executionId: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}
```

### 15.6 AuditLog 审计日志

```ts
interface AuditLog {
  id: string;
  tenantId: string;
  level: 'info' | 'warning' | 'error';
  category: 'object' | 'action' | 'rule' | 'agent' | 'permission' | 'system';
  message: string;
  actor: ActorRef;
  objectTypeId?: string;
  objectId?: string;
  actionRequestId?: string;
  ruleBindingId?: string;
  agentId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  correlationId: string;
  executionId?: string;
  createdAt: string;
}
```

## 16. 通用类型

```ts
type ConfigStatus =
  | 'draft'
  | 'published'
  | 'archived'
  | 'disabled';
```

```ts
type RiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';
```

```ts
type AuditLevel =
  | 'none'
  | 'normal'
  | 'required'
  | 'strict';
```

```ts
interface ActorRef {
  type: 'user' | 'agent' | 'system' | 'api';
  id: string;
  name?: string;
}
```

```ts
interface JsonSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  items?: unknown;
  [key: string]: unknown;
}
```

## 17. 后端表设计建议

第一版可以使用较少表 + JSONB，避免过早拆太细。

建议表：

```text
ontology_package
object_type
field_definition
relation_definition
action_definition
lifecycle_definition
rule_block
rule_binding
view_definition
agent_capability
object_record
relation_record
action_request
event_record
execution_trace
audit_log
```

多数配置表建议字段：

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

运行态表必须额外关注：

```text
correlation_id
execution_id
idempotency_key
status
actor_type
actor_id
```

## 18. 第一版必须实现的校验

发布配置前必须校验：

- objectTypeId 是否存在
- fieldId 是否属于对应 objectType
- relation 的 source/target 是否存在
- action effect 引用的字段和状态是否存在
- lifecycle transition 引用的 action 是否存在
- rule trigger 引用的 action/event/field 是否存在
- rule condition 引用的字段类型是否匹配 operator
- rule action 是否在白名单内
- Agent callableActionIds 是否存在
- 视图引用字段是否存在
- 是否存在明显循环依赖

动作执行前必须校验：

- 权限
- 输入参数
- 对象状态
- 幂等键
- 前置规则
- Agent 调用权限
- 最大执行深度

## 19. 与标准协议的映射

第一版内部不直接采用完整 RDF / OWL。

建议兼容映射：

```text
ObjectType      -> owl:Class
FieldDefinition -> rdf:Property / owl:DatatypeProperty
Relation        -> owl:ObjectProperty
Validation      -> SHACL Shape
RuleBinding     -> DMN-like decision rule
ObjectRecord    -> JSON-LD node
```

后续导出 JSON-LD 时，可以增加：

```json
{
  "@context": {
    "order": "https://bizgrow.ai/ontology/order#"
  },
  "@type": "Order",
  "@id": "record.order.10001"
}
```

## 20. MVP 最小闭环

第一版后端 MVP 只需要跑通：

```text
创建对象类型
  -> 创建字段
  -> 创建动作
  -> 创建生命周期
  -> 创建规则构件
  -> 绑定业务规则
  -> 发布配置
  -> 创建对象实例
  -> 请求动作
  -> 命中规则
  -> 执行动作或阻断
  -> 写入审计
```

这个闭环成立后，再扩展关系图谱、Agent 自动建议、知识库和运行端页面生成。
