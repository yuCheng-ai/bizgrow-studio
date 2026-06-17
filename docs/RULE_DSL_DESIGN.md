# BizGrow Studio 规则 DSL 设计 v0.1

## 1. 目标

规则 DSL 是 BizGrow Studio 的核心运行机制之一。

它的目标不是让用户写代码，而是把业务规则表达成一种可校验、可视化、可执行、可审计的结构化模型。

规则 DSL 需要同时服务四类角色：

- 业务人员：能看懂规则含义
- 实施人员：能配置和审核规则
- Agent：能生成规则草稿和解释规则
- 后端系统：能确定性执行规则

核心原则：

```text
自然语言负责表达意图
AI 负责生成草稿
DSL 负责结构化承载
规则引擎负责确定性执行
审计系统负责追踪和回放
```

## 2. 不做什么

第一版明确不做：

- 不做通用编程语言
- 不允许任意脚本执行
- 不允许用户直接写 SQL
- 不允许规则任意修改对象数据
- 不允许规则无限级联触发
- 不把 Agent 判断结果当作最终执行结果
- 不依赖自然语言在运行时临场判断

规则 DSL 必须是有限表达能力。

越有限，越容易校验、解释、审计和长期维护。

## 3. 核心结构

一条业务规则由四部分组成：

```text
规则元信息
触发时机
判断条件
执行动作
```

对应结构：

```ts
interface RuleDefinition {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  scope: RuleScope;
  trigger: RuleTrigger;
  condition: RuleExpression;
  actions: RuleAction[];
  priority: number;
  enabled: boolean;
  riskLevel: RiskLevel;
  ownerRoleId?: string;
  version: number;
  status: ConfigStatus;
}
```

示例：

```json
{
  "id": "rule.order.high_amount_approval",
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
  "priority": 100,
  "enabled": true,
  "riskLevel": "high",
  "ownerRoleId": "role.finance",
  "version": 1,
  "status": "published"
}
```

## 4. 触发时机

触发时机说明规则什么时候参与判断。

第一版只允许有限触发器。

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

推荐第一版优先使用：

- action_requested
- action_succeeded
- state_changed
- manual

谨慎使用：

- field_changed
- scheduled

原因是字段变化和定时任务最容易造成触发链路复杂化。

## 5. 判断条件

判断条件使用表达式树。

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
      op: 'exists';
      target: Expression;
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

示例：

```json
{
  "op": "all",
  "items": [
    {
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
    {
      "op": "compare",
      "left": {
        "type": "field",
        "fieldId": "field.order.status"
      },
      "comparator": "eq",
      "right": {
        "type": "literal",
        "value": "待评审"
      }
    }
  ]
}
```

## 6. 表达式

表达式用于读取字段、上下文、常量和白名单函数结果。

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

上下文路径示例：

```text
actor.id
actor.type
action.id
object.id
object.stateId
event.type
event.payload.changedFields
execution.depth
```

第一版函数白名单：

```text
date.now
date.days_from_now
date.diff_days
number.sum
number.multiply
number.round
text.concat
object.exists
relation.count
```

所有函数必须是纯函数，不允许修改系统状态。

## 7. 执行动作

规则动作不是对象动作本身。

规则动作更像规则引擎对本次执行的干预结果。

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
      description?: string;
    }
  | {
      type: 'request_action';
      actionId: string;
      input: Record<string, Expression>;
    }
  | {
      type: 'call_agent';
      agentId: string;
      task: string;
      input?: Record<string, Expression>;
    }
  | {
      type: 'write_audit';
      level: 'info' | 'warning' | 'error';
      message: string;
    };
