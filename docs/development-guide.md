# AI Compass 开发路线图（前后端）

本指南覆盖端到端开发路径：环境、数据模型、Supabase 接入、每日资讯抓取、前端页面与 API、上线与监控。

## 0. 环境与启动
- 依赖：Node 18+/pnpm，已安装依赖。  
- 开发：`pnpm dev`；构建：`pnpm build`；静态导出：`pnpm generate`；预览：`pnpm preview`。
- 代码约定：见 `AGENTS.md`；`<script setup lang="ts">`，2 空格缩进；内容文件 kebab-case。

## 1. 数据与 Supabase 规划
### 表设计（初版）
- `articles`：`id serial pk`, `slug unique`, `title`, `summary`, `cover`, `source_type`, `source_url`, `tags text[]`, `published_at timestamptz`, `created_at timestamptz default now()`.
- `collections`：主题合集；`collection_items`：文章关系（`order int`）。  
- `user_favorites`：`user_id uuid`, `article_id`, unique 约束。  
- `profiles`：`id uuid references auth.users`, `username`, `avatar_url`, `role`.
- 索引：`articles (published_at desc)`, `articles using gin(tags)`, `articles(slug)`, `user_favorites(user_id, article_id unique)`.
- RLS：`articles` select 公开；insert/update 仅 service role 或 admin 角色；`user_favorites` 仅 `auth.uid() = user_id`。

### 环境变量（示例）
- `NUXT_PUBLIC_SUPABASE_URL` / `NUXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`（仅 server 使用）
- `INGEST_SIGNING_SECRET`（保护抓取接口/Edge Function）

## 2. 每日资讯获取方案
### 数据源
- 官方/厂商 RSS：OpenAI、Anthropic、Meta、Google AI、Mistral、HuggingFace、Cohere。  
- 媒体 RSS/API：Hacker News（API + 关键词过滤），可选 Reddit/Twitter（需代理或第三方 API）。  
- 论文：arXiv AI/ML 子类 RSS（可选）。

### 流程（推荐 Supabase Edge Function `daily-ingest`）
1) CRON 触发（GitHub Actions / Vercel Cron）调用 Edge Function。  
2) 拉取各源 RSS/API → 解析→ 依据 `source_url` 去重。  
3) 生成 `slug`（kebab-case 按 title + 日期），写入 `articles` 表。  
4) 可选：同步生成轻量 JSON 索引供 Nuxt 静态预取。  
5) 记录日志：成功/失败计数，退避重试。

### 去重与筛选
- 主键：`source_url` 或 `(source_url, published_at)`；若冲突则更新摘要/时间。  
- 关键词过滤：title/summary 包含 AI/LLM/gpt 等；黑名单过滤非技术/营销。

## 3. 前端开发路径
### 已有
- 首页、文章列表、文章详情、分类/标签筛选，使用 Nuxt Content 数据源。

### 待做
1) 列表页：支持来源、时间范围筛选；分页（前期可前端分页，后期切换 API 分页）。  
2) 首页：新增「今日/本周推荐」区块，按 `published_at desc` 取前 N 条。  
3) 详情页：显示来源/外链按钮；相关文章支持按标签相似度（若有向量/tsvector 可升级）。  
4) 搜索：  
   - 方案 A：前端全文匹配（小数据量）。  
   - 方案 B：后端 API，Postgres `tsvector/pg_trgm`；返回高亮摘要。  
5) 收藏/登录（接 Supabase Auth）：顶部导航加登录入口；文章卡片收藏按钮→ `user_favorites`。

## 4. 服务端 API 设计（Nitro 或直接 Supabase JS）
- `/api/articles`：query 参数 `page/limit/tags/category/source/date_from/date_to/q`；返回分页数据与总数。  
- `/api/articles/[slug]`：详情 + 相关文章（可并行查询）。  
- `/api/search`（可选）：`q` + 过滤；后端走 Supabase RPC/视图。  
- 安全：公共查询用 anon key；写入操作仅服务器端使用 service key；可在 handler 中校验签名。

## 5. 接入步骤（实施顺序）
1) **接 Supabase**：在 `nuxt.config.ts` 添加 runtimeConfig，注入 env；创建表与 RLS。  
2) **Edge Function `daily-ingest`**：实现源抓取、去重、入库；配置外部 cron。  
3) **API 层**：新增 `/api/articles`、`/api/search`，前端列表改为 API 分页。  
4) **UI 增强**：来源/时间筛选、首页推荐、详情外链按钮、收藏。  
5) **搜索升级**：`tsvector/pg_trgm` 或向量检索；前端搜索框联动。  
6) **SEO/运维**：sitemap/OG/JSON-LD，监控日志，前端埋点（可选）。

## 6. 测试与验证
- 构建校验：`pnpm build` 或 `pnpm generate`。  
- 若引入 Supabase API，建议加最小化集成测试（Nitro server handlers）或在 PR 中列出手测步骤。  
- 抓取任务：在 cron 前先本地/预发布跑一轮，检查去重与写入正确性。

## 7. 部署
- 目标平台：Vercel/Netlify/自托管均可（Nuxt 4 SSR/ISR 兼容）。  
- 确认环境变量设置，`robots.txt` 可按需限制测试环境抓取。  
- 定时任务：若平台不支持 cron，可用 GitHub Actions 定时 HTTP 触发。
