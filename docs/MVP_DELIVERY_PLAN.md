# BizGrow Studio MVP 交付计划 v0.1

## 1. MVP 目标

MVP 不追求完整平台，而是验证 BizGrow Studio 的核心闭环是否成立。

必须跑通：

```text
创建对象
  -> 配置字段
  -> 配置表单
  -> 配置动作
  -> 配置规则
  -> 发布配置
  -> 创建对象实例
  -> 请求动作
  -> 规则命中
  -> 阻断或审批
  -> 审计可查
```

增强目标：

```text
Codex 通过 MCP 读取元模型
  -> 生成配置草稿
  -> 系统校验
  -> 影响分析
  -> 人工审核
  -> 发布配置
```

## 2. MVP 范围

### 2.1 必须包含

配置端：

- 项目管理
- 对象类型管理
- 字段模型
- 表单视图
- 列表视图
- 详情视图
- 对象动作
- 生命周期
- 规则构件
- 业务规则实例
- 发布管理
- MCP 草稿协作

运行端：

- 对象列表
- 对象详情
- 表单录入
- 动作执行
- 规则阻断
- 审批任务
- 审计日志

后端：

- 元模型 API
- 运行态 API
- 动作执行服务
- 规则 DSL 校验和执行
- 审计服务
- MCP Bridge
- Key 授权模型

### 2.2 暂不包含

- 完整 ERP 模板
- 完整 BPMN 引擎
- 完整 OWL / RDF / SPARQL
- 图数据库
- 多 Agent 协同
- 插件市场
- 移动端设计器
- MCP 直接发布配置
- Agent 自动修改运行态业务数据

## 3. 里程碑总览

| 里程碑 | 目标 | 验收结果 |
|---|---|---|
| M0 | 项目重建准备 | 文档、技术栈、代码骨架确定 |
| M1 | 元模型配置闭环 | 能创建对象、字段、视图、动作 |
| M2 | 运行态对象闭环 | 能基于配置创建和查看对象实例 |
| M3 | 规则与动作闭环 | 动作请求能触发规则、阻断或审批 |
| M4 | 发布与审计闭环 | 配置发布、执行审计、版本追踪 |
| M5 | MCP 草稿协作 | Codex 能读取配置并生成草稿 |
| M6 | MVP 验收打磨 | 跑通完整演示场景 |

## 4. M0：项目重建准备

目标：

把旧前端原型冻结，准备按新架构重建。

任务：

- 确认技术栈
- 确认代码目录结构
- 确认后端服务骨架
- 确认数据库选择
- 确认前端重建方式
- 整理旧原型可复用的产品判断
- 决定旧代码删除或归档策略

建议技术栈：

```text
Frontend: React + TypeScript + Vite
Backend: Java 21 + Spring Boot 3
Database: PostgreSQL
Cache: Redis
Search: OpenSearch
Agent / AI Service: Python
MCP: 独立 MCP Bridge 或后端内置 MCP Adapter
```

验收标准：

- 新目录结构确定
- 后端工程能启动
- 前端工程能启动
- 数据库能连接
- 文档索引完整

## 5. M1：元模型配置闭环

目标：

配置端可以定义最小对象系统。

### 5.1 后端任务

- `object_type` 表
- `field_definition` 表
- `view_definition` 表
- `action_definition` 表
- `lifecycle_definition` 表
- 基础 CRUD API
- 配置草稿状态
- 基础校验

### 5.2 前端任务

- 项目首页
- 对象类型列表
- 对象类型详情
- 字段模型页
- 表单视图设计页
- 列表视图设计页
- 详情视图设计页
- 对象动作页
- 生命周期页

### 5.3 验收标准

- 可以创建对象类型
- 可以给对象添加字段
- 可以配置一个表单视图
- 可以配置一个列表视图
- 可以配置一个详情视图
- 可以配置一个对象动作
- 可以配置一个简单生命周期
- 字段删除时能提示引用影响

## 6. M2：运行态对象闭环

目标：

运行端能基于配置生成基础应用。

### 6.1 后端任务

- `object_record` 表
- `relation_record` 表
- 对象实例创建 API
- 对象实例查询 API
- 列表查询
- 详情查询
- 表单提交
- 数据权限预留

### 6.2 前端任务

- 运行端对象列表
- 运行端对象详情
- 运行端表单录入
- 基础搜索和筛选
- 字段权限展示

### 6.3 验收标准

- 发布后能在运行端看到对象入口
- 可以录入对象实例
- 可以查看对象列表
- 可以进入详情页
- 表单字段来自配置，不是硬编码
- 列表字段来自配置，不是硬编码

## 7. M3：规则与动作闭环

目标：

证明系统不是普通表单低代码，所有关键变化通过动作和规则控制。

### 7.1 后端任务

- `rule_block` 表
- `rule_binding` 表
- `action_request` 表
- `rule_evaluation_log` 表
- 规则 DSL 校验器
- 规则 DSL 执行器
- 动作执行服务
- 动作幂等
- 规则阻断
- 规则要求审批

### 7.2 前端任务

- 规则构件库
- 业务规则实例页
- 规则 DSL 可视化审核
- 动作按钮
- 动作执行结果提示
- 规则命中记录展示

### 7.3 第一版规则能力

触发器：

- `action_requested`
- `action_succeeded`
- `state_changed`
- `manual`

条件：

- `all`
- `any`
- `not`
- `compare`
- `block`

动作：

- `block_action`
- `require_approval`
- `create_task`
- `write_audit`

### 7.4 验收标准

- 可以配置一条动作前规则
- 动作执行时规则被检查
- 条件满足时动作被阻断
- 条件满足时可以要求审批
- 规则命中日志可查看
- 同一 executionId 下同一规则不会重复命中

