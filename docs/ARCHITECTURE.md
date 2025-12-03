# 技术架构文档

## 技术栈
- **框架**: Nuxt 4 + Vue 3
- **语言**: TypeScript
- **样式**: Tailwind CSS (v4) + Nuxt UI
- **状态管理**: Pinia
- **后端/数据库**: Supabase (PostgreSQL)
- **内容管理**: Nuxt Content (用于静态文档/博客) + Supabase (用于动态数据)

## 目录结构
```
AI-Compass/
├── app/                # Nuxt 应用源码
│   ├── components/     # Vue 组件
│   ├── composables/    # 组合式函数
│   ├── layouts/        # 布局文件
│   ├── pages/          # 页面路由
│   ├── assets/         # 静态资源
│   └── app.vue         # 根组件
├── server/             # 服务端 API
├── content/            # 静态内容 (Markdown)
├── public/             # 公共资源
├── docs/               # 项目文档
└── nuxt.config.ts      # Nuxt 配置
```

## 关键模块设计

### 1. 数据层 (Data Layer)
- **Supabase**: 作为核心数据库，存储用户信息、工具数据、评分和收藏。
- **Nuxt Content**: 用于存储相对静态的博客文章或帮助文档。
- **Composables**: `useSupabase.ts` 封装了与 Supabase 的交互逻辑。

### 2. 状态管理 (State Management)
- 使用 Pinia 管理全局状态，如用户信息 (`userStore`)、搜索条件 (`searchStore`) 等。

### 3. 路由设计 (Routing)
- `/`: 首页，展示热门工具和分类。
- `/tools/[slug]`: 工具详情页。
- `/categories/[...slug]`: 分类列表页。
- `/search`: 搜索结果页。
- `/articles/*`: 博客/文章内容。
- `/admin/*`: 后台管理系统 (需权限验证)。

### 4. 样式系统 (Styling)
- 基于 Tailwind CSS v4 构建原子化样式。
- 使用 Nuxt UI 组件库快速构建界面。
