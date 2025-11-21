## 现状与目标
- 现有文章数据来自 Nuxt Content 本地内容库，页面通过 `queryCollection('articles')` 获取：
  - 列表页：`app/pages/articles/index.vue:75`
  - 详情页：`app/pages/articles/[slug].vue:51-54` 与推荐：`app/pages/articles/[slug].vue:62-67`
  - 首页“最新文章”：`app/pages/index.vue:72-75`
- 项目已集成 Supabase，并有 REST 封装：`app/composables/useSupabase.ts:8-30` 与分页工具：`app/composables/useSupabase.ts:35-39`
- 目标：在 Supabase 中创建文章相关表，开启 RLS，前端改为从 Supabase 读取，维持现有功能（列表/筛选/详情/相关推荐/首页最新）。

## 数据库表设计（DDL）
- articles（单分类、多标签）：
```sql
create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  content_md text,
  author_id uuid references public.authors(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key(article_id, tag_id)
);

create index if not exists idx_articles_status on public.articles(status);
create index if not exists idx_articles_created_at on public.articles(created_at desc);
```

## 安全与策略（RLS）
- 启用 RLS 并允许匿名只读访问“已发布”文章：
```sql
alter table public.articles enable row level security;
create policy "articles_select_published" on public.articles
  for select using (status = 'published');

alter table public.categories enable row level security;
create policy "categories_select_all" on public.categories for select using (true);

alter table public.tags enable row level security;
create policy "tags_select_all" on public.tags for select using (true);

alter table public.authors enable row level security;
create policy "authors_select_all" on public.authors for select using (true);

alter table public.article_tags enable row level security;
create policy "article_tags_select_all" on public.article_tags for select using (true);
```
- 触发器：
```sql
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_articles_updated_at
before update on public.articles
for each row execute procedure set_updated_at();
```

## 数据初始化与迁移
- 从现有 Content frontmatter 字段映射：`title/description/author/date/tags/category` → 对应 `articles` 及关联表。
- 初始导入方案（一次性）：用 Supabase SQL Editor 先插入 `categories/tags/authors` 基础数据，再插入 `articles`（`status='published'`），最后批量插入 `article_tags` 映射。
- 可选：保留 Content 作为备份；后续新文章直接写入 Supabase。

## 前端改造方案
- 统一用 `useSupabaseRest().get()` 读取 Supabase：`app/composables/useSupabase.ts:16-29`
- 列表页 `app/pages/articles/index.vue:75`：
  - 替换为从 `articles` 读取已发布文章，按 `created_at` 倒序，分页；随后分别查询 `categories` 与 `article_tags/tags` 以组装 `category` 和 `tags` 字段；在客户端维持现有筛选逻辑。
  - 形如：`get('articles', { status: 'eq.published', order: 'created_at.desc', select: 'id,slug,title,created_at,author_id,category_id' }, { headers: { Range: '<from>-<to>' } })`
- 详情页 `app/pages/articles/[slug].vue:51-54`：
  - 以 `slug` 精确查询单篇；再查 `categories`、`authors` 与 `tags` 补齐展示。
  - 替换 `<ContentRenderer>` 渲染正文：新增一个轻量 Markdown 渲染组件（`markdown-it`），将 `content_md` 渲染为 HTML；保持样式容器 `.prose`。
- 推荐区 `app/pages/articles/[slug].vue:62-67`：
  - 依据当前文章 `category_id`，查询同分类最新三条已发布文章。
- 首页最新 `app/pages/index.vue:72-75`：
  - 改为从 `articles` 取最新三条已发布文章。
- 说明：遵循现有 `tools` 页面已采用的查询分步模式（先主表，再关联表），与项目现有风格一致。

## 验证与交付
- 本地验证：
  - 设置 `NUXT_PUBLIC_SUPABASE_URL` 与 `NUXT_PUBLIC_SUPABASE_ANON_KEY`，运行开发服务，逐页检查（首页/文章列表/详情/相关推荐）。
- 性能与稳定：
  - 为 `articles.status/created_at/slug` 建索引；分页使用 `Range` 头避免过量数据。
- 后续拓展：
  - 支持草稿预览（服务端使用 Service Role Key），全文搜索（Postgres `tsvector` 或外部搜索），封面图使用 Supabase Storage。

## 执行顺序
1) 在 Supabase 执行 DDL 与 RLS
2) 初始化基础数据与导入文章
3) 前端页面按上述位置替换为 Supabase 查询
4) 引入 Markdown 渲染组件并替换详情页正文渲染
5) 全站回归验证与性能检查

确认后我将按上述步骤落地，实现代码改造，并在新增/修改函数处添加中文函数级注释。