## 8. M4：发布与审计闭环

目标：

配置变更必须经过发布，运行过程必须可追踪。

### 8.1 后端任务

- `publish_version` 表
- `event_record` 表
- `execution_trace` 表
- `audit_log` 表
- 配置发布校验
- 配置版本冻结
- 配置回滚预留
- 审计查询

### 8.2 前端任务

- 发布校验页
- 影响分析页
- 发布记录页
- 对象审计日志
- 动作执行轨迹
- 规则命中详情

### 8.3 验收标准

- 未发布配置不影响运行端
- 发布前能发现引用错误
- 发布后生成版本号
- 动作执行能看到完整审计
- 规则为什么命中或未命中可查看

## 9. M5：MCP 草稿协作

目标：

Codex 可以通过 MCP 参与配置生产，但不能绕过治理。

### 9.1 后端任务

- `mcp_operation_key` 表
- `mcp_tool_call_log` 表
- `config_draft` 表
- `change_proposal` 表
- AI Operation Key 创建和吊销
- MCP Bridge Service
- MCP 工具权限校验
- MCP 工具调用审计

### 9.2 第一版 MCP 工具

必须实现：

```text
meta.list_object_types
meta.get_object_type
meta.list_fields
meta.list_rule_blocks
draft.create_fields
draft.create_form_view
draft.create_rule_binding
validate.config_draft
validate.rule_dsl
analyze.change_impact
submit.change_proposal
```

### 9.3 前端任务

- 项目 MCP Key 管理页
- AI Operation Key 创建弹窗
- MCP 调用日志页
- 草稿列表
- 变更建议审核页

### 9.4 验收标准

- 系统能生成短期 AI Operation Key
- Key 能绑定 projectId、userId、scope、expiresAt
- Codex 能读取对象和字段模型
- Codex 能创建字段或规则草稿
- Codex 不能直接发布配置
- 每次 MCP 调用都能在审计中看到
- 变更建议必须人工审核

## 10. M6：MVP 验收打磨

目标：

跑通一个完整演示。

建议演示对象：

```text
合同
```

原因：

- 不绑定制造业
- 结构简单
- 能覆盖表单、字段、关系、动作、规则、审批、审计

演示流程：

```text
创建合同对象
  -> 添加合同编号、客户、金额、生效日期、状态
  -> 配置表单和列表
  -> 配置提交审核动作
  -> 配置金额超过 50 万需要总经理审批
  -> 发布配置
  -> 运行端创建合同
  -> 提交审核
  -> 规则命中
  -> 生成审批任务
  -> 查看审计日志
```

MCP 增强演示：

```text
用户告诉 Codex：给合同对象加一个付款方式字段，并加一条规则，付款方式为空不能提交。
  -> Codex 读取元模型
  -> Codex 创建字段草稿
  -> Codex 创建规则草稿
  -> 系统校验
  -> 提交变更建议
  -> 人工审核发布
```

验收标准：

- 配置端能完成搭建
- 运行端能完成使用
- 规则能进入执行链路
- 审计能追踪执行过程
- Codex 能通过 MCP 生成草稿
- 人工审核和发布链路成立

## 11. 任务优先级

### 11.1 第一优先级

- 后端工程骨架
- PostgreSQL schema
- ObjectType / FieldDefinition
- ObjectRecord
- ActionDefinition / ActionRequest
- RuleBinding / RuleEvaluationLog
- AuditLog

### 11.2 第二优先级

- 配置端对象设计台
- 运行端列表和详情
- 表单视图
- 发布管理
- 审批任务

### 11.3 第三优先级

- MCP Bridge
- AI Operation Key
- 草稿和变更建议
- Codex 工具调用日志

### 11.4 第四优先级

- 关系图谱
- 知识库
- Agent 辅助配置
- 仪表盘

## 12. 开发顺序建议

推荐顺序：

```text
1. 后端元模型和数据库
2. 配置端对象与字段
3. 运行端对象实例
4. 动作系统
5. 规则 DSL
6. 审计
7. 发布
8. MCP 草稿协作
9. 前端体验打磨
```

不要先做复杂图谱、Agent 聊天和营销页面。

## 13. 验收清单

MVP 完成时必须满足：

- 可以创建对象类型
- 可以配置字段
- 可以生成表单
- 可以生成列表
- 可以生成详情
- 可以创建对象实例
- 可以执行对象动作
- 可以配置规则
- 规则可以阻断动作
- 规则可以要求审批
- 可以发布配置
- 可以查看审计
- Codex 可以通过 MCP 读取元模型
- Codex 可以通过 MCP 创建草稿
- Codex 不能直接发布配置
- MCP 操作有项目、用户、scope 和审计

## 14. 主要风险

### 14.1 过早做大而全

风险：

```text
一开始就做图谱、Agent、知识库、模板市场，导致核心闭环没跑通。
```

防线：

```text
先做对象、字段、动作、规则、审计。
```

### 14.2 退回传统低代码

风险：

```text
为了快，把系统做成表单 + 大宽表。
```

防线：

```text
对象、字段、动作、规则、审计必须是一等模型。
```

### 14.3 MCP 变成后门

风险：

```text
Codex 可以直接改配置或运行数据。
```

防线：

```text
MCP 只能写草稿，发布必须人工审核。
```

### 14.4 规则失控

风险：

```text
规则互相触发，产生死循环。
```

防线：

```text
动作边界、executionId、maxDepth、同规则单次命中。
```

## 15. 当前结论

MVP 的核心不是做出很多页面，而是证明：

```text
BizGrow Studio 可以用对象元模型生成基础低代码应用，
并且比传统低代码更适合长期演进。
```

只要这个闭环成立，再扩展图谱、Agent、知识库和行业模板才有意义。
