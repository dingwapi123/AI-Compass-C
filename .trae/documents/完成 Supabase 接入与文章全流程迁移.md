## 我将为你做的事
- 使用你提供的 Supabase 项目，改造文章功能为完全读取 Supabase（列表/筛选、详情、相关推荐、首页最新）。
- 保留现有样式与交互；为详情页新增从 Supabase 渲染 Markdown 正文的能力（不再依赖 Nuxt Content）。
- 提供可复制执行的 SQL（建表/RLS/示例数据），以及必要的环境变量配置，确保你本地或部署环境即刻可用。

## 你需要提供/设置
- 在 Supabase 控制台 Settings → API：
  - Project URL（示例：`https://arorhmrugzwsdobqsvff.supabase.co`）
  - anon public Key（匿名只读）
- 在环境中设置：
  - `NUXT_PUBLIC_SUPABASE_URL=<Project URL>`
  - `NUXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>`

## 数据库（已准备好完整 SQL）
- 表：`authors`、`categories`、`tags`、`articles`、`article_tags`
- RLS：匿名只读仅能访问 `articles.status='published'`
- 触发器：更新 `updated_at`
- 示例插入（用于验证）：
```sql
insert into public.authors(name) values ('AI Compass') returning id; -- 记下作者 id
insert into public.categories(name, slug) values ('教程', 'tutorial') returning id; -- 记下分类 id
insert into public.tags(name, slug) values ('Nuxt', 'nuxt') returning id; -- 记下标签 id

insert into public.articles(slug, title, description, content_md, author_id, category_id, status)
values (
  'hello-world',
  'Hello World',
  '第一篇文章用于验证渲染',
  '# 欢迎\n这是 **Markdown** 正文。',
  '<AUTHOR_ID>',
  '<CATEGORY_ID>',
  'published'
) returning id; -- 记下文章 id

insert into public.article_tags(article_id, tag_id) values ('<ARTICLE_ID>', '<TAG_ID>');
```

## 前端改造内容
- 文章列表：已改为 Supabase 查询并自动组装分类/标签（`app/pages/articles/index.vue:72-118`）。
- 文章详情：已用 Supabase 读取元信息与相关推荐，正文暂保持可用（`app/pages/articles/[slug].vue:51-104`）。
- 首页最新：已改为 Supabase 查询（`app/pages/index.vue:69-98`）。
- 下一步（我将实施）：
  1. 新增 `MarkdownView` 组件，使用 markdown 渲染 `articles.content_md` 为 HTML（带函数级中文注释，开启安全清洗防 XSS）。
  2. 更新详情页：优先从 Supabase 加载 `content_md` 并通过 `MarkdownView` 渲染；若为空则回退现有 Content 渲染。
  3. 保持 SEO 元信息从 Supabase 的 `title/description` 读取。

## 验证流程
- 设置好环境变量并在 Supabase 执行 SQL 与示例插入。
- 启动开发服务后访问：
  - `/` 首页“最新文章”显示 Supabase 的发布文章
  - `/articles` 列表可筛选分类/标签
  - `/articles/hello-world` 详情显示标题/描述与 Markdown 正文，相关推荐来自同分类

## 交付标准
- 所有改动含中文函数级注释。
- 不引入不必要依赖；若需要 Markdown 渲染，将引入轻量安全的方案，并说明新增项。
- 完成后进行本地验证与说明，确保你拿到即可运行。

请确认，我将立即开始实现“MarkdownView 组件 + 详情页正文改造 + 验证”。