```

第一版建议默认允许：

- block_action
- require_approval
- create_task
- write_audit

谨慎开放：

- set_field
- request_action
- call_agent

原因是后者会产生级联执行风险。

## 8. 规则构件库

规则构件库是全局、业务无关的 DSL 积木。

它解决的是“规则表达能力标准化”，不是具体业务规则。

```ts
interface RuleBlock {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  kind: 'trigger' | 'condition' | 'logic' | 'action';
  description?: string;
  paramSchema: JsonSchema;
  dslTemplate: Record<string, unknown>;
  examples: string[];
  version: number;
  status: ConfigStatus;
}
```

示例：

```json
{
  "id": "rule_block.number.gt",
  "tenantId": "tenant.demo",
  "name": "数字大于",
  "code": "numberGreaterThan",
  "kind": "condition",
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
    "op": "compare",
    "comparator": "gt"
  },
  "examples": ["金额大于 100000"],
  "version": 1,
  "status": "published"
}
```

业务规则实例引用规则构件，但规则构件本身不绑定订单、客户、BOM 等业务对象。

## 9. 执行流程

规则执行流程：

```text
收到事件或动作请求
  -> 根据触发器筛选候选规则
  -> 根据作用域筛选规则
  -> 按优先级排序
  -> 校验规则版本和启用状态
  -> 构造执行上下文
  -> 计算判断条件
  -> 生成规则命中结果
  -> 合并规则动作
  -> 执行动作或生成阻断/审批/任务
  -> 写入命中日志和审计日志
```

伪代码：

```ts
function evaluateRules(input: RuleEvaluationInput): RuleEvaluationResult {
  const candidates = findRulesByTrigger(input.event);
  const scoped = filterByScope(candidates, input.objectTypeId, input.actionId);
  const ordered = sortByPriority(scoped);

  const matched = [];

  for (const rule of ordered) {
    if (!rule.enabled) continue;
    if (alreadyMatchedInExecution(rule.id, input.executionId)) continue;

    const passed = evaluateExpression(rule.condition, input.context);
    recordRuleCheck(rule, passed, input);

    if (passed) {
      matched.push({
        ruleId: rule.id,
        actions: rule.actions
      });
    }
  }

  return mergeRuleActions(matched);
}
```

## 10. 规则动作合并

多个规则同时命中时，必须有确定性合并策略。

建议优先级：

```text
block_action > require_approval > create_task > set_field > request_action > call_agent > write_audit
```

规则：

- 只要出现 block_action，本次对象动作默认阻断
- 多个 require_approval 可以合并为多级审批
- create_task 可以累积
- set_field 如果同一字段被多个规则设置，必须按 priority 决定，冲突则阻断
- request_action 默认不自动执行，先生成执行计划
- call_agent 默认不自动改数据，只生成建议和审计

## 11. 循环检测

规则引擎必须防止死循环。

每次执行必须携带：

```text
correlationId
executionId
depth
visitedRuleIds
visitedActionIds
visitedObjectRefs
```

硬限制：

```text
maxDepth: 3
maxRuleChecks: 100
maxActionRequests: 20
sameRuleOncePerExecution: true
sameActionSameObjectOncePerExecution: true
```

阻断条件：

- 同一 executionId 中同一规则重复命中
- 同一对象同一动作重复请求
- 执行深度超过 maxDepth
- 规则动作形成环形路径
- set_field 触发的 field_changed 又回到原字段

循环检测日志必须写入审计：

```json
{
  "category": "rule",
  "level": "warning",
  "message": "规则执行被循环检测阻断",
  "correlationId": "corr.001",
  "executionId": "exec.001"
}
```

## 12. 幂等

每个对象动作必须支持幂等键。

建议幂等键：

```text
tenantId + actionId + objectId + correlationId
```

对于生成类动作，必须额外定义业务唯一键。

示例：

```text
同一个订单在同一次执行链路中，只能生成一次采购建议。
```

## 13. 命中日志

每次规则判断都要记录 RuleEvaluationLog。

```ts
interface RuleEvaluationLog {
  id: string;
  tenantId: string;
  ruleId: string;
  ruleVersion: number;
  objectTypeId?: string;
  objectId?: string;
  actionRequestId?: string;
  eventId?: string;
  conditionPassed: boolean;
  evaluatedInputs: Record<string, unknown>;
  generatedActions: RuleAction[];
  skippedReason?: string;
  correlationId: string;
  executionId: string;
  evaluatedAt: string;
}
```

这个日志用于回答：

- 哪条规则被检查了
- 为什么命中或没命中
- 使用了哪些字段值
- 生成了哪些动作
- 是否被循环检测或权限机制阻断

## 14. AI 生成规则的流程

AI 可以生成规则草稿，但不能直接发布。

流程：

```text
业务人员自然语言描述规则
  -> Agent 读取对象元模型和规则构件库
  -> Agent 生成 DSL 草稿
  -> 系统校验字段、动作、类型、权限
  -> 生成中文解释和影响分析
  -> 人工审核
  -> 试运行测试样例
  -> 发布规则版本
