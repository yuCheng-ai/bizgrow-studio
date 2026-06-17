# BizGrow Studio API 规格 v0.1

## 1. 目标

本文档定义 BizGrow Studio MVP 第一版 API 契约。

覆盖范围：

- 配置态 API
- 运行态 API
- 规则 API
- 发布 API
- MCP API
- 安全认证 API
- 审计 API

原则：

- 配置态和运行态分离
- 所有写入必须有权限校验
- 运行态核心写入必须通过动作
- MCP 只能创建草稿和提交建议
- 发布必须人工确认
- 所有高风险操作必须审计

## 2. 通用约定

### 2.1 Base URL

```text
/api
```

### 2.2 Content-Type

```http
Content-Type: application/json
```

### 2.3 通用 Header

```http
Authorization: Bearer <access_token>
X-BizGrow-Tenant-Id: tenant.demo
X-BizGrow-Project-Id: project.demo
X-BizGrow-Environment: dev
```

### 2.4 MCP Header

合并 Key 模式：

```http
Authorization: Bearer <ai_operation_key>
X-BizGrow-MCP-Client: codex
X-BizGrow-MCP-Session-Id: mcp_session.001
```

双 Key 模式后续支持：

```http
X-BizGrow-Project-Key: bgp_xxx
X-BizGrow-User-Key: bgu_xxx
```

### 2.5 通用响应

成功：

```json
{
  "success": true,
  "data": {},
  "traceId": "trace.001"
}
```

失败：

```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "没有执行该动作的权限",
    "details": {}
  },
  "traceId": "trace.001"
}
```

