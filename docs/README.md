# BizGrow Studio 文档索引

## 1. 阅读顺序

建议按以下顺序阅读。

### 1.1 项目总说明

[PROJECT_DEVELOPMENT_GUIDE.md](./PROJECT_DEVELOPMENT_GUIDE.md)

先读这份。

它回答：

- BizGrow Studio 到底是什么
- 为什么不是普通低代码
- 为什么不是传统 ERP
- 为什么底层要走对象元模型
- 为什么要支持 MCP / Codex 协作
- 当前阶段应该做什么，不应该做什么

### 1.2 产品需求

[PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md)

第二个读。

它回答：

- 最低产品要求是什么
- 哪些能力必须覆盖简道云
- 哪些能力是我们的差异化
- 配置端和运行端分别服务谁
- P0 / P1 / P2 / P3 怎么拆
- 第一版 MVP 验收场景是什么

### 1.3 元模型 Schema

[META_MODEL_SCHEMA.md](./META_MODEL_SCHEMA.md)

第三个读。

它回答：

- 对象、字段、关系、动作、生命周期、规则、视图怎么建模
- 配置态和运行态怎么分离
- 后端表结构可以如何映射
- 哪些字段和结构必须从第一版保留

### 1.4 规则 DSL

[RULE_DSL_DESIGN.md](./RULE_DSL_DESIGN.md)

第四个读。

它回答：

- 规则为什么不能只是自然语言
- DSL 为什么应该是结构化 JSON AST
- 触发时机、判断条件、执行动作怎么表达
- 如何避免规则死循环
- AI 生成规则草稿后如何审核、测试、发布

### 1.5 MCP 集成

[MCP_INTEGRATION_DESIGN.md](./MCP_INTEGRATION_DESIGN.md)

第五个读。

它回答：

- Codex 怎么通过 MCP 参与配置端工作
- Project Key、User Identity Key、AI Operation Key 怎么设计
- MCP 工具有哪些
- scope 权限怎么切
- 为什么 MCP 只能写草稿，不能直接发布
- MCP 调用怎么审计

### 1.6 后端架构

[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)

第六个读。

它回答：

- Java 后端模块怎么拆
- PostgreSQL / Redis / OpenSearch / pgvector 怎么用
- 配置态表和运行态表怎么设计
- API 边界怎么划分
- 规则引擎、动作系统、审计、MCP Bridge 怎么落地

### 1.7 MVP 交付计划

[MVP_DELIVERY_PLAN.md](./MVP_DELIVERY_PLAN.md)

第七个读。

它回答：

- MVP 要先跑通哪个闭环
- P0 能力如何拆成里程碑
- 前端、后端、规则、MCP 分别要做什么
- 每个里程碑的验收标准是什么
- 哪些事情应该暂缓

### 1.8 安全模型

[SECURITY_MODEL.md](./SECURITY_MODEL.md)

第八个读。

它回答：

- 租户、项目、环境、用户之间的安全边界
- 角色、对象、字段、动作、发布权限怎么设计
- MCP Key 和 AI Operation Key 怎么治理
- Agent 权限边界是什么
- 审计日志应该记录什么

### 1.9 API 规格

[API_SPEC.md](./API_SPEC.md)

最后读。

它回答：

- 配置态 API 怎么设计
- 运行态 API 怎么设计
- 规则、发布、审计 API 怎么设计
- MCP Auth 和 MCP Tool API 怎么设计
- MVP 第一批接口有哪些

## 2. 文档职责

| 文档 | 职责 |
|---|---|
| `PROJECT_DEVELOPMENT_GUIDE.md` | 产品和工程总方向 |
| `PRODUCT_REQUIREMENTS.md` | 产品需求、优先级、验收场景 |
| `META_MODEL_SCHEMA.md` | 元模型数据结构 |
| `RULE_DSL_DESIGN.md` | 规则语言与执行机制 |
| `MCP_INTEGRATION_DESIGN.md` | Codex / MCP 协作协议 |
| `BACKEND_ARCHITECTURE.md` | 后端模块、存储、API、运行链路 |
| `MVP_DELIVERY_PLAN.md` | MVP 里程碑、任务拆分、验收顺序 |
| `SECURITY_MODEL.md` | 权限、Key、Agent、MCP、审计安全边界 |
| `API_SPEC.md` | 配置态、运行态、MCP、安全认证接口契约 |

## 3. 当前核心共识

### 3.1 产品定位

```text
BizGrow Studio 是面向企业业务系统的元建模与运行平台。
```

它不是传统 ERP，也不是普通低代码。

### 3.2 最低要求

```text
简道云能做的基础低代码能力，BizGrow Studio 都应该能做。
但 BizGrow Studio 不能沿用大宽表、弱关联、流程脚本堆叠的底层路线。
```

### 3.3 差异化

```text
传统低代码面向表单交付。
BizGrow Studio 面向业务对象系统演进。
```

### 3.4 核心底座

```text
对象
字段
关系
动作
事件
状态
规则
视图
权限
审计
Agent / MCP 协作边界
```

### 3.5 运行原则

```text
所有核心数据变化必须通过对象动作。
规则只能在受控触发点参与判断。
Agent 和 Codex 只能生成建议、草稿或动作请求。
发布、权限、审计不能被绕过。
```

## 4. 第一版 MVP 闭环

第一版要跑通：

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

增强闭环：

```text
Codex 通过 MCP 读取元模型
  -> 生成配置草稿
  -> 系统校验
  -> 影响分析
  -> 人工审核
  -> 发布配置
```

## 5. 下一批建议文档

后续建议继续补：

### 5.1 DATABASE_SCHEMA.md

定义 PostgreSQL 表结构、索引、JSONB 字段、审计表和 Key 表。

### 5.2 FRONTEND_REBUILD_PLAN.md

定义新前端怎么从旧原型重建，包括页面清单、组件结构、路由、状态管理。

## 6. 当前未完成

目前还没有完成：

- 后端代码骨架
- 数据库迁移脚本
- OpenAPI / API 契约
- MCP Server 实现
- 规则 DSL 执行器
- 前端重建方案
- 新前端代码
- 配置发布流程实现
- 权限和审计实现

## 7. 维护原则

后续修改文档时，优先保持这几个边界不变：

- 不退回大宽表低代码
- 不让规则变成任意脚本
- 不让 Agent 或 MCP 绕过动作系统
- 不让 MCP 绕过项目和用户授权
- 不让配置直接影响运行态，必须经过发布
- 不让运行结果无法审计