```

AI 输出必须包含：

- DSL JSON
- 中文解释
- 依赖字段
- 影响动作
- 可能风险
- 测试样例

示例：

```json
{
  "draftRule": {},
  "explanation": "当订单提交评审且金额超过 100000 时，需要老板审批。",
  "affectedFields": ["field.order.amount"],
  "affectedActions": ["action.order.submit_review"],
  "risks": ["会阻断部分订单提交"],
  "testCases": [
    {
      "name": "金额超过阈值",
      "input": {
        "amount": 120000
      },
      "expected": "require_approval"
    }
  ]
}
```

## 15. 可视化审核

DSL 必须可视化。

建议 UI 分三层：

```text
业务解释层
  用中文展示：什么时候、满足什么条件、执行什么动作

结构编排层
  用卡片展示触发器、条件组、动作组

JSON DSL 层
  给实施人员和开发人员查看精确结构
```

可视化时不要只展示自然语言。

必须展示：

- 引用字段
- 引用动作
- 引用状态
- 引用规则构件
- 风险级别
- 启用状态
- 最近命中次数
- 最近阻断原因

## 16. 测试机制

每条规则发布前必须支持试运行。

测试输入：

```ts
interface RuleTestCase {
  id: string;
  name: string;
  objectTypeId: string;
  objectValues: Record<string, unknown>;
  eventPayload?: Record<string, unknown>;
  actionInput?: Record<string, unknown>;
  expected: {
    matched: boolean;
    actionTypes: string[];
  };
}
```

测试输出：

```ts
interface RuleTestResult {
  testCaseId: string;
  passed: boolean;
  actualMatched: boolean;
  actualActions: RuleAction[];
  evaluationLog: RuleEvaluationLog;
}
```

## 17. 发布机制

规则必须版本化发布。

状态：

```text
draft
testing
published
disabled
archived
```

发布前检查：

- DSL 结构合法
- 字段引用存在
- 字段类型和比较符匹配
- 动作引用存在
- Agent 权限合法
- 没有明显循环依赖
- 至少一个测试用例通过
- 高风险规则必须人工审批

## 18. 第一版实现建议

第一版只实现最小规则能力：

触发器：

- action_requested
- action_succeeded
- state_changed
- manual

条件：

- all
- any
- not
- compare
- block

动作：

- block_action
- require_approval
- create_task
- write_audit

暂缓：

- 自动 set_field
- 自动 request_action
- 自动 call_agent
- 复杂定时规则
- 复杂字段变更级联

这能先保证系统稳定，再逐步打开自动化能力。

## 19. 与元模型的关系

规则 DSL 不独立存在。

它必须依赖元模型：

```text
ObjectType 决定规则作用对象
FieldDefinition 决定可读取字段和字段类型
ActionDefinition 决定规则可拦截或请求的动作
LifecycleDefinition 决定状态流转规则
AgentCapability 决定规则能否调用 Agent
PermissionPolicy 决定规则动作是否允许执行
```

规则发布时必须校验这些引用。

## 20. 核心结论

BizGrow Studio 的规则系统应该是：

```text
结构化规则，不是自然语言规则
受控 DSL，不是脚本语言
确定性执行，不是 Agent 临场判断
可视化审核，不是黑盒配置
审计回放，不是执行完就结束
```

第一版不要追求规则能力强，而要追求规则能力可控。
