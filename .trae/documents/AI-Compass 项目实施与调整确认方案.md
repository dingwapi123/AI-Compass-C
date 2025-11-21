## 变更确认
- 取消用户登录与交互：不做评分、点击、评价。
- 不强制每日 20 条：仅保留“当日新增”标记以提升可发现性。
- 部署与运维简化：仅使用 Vercel（前端）+ Supabase（数据），无需自备服务器。
- 排序项调整：保留“最新”，可选“推荐”（人工置顶/featured），移除“评分/最热（基于点击）”。

## 是否适配 Vercel + Supabase
- 适配：Nuxt 4 在 Vercel 原生支持 SSR；Supabase 提供 PostgREST 与存储，无需自管后端。
- 运维简化：仅需环境变量管理与数据库迁移；日志与监控维持最小化即可。

## 数据模型（精简）
- tools
  - id UUID, name varchar(50), slug, description text(200–300), website_url, logo_url
  - status enum['draft','published'], added_date date, featured boolean default false
  - created_at, updated_at；索引：created_at DESC、唯一 slug/name
- categories
  - id UUID, name, slug, parent_id NULLABLE；索引：唯一 slug
- tool_categories
  - tool_id, category_id 复合主键
- daily_updates（可选，用于汇总今日新增）
  - id UUID, date, total_count；唯一索引(date)

说明：不再包含 ratings/click_events/tool_versions 等用户/审计相关表；如后续需要再增量补充。

## API（Supabase REST）
- 列表：`GET /rest/v1/tools?status=eq.published&select=*&order=created_at.desc`
- 推荐：`GET /rest/v1/tools?featured=eq.true&status=eq.published&order=updated_at.desc`
- 分类筛选：通过 `tool_categories` 联表（REST 链式 select）或简单 RPC 后续再加。
- 搜索：`GET /rest/v1/tools?or=(name.ilike.*kw*,description.ilike.*kw*)&status=eq.published`

## 前端页面
- 首页：
  - 推荐轮播（featured=true）+ 最新工具网格
  - 热门分类入口（人工维护）
- 分类页：
  - 多级分类筛选 + 面包屑 + 分页
- 搜索页：
  - 关键词模糊搜索 + 历史（Pinia + localStorage）
- 详情页：
  - 展示完整信息 + 相关工具（同分类/同标签）
- 内容页（Nuxt Content）：
  - 每日资讯/文章（已存在 `articles` 集合，可延展版式）

## Pinia 全局状态（最小集）
- `useToolsStore`：排序（最新/推荐）、筛选、分页、加载状态
- `useSearchStore`：关键词与历史记录（持久化）

## 更新机制（精简）
- 采集：可从少量固定源（RSS/API）人工挑选，脚本批量导入（本地运行）
- 人工审核：在 Supabase 表中设 `status=draft/published`，前端仅展示 published
- 今日标记：根据 `added_date==today()` 在前端显示“今日”徽标，无需强制条数

## 错误处理与日志（最小化）
- 前端：Nuxt 默认错误页 + 简单组件提示
- 后端：依赖 Supabase 标准错误；无额外日志栈
- 安全：只读匿名访问已发布数据；写入通过服务密钥在脚本端进行

## 部署
- Vercel：Nuxt 4 项目一键部署，设置环境变量（Supabase URL/匿名 Key）
- Supabase：数据库迁移（SQL/GUI），PostgREST 默认开放只读端点（RLS 控制）
- 无自管服务器、无复杂监控；备份与可用性由 Supabase/Vercel 负责

## 文档交付（简版）
- ER 图（tools/categories/tool_categories/daily_updates）
- 简化 API 列表（REST 查询）
- 部署说明（Vercel + Supabase 环境变量）
- 维护手册（如何导入数据与发布）

---
如上精简方案符合你的期望，我将基于此输出详细设计与技术规范，并开始实现首页/分类/搜索/详情的最小可用版本（MVP）。