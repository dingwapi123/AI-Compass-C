# AI Compass - AI 导航站

AI Compass 是一个全面、高质量的 AI 工具导航平台，旨在帮助用户在 AI 技术爆发式增长的浪潮中，快速发现、筛选和使用最适合自己的 AI 工具。本项目采用最新的 Nuxt 4 架构开发，追求高性能与卓越的用户体验。

## 🚀 核心功能

### 1. 🛠️ AI 工具导航

- **分类展示**：支持按文本、图像、音频、视频、编程等维度进行工具分类。
- **详情展示**：提供工具的详细介绍、定价模式（免费/付费/Freemium）、官方链接及预览图。
- **搜索与筛选**：支持关键词搜索及多维度筛选。

### 2. 📰 AI 资讯与日报

- **每日 AI 日报**：自动化获取并展示每日 AI 行业热点，支持 Markdown 渲染。
- **实时快讯**：集成 Coze Workflow，提供实时的 AI 行业动态。
- **历史归档**：支持按日期分页查看历史日报。

### 3. ⚙️ 后台管理

- **工具管理**：管理员可进行工具的增删改查。
- **反馈处理**：处理用户提交的工具收录申请与反馈。

## 🏗️ 技术架构

本项目基于现代化的前端技术栈构建，确保开发效率与运行性能。

### 核心栈

- **框架**: [Nuxt 4](https://nuxt.com/) (Vue 3 + TypeScript)
- **UI 组件库**: [Nuxt UI](https://ui.nuxt.com/) (基于 Tailwind CSS)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **工具库**: [VueUse](https://vueuse.org/)

### 后端与服务

- **数据库/BaaS**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **AI 服务集成**: [Coze API](https://www.coze.cn/) (用于生成 AI 日报与快讯)
- **API 交互**: Nuxt Server Routes (Nitro Engine)

### 工程化与质量

- **包管理**: pnpm
- **代码规范**: ESLint + Prettier
- **测试**: Vitest + Nuxt Test Utils
- **类型系统**: TypeScript (Strict Mode)

## 📂 目录结构

```bash
AI-Compass/
├── app/
│   ├── components/      # Vue 组件
│   ├── composables/     # 组合式函数 (Auto-imported)
│   ├── layouts/         # 页面布局
│   ├── pages/           # 页面路由
│   ├── services/        # 业务逻辑与 API 封装
│   ├── stores/          # Pinia 状态管理
│   └── types/           # TypeScript 类型定义
├── content/             # Nuxt Content 静态内容
├── public/              # 静态资源
├── server/
│   ├── api/             # 后端 API 接口 (Nitro)
│   └── utils/           # 后端工具函数
└── nuxt.config.ts       # Nuxt 配置文件
```

## ⚡️ 快速开始

### 1. 环境准备

- Node.js >= 18.0.0
- pnpm >= 9.0.0

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并填入必要配置：

```bash
# Supabase
NUXT_PUBLIC_SUPABASE_URL=your_supabase_url
NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
NUXT_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Coze API (用于日报生成)
NUXT_COZE_API_TOKEN=your_coze_token
NUXT_COZE_API_BASE_URL=https://api.coze.cn
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 即可预览。

### 5. 生产构建

```bash
pnpm build
node .output/server/index.mjs
```

## 📄 许可证

[MIT](./LICENSE) License © 2025 AI Compass
