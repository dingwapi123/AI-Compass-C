# Repository Guidelines

## 项目结构与模块组织
- 主目录 `app/pages`：页面级路由，使用 `<script setup lang="ts">` 管理逻辑与数据获取。
- `app/layouts` 提供基础布局（如 `default.vue`），共享导航、主题切换与过渡。
- 样式入口 `app/assets/css/main.css` 结合 Tailwind 实用类，局部样式请优先用 Nuxt UI 组件的 props/slots。
- 文章存放于 `content/`（如 `content/articles/*.md`），前言字段需包含 `title/description/author/date/tags/category`，文件名以 kebab-case 生成 slug。
- `public/` 放置公开静态资源；`nuxt.config.ts` 统一配置模块、转场与颜色模式；`content.config.ts` 定义内容集合规则。

## 构建、测试与开发命令
- 安装依赖：`pnpm install`（项目声明 `packageManager` 为 pnpm）。
- 本地开发：`pnpm dev` 启动 http://localhost:3000，支持 HMR。
- 生产构建：`pnpm build`；静态导出：`pnpm generate`；构建后预览：`pnpm preview`。
- 首次安装后会自动执行 `nuxt prepare`（postinstall），确保类型声明与生成文件就绪。

## 编码风格与命名约定
- 统一 TypeScript + Vue 3 组合式 API，2 空格缩进，保持 props/数据在 `<script setup>` 顶部声明。
- SEO/元信息使用 `useSeoMeta` 与 `definePageMeta`；异步数据统一用 `useAsyncData` 并命名缓存键（如 `home:latest`）。
- 组件命名 PascalCase；Pinia store 建议 `useXStore`；组合函数 `useXxx`；路由文件与内容文件使用 kebab-case。
- 布局与排版优先 Tailwind 实用类，必要时再加局部 scoped 样式；复用 Nuxt UI 的 `U*` 组件避免重复样式。

## 测试与质量校验
- 当前未内置自动化测试脚本；新增核心逻辑时请补充 Vitest/组件测试或在 PR 描述中给出验证步骤。
- 提交前至少本地跑通 `pnpm build` 或 `pnpm generate`，确认内容渲染正常与页面转场无异常。
- 文章/内容更新需在本地预览检查 Markdown、MDC 组件（如 `::alert`）及日期格式。

## 提交与 Pull Request 流程
- 遵循约定式提交（示例见历史：`feat: 添加应用基础UI配置`），动词开头、简洁描述，可选 scope。
- PR 需包含变更摘要、影响范围、测试结果；UI/内容改动请附截图或本地预览说明，并关联相关 Issue。
- 避免提交 `.env` 等敏感文件；若引入新依赖，请说明用途并确认不会破坏 SSR/静态导出。

## 安全与配置提示
- 环境变量通过 `.env` 注入，不应写入仓库；仅在需要的运行时读取，避免暴露到客户端。
- 若调整 `colorMode`、页面转场或头部元信息，请同步更新 `nuxt.config.ts` 并在 PR 中注明对 UX/SEO 的影响。
