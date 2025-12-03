## 目标
- 在你已提供的 Supabase URL/Anon Key 基础上，完善文章模块的体验与健壮性：分页、筛选来源统一、错误与加载态、查询复用、SEO 强化。

## 将要实现的内容与改动文件
- 分页与总量
  - 在列表页添加分页控件，基于 `Range` 头请求与响应 `content-range` 解析总量。
  - 文件：`app/pages/articles/index.vue`
  - 改动：
    1) 为 `fetchArticlesPage(limit,page)` 增加响应头解析，返回 `{ items, total }`；
    2) 新增页码状态与 UI 控件，翻页时复用现有筛选逻辑；
    3) 函数级中文注释。
- 筛选选项来源统一
  - 分类/标签选项改为直接读取 Supabase 的 `categories`、`tags`，避免仅从当页数据推断不完整。
  - 文件：`app/pages/articles/index.vue`
  - 改动：新增请求 `get('categories')/get('tags')`，并以此填充 `categoryOptions/tagOptions`。
- 查询复用抽象
  - 新增 `useRepoArticles` 组合式：统一提供 `list`, `getBySlug`, `relatedByCategory`, `latest`。
  - 文件：`app/composables/useRepoArticles.ts`
  - 改动：封装当前分散的 Supabase 查询；带函数级中文注释，供页面调用。
- 加载与错误态
  - 在列表/详情/首页增加 `loading` 骨架与错误提示；SSR 期间也能优雅降级。
  - 文件：`app/pages/articles/index.vue`、`app/pages/articles/[slug].vue`、`app/pages/index.vue`
  - 改动：`useAsyncData` 的 `status`/`error` 分支渲染；函数级中文注释说明。
- SEO 强化
  - 详情页增加 canonical 与结构化数据（Article schema），读取 Supabase 字段生成。
  - 文件：`app/pages/articles/[slug].vue`
  - 改动：补充 `useHead` 输出 `link rel=canonical` 与 `script type=application/ld+json`。

## 验证方式
- 你设置好环境变量：
  - `NUXT_PUBLIC_SUPABASE_URL=https://arorhmrugzwsdobqsvff.supabase.co`
  - `NUXT_PUBLIC_SUPABASE_ANON_KEY=<你的 anon key>`
- 在 Supabase 插入至少一条 `published` 文章（带 `content_md`），以及至少一个分类/标签。
- 本地运行后验证：
  - `/articles` 可分页、筛选正确；空数据与加载态友好展示；
  - `/articles/[slug]` 显示数据库正文与 SEO 元信息；
  - `/` 首页最新文章正常展示。

## 安全与性能
- 仅使用 `anon` Key 做只读访问；RLS 限制 `articles.status='published'`。
- 分页避免大列表一次性拉取；查询抽象减少重复代码。

确认后我将开始按上述步骤进行具体实现，所有新增/修改函数会附中文函数级注释，并完成本地验证。