### 2.6 分页响应

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 128
}
```

## 3. 项目与环境 API

### 3.1 创建项目

```http
POST /api/projects
```

请求：

```json
{
  "name": "演示项目",
  "code": "demo_project",
  "description": "MVP 演示项目"
}
```

响应：

```json
{
  "id": "project.demo",
  "name": "演示项目",
  "code": "demo_project",
  "environments": ["dev", "test", "prod"]
}
```

### 3.2 项目列表

```http
GET /api/projects
```

## 4. 配置态 API

### 4.1 ObjectType

#### 创建对象类型

```http
POST /api/meta/object-types
```

请求：

```json
{
  "name": "合同",
  "code": "Contract",
  "description": "合同业务对象",
  "category": "document",
  "domainId": "domain.legal"
}
```

响应：

```json
{
  "id": "object.contract",
  "name": "合同",
  "code": "Contract",
  "category": "document",
  "version": 1,
  "status": "draft"
}
```

#### 对象类型列表

```http
GET /api/meta/object-types
```

查询参数：

```text
keyword
status
page
pageSize
```

#### 对象类型详情

```http
GET /api/meta/object-types/{objectTypeId}
```

查询参数：

```text
includeFields=true
includeRelations=true
includeActions=true
includeLifecycle=true
includeRules=true
includeViews=true
```

#### 更新对象类型

```http
PUT /api/meta/object-types/{objectTypeId}
```

#### 禁用对象类型

```http
POST /api/meta/object-types/{objectTypeId}/disable
```

### 4.2 FieldDefinition

#### 创建字段

```http
POST /api/meta/object-types/{objectTypeId}/fields
```

请求：

```json
{
  "name": "合同金额",
  "code": "amount",
  "dataType": "money",
  "required": true,
  "unique": false,
  "multiple": false,
  "semanticType": "commercial.amount",
  "validation": {
    "min": 0
  },
  "agentAccess": "read"
}
```

响应：

```json
{
  "id": "field.contract.amount",
  "objectTypeId": "object.contract",
  "name": "合同金额",
  "code": "amount",
  "dataType": "money",
  "version": 1,
  "status": "draft"
}
```

#### 字段列表

```http
GET /api/meta/object-types/{objectTypeId}/fields
```

#### 更新字段

```http
PUT /api/meta/fields/{fieldId}
```

#### 字段引用分析

```http
GET /api/meta/fields/{fieldId}/references
```

响应：

```json
{
  "fieldId": "field.contract.amount",
  "views": [],
  "rules": [],
  "actions": [],
  "relations": [],
  "canDelete": false
}
```

### 4.3 RelationDefinition

```http
POST /api/meta/relations
GET  /api/meta/object-types/{objectTypeId}/relations
PUT  /api/meta/relations/{relationId}
GET  /api/meta/relations/{relationId}/impact
```

创建请求：

```json
{
  "name": "合同关联客户",
  "code": "contractCustomer",
  "sourceObjectTypeId": "object.contract",
  "targetObjectTypeId": "object.customer",
  "relationKind": "reference",
  "cardinality": "many_to_one",
  "direction": "source_to_target",
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

### 4.4 ViewDefinition

```http
POST /api/meta/views
GET  /api/meta/object-types/{objectTypeId}/views
GET  /api/meta/views/{viewId}
PUT  /api/meta/views/{viewId}
```

创建表单视图：

```json
{
  "objectTypeId": "object.contract",
  "name": "合同录入表单",
  "code": "contractForm",
  "viewType": "form",
  "layout": {
    "sections": [
      {
        "title": "基础信息",
        "fields": ["field.contract.name", "field.contract.amount"]
      }
    ]
  },
  "actionIds": ["action.contract.create"]
}
```

### 4.5 ActionDefinition

```http
POST /api/meta/actions
GET  /api/meta/object-types/{objectTypeId}/actions
GET  /api/meta/actions/{actionId}
PUT  /api/meta/actions/{actionId}
```

创建请求：

```json
{
  "objectTypeId": "object.contract",
  "name": "提交审核",
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
  "effects": [
    {
      "type": "state_transition",
      "lifecycleId": "lifecycle.contract.default",
      "fromStateId": "state.contract.draft",
      "toStateId": "state.contract.reviewing"
    }
  ],
  "idempotency": {
    "enabled": true,
    "keyFields": ["objectId", "actionId"],
    "withinExecution": true
  },
  "auditLevel": "required"
}
```

### 4.6 LifecycleDefinition

```http
POST /api/meta/lifecycles
GET  /api/meta/object-types/{objectTypeId}/lifecycle
PUT  /api/meta/lifecycles/{lifecycleId}
```

创建请求：

```json
{
  "objectTypeId": "object.contract",
  "name": "合同生命周期",
  "initialStateId": "state.contract.draft",
  "states": [
    {
      "id": "state.contract.draft",
      "name": "草稿",
      "code": "draft",
      "category": "initial"
    },
    {
      "id": "state.contract.reviewing",
      "name": "审核中",
      "code": "reviewing",
      "category": "normal"
    }
  ],
  "transitions": [
    {
      "id": "transition.contract.submit_review",
      "name": "提交审核",
      "fromStateId": "state.contract.draft",
      "toStateId": "state.contract.reviewing",
      "actionId": "action.contract.submit_review",
      "guardRuleBindingIds": []
    }
  ]
}
```

## 5. 规则 API

### 5.1 RuleBlock

```http
POST /api/rules/blocks
GET  /api/rules/blocks
GET  /api/rules/blocks/{ruleBlockId}
PUT  /api/rules/blocks/{ruleBlockId}
```

### 5.2 RuleBinding

```http
POST /api/rules/bindings
GET  /api/meta/object-types/{objectTypeId}/rules
GET  /api/rules/bindings/{ruleBindingId}
PUT  /api/rules/bindings/{ruleBindingId}
POST /api/rules/bindings/{ruleBindingId}/test
```

创建请求：

```json
{
  "name": "大额合同需要总经理审批",
  "scope": {
    "objectTypeId": "object.contract",
    "actionId": "action.contract.submit_review"
  },
  "trigger": {
    "type": "action_requested",
    "actionId": "action.contract.submit_review"
  },
  "condition": {
    "op": "compare",
    "left": {
      "type": "field",
      "fieldId": "field.contract.amount"
    },
    "comparator": "gt",
    "right": {
      "type": "literal",
      "value": 500000
    }
  },
  "actions": [
    {
      "type": "require_approval",
      "roleId": "role.general_manager",
      "reason": "合同金额超过 50 万"
    }
  ],
  "priority": 100,
  "enabled": true,
  "riskLevel": "high"
}
```

测试请求：

```json
{
  "objectValues": {
    "field.contract.amount": 600000
  },
  "actionInput": {}
}
```

测试响应：

```json
{
  "matched": true,
  "generatedActions": [
    {
      "type": "require_approval",
      "roleId": "role.general_manager"
    }
  ],
  "logs": []
}
```

## 6. 发布 API

### 6.1 发布校验

```http
POST /api/publish/validate
```

请求：

```json
{
  "target": "project",
  "draftIds": []
}
```

响应：

```json
{
  "passed": true,
  "errors": [],
  "warnings": [],
  "impact": {
    "objectTypeIds": [],
    "fieldIds": [],
    "ruleBindingIds": []
  }
}
```

### 6.2 发布配置

```http
POST /api/publish
```

请求：

```json
{
  "draftIds": [],
  "summary": "发布合同对象配置",
  "confirmRisk": true
}
```

响应：

```json
{
  "publishVersionId": "publish.001",
  "version": 1,
  "status": "published"
}
```

### 6.3 发布版本列表

```http
GET /api/publish/versions
```

### 6.4 回滚发布版本

```http
POST /api/publish/versions/{publishVersionId}/rollback
```

## 7. 运行态 API

### 7.1 创建对象实例

运行态创建也必须内部转成对象动作。

```http
POST /api/runtime/objects/{objectTypeId}
```

请求：

```json
{
  "values": {
    "field.contract.name": "年度采购合同",
    "field.contract.amount": 600000
  }
}
```

响应：

```json
{
  "objectId": "record.contract.001",
  "objectTypeId": "object.contract",
  "stateId": "state.contract.draft",
  "actionRequestId": "action_request.001"
}
```

### 7.2 对象列表

```http
GET /api/runtime/objects/{objectTypeId}
```

查询参数：

```text
viewId
keyword
filters
sort
page
pageSize
```

### 7.3 对象详情

```http
GET /api/runtime/objects/{objectTypeId}/{objectId}
```

查询参数：

```text
viewId
includeRelations=true
includeActions=true
includeAudit=true
```

### 7.4 请求动作

```http
POST /api/runtime/actions/{actionId}/request
```

请求：

```json
{
  "objectTypeId": "object.contract",
  "objectId": "record.contract.001",
  "input": {
    "comment": "提交审核"
  },
  "idempotencyKey": "contract.001.submit.review"
}
```

响应：

```json
{
  "actionRequestId": "action_request.002",
  "status": "blocked",
  "result": {
    "blocked": false,
    "requiredApprovals": [
      {
        "roleId": "role.general_manager",
        "reason": "合同金额超过 50 万"
      }
    ],
    "createdTaskIds": ["task.001"]
  },
  "executionId": "exec.001"
}
```

### 7.5 确认动作

```http
POST /api/runtime/actions/{actionRequestId}/confirm
```

### 7.6 动作详情

```http
GET /api/runtime/actions/{actionRequestId}
```

## 8. 审批与任务 API

```http
GET  /api/tasks
GET  /api/tasks/{taskId}
POST /api/tasks/{taskId}/approve
POST /api/tasks/{taskId}/reject
```

审批请求：

```json
{
  "comment": "同意"
}
```

## 9. 审计 API

```http
GET /api/audit/logs
GET /api/audit/execution-traces/{executionId}
GET /api/audit/rule-evaluations
```

查询参数：

```text
objectTypeId
objectId
actionRequestId
ruleBindingId
actorId
category
from
to
page
pageSize
```

## 10. MCP Auth API

### 10.1 创建 AI Operation Key

```http
POST /api/mcp/operation-keys
```

请求：

```json
{
  "projectId": "project.demo",
  "environment": "dev",
  "aiClient": "codex",
  "scopes": [
    "meta:read",
    "draft:write",
    "validate:run",
    "analyze:run",
    "submit:proposal",
    "rule:generate",
    "view:generate"
  ],
  "expiresInSeconds": 3600
}
```

响应：

```json
{
  "keyId": "mcp_operation_key.001",
  "operationKey": "bgo_xxx",
  "expiresAt": "2026-06-17T11:00:00+08:00"
}
```

注意：

```text
operationKey 明文只返回一次。
```

### 10.2 吊销 AI Operation Key

```http
POST /api/mcp/operation-keys/{keyId}/revoke
```

### 10.3 MCP 调用日志

```http
GET /api/mcp/tool-call-logs
```

## 11. MCP Tool API

MCP Tool API 可以通过 MCP 协议暴露，也可以先通过 HTTP Adapter 实现。

### 11.1 meta.list_object_types

```http
POST /api/mcp/tools/meta.list_object_types
```

请求：

```json
{
  "status": "published"
}
```

响应：

```json
{
  "items": [
    {
      "id": "object.contract",
      "name": "合同",
      "code": "Contract"
    }
  ]
}
```

### 11.2 meta.get_object_type

```http
POST /api/mcp/tools/meta.get_object_type
```

请求：

```json
{
  "objectTypeId": "object.contract",
  "includeFields": true,
  "includeRelations": true,
  "includeActions": true,
  "includeRules": true
}
```

### 11.3 draft.create_fields

```http
POST /api/mcp/tools/draft.create_fields
```

请求：

```json
{
  "objectTypeId": "object.contract",
  "fields": [
    {
      "name": "付款方式",
      "code": "paymentMethod",
      "dataType": "enum",
      "required": false,
      "enumOptions": [
        {
          "label": "银行转账",
          "value": "bank_transfer"
        }
      ]
    }
  ],
  "reason": "用户要求增加付款方式"
}
```

响应：

```json
{
  "draftId": "draft.001",
  "createdFieldIds": ["field.contract.payment_method"],
  "warnings": []
}
```

### 11.4 draft.create_rule_binding

```http
POST /api/mcp/tools/draft.create_rule_binding
```

### 11.5 validate.config_draft

```http
POST /api/mcp/tools/validate.config_draft
```

### 11.6 analyze.change_impact

```http
POST /api/mcp/tools/analyze.change_impact
```

### 11.7 submit.change_proposal

```http
POST /api/mcp/tools/submit.change_proposal
```

请求：

```json
{
  "draftIds": ["draft.001"],
  "title": "新增合同付款方式字段",
  "summary": "Codex 根据用户要求生成字段草稿。",
  "riskLevel": "low"
}
```

响应：

```json
{
  "proposalId": "proposal.001",
  "status": "pending_review",
  "reviewUrl": "/studio/proposals/proposal.001"
}
```

## 12. 草稿与变更建议 API

```http
GET  /api/config-drafts
GET  /api/config-drafts/{draftId}
POST /api/config-drafts/{draftId}/validate
POST /api/config-drafts/{draftId}/discard

GET  /api/change-proposals
GET  /api/change-proposals/{proposalId}
POST /api/change-proposals/{proposalId}/approve
POST /api/change-proposals/{proposalId}/reject
```

## 13. 权限 API

MVP 只做基础权限。

```http
GET  /api/security/roles
POST /api/security/roles
PUT  /api/security/roles/{roleId}
GET  /api/security/permissions/me
```

## 14. 错误码

```text
BAD_REQUEST
UNAUTHORIZED
PERMISSION_DENIED
TENANT_MISMATCH
PROJECT_MISMATCH
ENVIRONMENT_MISMATCH
OBJECT_TYPE_NOT_FOUND
FIELD_NOT_FOUND
ACTION_NOT_FOUND
RULE_NOT_FOUND
VALIDATION_FAILED
RULE_DSL_INVALID
ACTION_BLOCKED
APPROVAL_REQUIRED
IDEMPOTENCY_CONFLICT
MCP_KEY_EXPIRED
MCP_KEY_REVOKED
MCP_SCOPE_DENIED
PUBLISH_VALIDATION_FAILED
```

## 15. MVP 必须实现 API

第一批：

```text
POST /api/projects
GET  /api/projects

POST /api/meta/object-types
GET  /api/meta/object-types
GET  /api/meta/object-types/{id}

POST /api/meta/object-types/{id}/fields
GET  /api/meta/object-types/{id}/fields

POST /api/meta/views
GET  /api/meta/object-types/{id}/views

POST /api/meta/actions
GET  /api/meta/object-types/{id}/actions

POST /api/rules/bindings
POST /api/rules/bindings/{id}/test

POST /api/publish/validate
POST /api/publish

POST /api/runtime/objects/{objectTypeId}
GET  /api/runtime/objects/{objectTypeId}
GET  /api/runtime/objects/{objectTypeId}/{objectId}
POST /api/runtime/actions/{actionId}/request

GET  /api/audit/logs
GET  /api/audit/execution-traces/{executionId}

POST /api/mcp/operation-keys
POST /api/mcp/operation-keys/{keyId}/revoke
POST /api/mcp/tools/meta.get_object_type
POST /api/mcp/tools/draft.create_fields
POST /api/mcp/tools/draft.create_rule_binding
POST /api/mcp/tools/validate.config_draft
POST /api/mcp/tools/analyze.change_impact
POST /api/mcp/tools/submit.change_proposal
```

## 16. 结论

API 第一版必须证明三件事：

```text
配置能定义业务系统。
运行态能基于配置执行。
Codex 能通过 MCP 参与配置，但不能绕过治理。
```

后续后端开发应以本文档作为第一版接口边界。
