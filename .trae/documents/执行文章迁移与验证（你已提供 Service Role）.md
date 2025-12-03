## 我能做且会做的事
- 已实现迁移接口与前端改造；我可以立即触发迁移，把 `content/articles` 批量写入你的 Supabase，并完成页面验证。

## 你需要确保的准备（很快）
- 环境变量已在运行环境中设置并生效：
  - `NUXT_PUBLIC_SUPABASE_URL=https://arorhmrugzwsdobqsvff.supabase.co`
  - `NUXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>`
  - `NUXT_SUPABASE_SERVICE_ROLE_KEY=<service_role key>`
- 如修改了环境变量，请重启开发服务。

## 我将执行的步骤
1) 触发迁移：`POST /api/migrate-articles`，服务端用私钥将作者/分类/标签/文章与关联写入 Supabase（不在日志中输出密钥）。
2) 返回迁移报告（插入/更新/创建统计与错误列表）。
3) 页面验证：
- `/articles` 列表分页与筛选走 Supabase 发布文章。
- `/articles/[slug]` 详情页优先渲染 Supabase 的 `content_md`；相关推荐同分类。
- `/` 首页最新走 Supabase。
4) REST 验证（只读）：提供 curl 示例确认数据可见。

## 变更位置（以供你确认）
- 私钥读取：`nuxt.config.ts:12-15`（新增 `supabaseServiceRoleKey`）
- 迁移接口：`server/api/migrate-articles.post.ts`（批量写入逻辑）
- Supabase REST 扩展：`app/composables/useSupabase.ts:29`（`getRaw` 解析分页总量）

确认后我将立即触发迁移并贴出报告。