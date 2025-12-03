## 目标
- 将 `content/articles` 下的本地 Markdown/MDC 文章批量迁移到你提供的 Supabase（authors/categories/tags/articles/article_tags）。
- 迁移后，页面完全走 Supabase 数据源；保留回退机制以避免中断。

## 需要的配置
- 提供服务端私钥（仅服务端使用，不能暴露到前端）：
  - `NUXT_SUPABASE_SERVICE_ROLE_KEY=<你的 service_role key>`
- 已有的前端只读配置保持不变：
  - `NUXT_PUBLIC_SUPABASE_URL=https://arorhmrugzwsdobqsvff.supabase.co`
  - `NUXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>`

## 实施方案
- 新增服务端迁移 API：`server/api/migrate-articles.post.ts`
  - 用 `queryCollection('articles').all()` 获取所有文档的 frontmatter（title/description/author/date/tags/category）与路径。
  - 从路径提取 `slug`（如 `/articles/hello-world` → `hello-world`）。
  - 读取原文件内容 `content/articles/${slug}.{md,mdc}`，解析 frontmatter，提取 Markdown 正文作为 `content_md`。
  - 以 service_role key 调用 Supabase REST：
    - authors/categories/tags：按 name/slug 查找，不存在则插入；构建映射表。
    - articles：按 slug 查找，不存在则插入，存在则更新（title/description/content_md/author_id/category_id/status/created_at）。
    - article_tags：为每篇文章建立标签关联，去重。
  - 统一返回迁移报告（插入/更新数量、失败项）。

## 接口安全
- 服务端专用 key 只在服务端读取（`runtimeConfig` 私有区）；不会进入浏览器端构建或响应。
- API 仅允许 POST；可选增加简单 token 校验（如 `NUXT_MIGRATE_TOKEN`），避免误触发。

## 使用方式
- 一键执行（本地开发或部署环境）：
  - `curl -X POST http://localhost:3000/api/migrate-articles`（或你的部署域名）
  - 成功后返回 JSON 报告；刷新页面即可看到 Supabase 数据源生效。

## 验证
- 迁移完成后：
  - `/articles` 列表、筛选与分页正常显示 Supabase 的发布文章；
  - `/articles/[slug]` 详情页显示 Supabase 的 Markdown 正文与相关推荐；
  - `/` 首页最新文章来自 Supabase。

## 交付与注释
- 所有新增/修改函数会添加中文函数级注释；不引入多余依赖。

我将据此实现迁移 API 与必要的配置，并在本地验证报告后交付。请确认并提供 `NUXT_SUPABASE_SERVICE_ROLE_KEY`，我即可开始执行。