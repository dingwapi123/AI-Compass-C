# AI Compass 开发文档

AI 领域导航与资讯站，基于 Nuxt 4 + Nuxt UI + Nuxt Content，预留 Supabase 接入（Auth/收藏/搜索/数据写入）。当前已就绪的部分：页面骨架、内容集合与示例文章、主题配置。

## 1. 技术栈与约定
- Nuxt 4.2、Nuxt UI 4.2、Nuxt Content 3.8、Tailwind 4、Pinia（预留）、Nuxt Image。  
- 代码风格遵循 `AGENTS.md`：`<script setup lang="ts">`，2 空格缩进，路由/content 文件 kebab-case；`useAsyncData` 做数据获取并命名缓存键。  
- 配色：primary=sky，secondary=purple，neutral=zinc；颜色模式 system 优先，fallback light，存储键 `ai-compass-color-mode`。  
- 页面过渡：`fade out-in`；全局颜色方案 `light dark` 以避免闪烁。

## 2. 目录结构（关键文件）
- `nuxt.config.ts`：模块/转场/颜色模式。  
- `app/app.config.ts`：Nuxt UI 主题色。  
- `app/layouts/default.vue`：头/尾、导航、暗色切换。  
- `app/pages/index.vue`：首页 Hero + 特色卡片 + 最新 3 篇文章。  
- `app/pages/articles/index.vue`：文章列表，分类/标签筛选。  
- `app/pages/articles/[slug].vue`：文章详情 + 同类推荐。  
- `content.config.ts`：内容集合与 Zod schema。  
- `content/`：示例文档（3 篇文章 + 根页）。  
- `app/assets/css/main.css`：Tailwind/Nuxt UI 引入与颜色方案声明。  
- `public/robots.txt`：当前全开放。

## 3. 内容模型（Nuxt Content）
- 集合 `articles`：来源 `articles/**/*.{md,mdc}`（前缀 `articles`），字段可选：`title` / `description` / `author` / `date`(string|date) / `tags`(string[]) / `category`。  
- 集合 `content`：兜底 `**/*.md`。  
- 示例 frontmatter：见 `content/articles/second-post.md`，支持 MDC（`::alert`）。

## 4. 运行与构建
- 安装：`pnpm install`（postinstall 自动执行 `nuxt prepare`）。  
- 开发：`pnpm dev` → http://localhost:3000。  
- 构建：`pnpm build`；静态导出：`pnpm generate`；预览：`pnpm preview`。

## 5. 每日资讯获取方案（规划）
### 数据源
- 官方博客/新闻 RSS：OpenAI、Anthropic、Meta、Google AI、Mistral、HuggingFace、Cohere 等。  
- 技术媒体 RSS/API：Hacker News（API + 关键词过滤）、Reddit AI 频道（需代理时可用 server 侧 fetch）、Twitter/X 列表（可用第三方 API）。  
- 文献/论文：arXiv AI/ML 子类 RSS（可选）。

### 拉取与存储（建议用 Supabase）
- Edge Function `daily-ingest`：定时（外部 cron 触发）抓取 RSS/API → 去重 → 按 schema 写入 `articles` 表；必要时同步到 Nuxt Content 静态文件前生成 JSON/静态索引。  
- 数据表（建议）：  
  - `articles`: `id serial pk`, `slug unique`, `title`, `summary`, `cover`, `source_type`, `source_url`, `tags text[]`, `published_at timestamptz`, `created_at timestamptz default now()`.  
  - `collections`: 主题合集；`collection_items`: 文章关联与排序。  
  - `user_favorites`: `user_id uuid`, `article_id`, unique 约束。  
  - `profiles`: `id uuid references auth.users`, `username`, `avatar_url`, `role`.  
  - 索引：`articles(published_at desc)`, `articles using gin(tags)`, `articles(slug)`，`user_favorites(user_id, article_id unique)`.
