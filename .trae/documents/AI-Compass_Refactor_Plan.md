# AI Compass 项目完善与重构计划

根据 Nuxt Content 文档规范及 MCP (模块化组件模式) 要求，制定以下项目完善计划。

## 1. 项目架构完善 (Architecture)

### 1.1 目录结构重构 (MCP 模式)
按照功能模块（Domain-Driven）而非单纯的技术类型重组目录，提升可维护性。

```
app/
├── components/
│   ├── common/         # 通用基础组件 (Button, Card, Input...)
│   ├── layout/         # 布局相关 (Header, Footer, Sidebar...)
│   ├── tools/          # 工具业务组件 (ToolCard, ToolList, ToolDetail...)
│   ├── content/        # 内容展示组件 (MarkdownView, ArticleCard...)
│   └── admin/          # 后台管理组件
├── composables/
│   ├── core/           # 核心逻辑 (useApi, useTheme...)
│   ├── business/       # 业务逻辑 (useTools, useSearch...)
│   └── services/       # 第三方服务 (useSupabase...)
├── pages/              # 路由页面 (保持 Nuxt 约定)
└── types/              # 全局类型定义
```

### 1.2 统一 API 调用层
- 封装 `useApi` Composable，统一处理 Supabase 和 Nuxt Content 的数据请求。
- 规范化错误处理与响应拦截。

## 2. Nuxt.js 集成深化

### 2.1 混合渲染模式 (Hybrid Rendering)
配置 `nuxt.config.ts` 中的 `routeRules`：
- 首页 (`/`)、分类页 (`/categories/**`)：**SWR (Stale-While-Revalidate)**，TTL 1小时。
- 工具详情页 (`/tools/**`)：**ISG (Incremental Static Generation)** 或 SWR。
- 静态文章 (`/articles/**`)：**Prerender (SSG)**。
- 后台管理 (`/admin/**`)：**SPA (Client-side only)**。
- 搜索页 (`/search`)：**SPA**。

### 2.2 路由与中间件
- 完善 `auth` 中间件：保护 `/admin` 路由。
- 添加 `seo` 中间件或全局配置：动态生成 Meta Tags。

## 3. Nuxt UI 组件整合

### 3.1 组件模块化
- 确保所有 UI 组件基于 Nuxt UI 封装，统一风格。
- 实现暗色模式 (Dark Mode) 的完美适配。

### 3.2 响应式适配
- 使用 Tailwind CSS 的响应式前缀 (`md:`, `lg:`) 确保 Mobile First。
- 优化移动端导航栏与交互体验。

## 4. 项目质量保证

### 4.1 文档体系
- **README.md**: 更新项目概览与启动指南。
- **docs/**:
  - `ARCHITECTURE.md`: 更新后的架构说明。
  - `CONTRIBUTING.md`: 开发贡献指南。
  - `DEPLOY.md`: 更新混合渲染部署说明。

### 4.2 代码规范
- 配置 ESLint + Prettier (已完成基础配置，需检查规则)。
- 确保所有新增代码包含 TSDoc 注释。

---

**确认事项：**
请确认以上重构方向是否符合您的预期？确认后我将按顺序执行开发。