- RLS 方向：`articles` 只读公开；写入仅管理员/机器人服务用户（service role）或特定角色。

### 去重与质量
- 依据 `source_url` 唯一；同源重复时更新摘要/时间即可。  
- 关键词过滤（可选）：title/summary 包含 AI/LLM/gpt/mistral/anthropic 等；黑名单词过滤八卦/非技术。  
- 失败重试：按源级退避；写日志到 Supabase Log 或 Edge Function 响应。

### 前端展示
- 首页「今日/本周推荐」：按 `published_at desc` 取前 N 条。  
- 列表页增加「来源」「时间范围」筛选；可本地筛选或调用 server API。  
- 详情页跳转源站或站内 synopsis：若有全文存储，可分段渲染；否则提供外链。

### 最小可行落地路径
1) 先用纯 Nuxt Content：写一个 `server/api/feeds.get.ts` 从静态 JSON 读取，跑 CRON 生成 JSON。  
2) 再接 Supabase：Edge Function 抓取并写表，前端改为 `useFetch('/api/articles')` 或 Supabase client 查询。

## 6. 前端开发要点
- 列表页筛选：当前前端集合过滤；若数据量大可换成 server 端分页查询（Supabase RPC 或 Nitro API）。  
- SEO：`useSeoMeta` 已加；后续补充 OG image、sitemap、结构化数据。  
- UI：优先使用 Nuxt UI 组件（`UPageHero`/`UPageSection`/`UCard`/`UBadge`/`USelect`/`UInputTags`）。  
- 日期格式：`toLocaleDateString('zh-CN')`；注意 `Date` 对象在 SSR/客户端一致性。  
- 动画与可访问性：保持 color-scheme、防闪烁；`prefers-reduced-motion` 仅做轻量过渡。

## 7. 后端/数据集成（计划）
- Supabase 客户端：前台用 `@supabase/supabase-js@2` 公钥，服务端用 service key（仅 server 读取）。  
- Edge Functions：  
  - `daily-ingest`：抓取 RSS/API，写入 `articles`。  
  - `search`（可选）：使用 `tsvector`/`pg_trgm` 做全文搜索或关键词高亮。  
  - `sync-content`（可选）：将 Supabase 数据导出为静态 JSON/MDC，用于静态生成。  
- 任务触发：外部 cron（如 GitHub Actions / Vercel Cron）调用 Edge Function URL，传递签名 header。

## 8. 部署建议
- 可部署 Vercel/Netlify/自托管；Nuxt 4 默认 SSR，可按需开启 ISR/静态导出。  
- 环境变量（示例）：  
  - `NUXT_PUBLIC_SUPABASE_URL` / `NUXT_PUBLIC_SUPABASE_ANON_KEY`  
  - `SUPABASE_SERVICE_ROLE_KEY`（仅 server）  
  - `INGEST_SIGNING_SECRET`（保护抓取接口）

## 9. 验证与质量
- 本地至少跑 `pnpm build` 或 `pnpm generate` 确认通过。  
- 重要逻辑建议补充 Vitest 或在 PR 描述列明手动验证步骤。  
- 内容更新需本地预览，检查 MDC 渲染与日期格式。

## 10. 下一步行动清单
1) 将资讯抓取方案定稿：确定源清单、字段映射、去重规则、cron 频率。  
2) 接入 Supabase（env + runtimeConfig），创建表与 RLS 策略。  
3) 新增 `/api/articles`（或直接 Supabase 查询）支持分页/筛选，前端列表改为服务端分页。  
4) 增加搜索（简版可前端全文匹配，正式版用 `tsvector/pg_trgm` 或向量检索）。  
5) SEO：sitemap、OG、面包屑/Article JSON-LD，完善 `robots.txt`。  
6) UI：添加来源过滤、时间范围过滤、首页推荐区块。  
7) 监控与日志：Supabase 日志 + 前端埋点（可选 Plausible）。
