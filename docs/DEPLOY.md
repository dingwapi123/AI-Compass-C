# 部署指南

## Vercel 部署 (推荐)

1. **安装 Vercel CLI** (可选) 或直接连接 GitHub 仓库。
2. **环境变量配置**:
   在 Vercel 项目设置中添加以下环境变量：
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```
3. **构建命令**:
   Vercel 会自动识别 Nuxt 项目，默认构建命令为 `nuxt build`，输出目录为 `.output`。
4. **点击 Deploy**。

## Netlify 部署

1. 连接 GitHub 仓库。
2. **Build command**: `npm run build` 或 `pnpm build`
3. **Publish directory**: `dist` (Nuxt Generate) 或 `.output/public`
4. **环境变量**: 同样配置 Supabase 相关变量。

## Docker 部署

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

### 运行容器
```bash
docker build -t ai-compass .
docker run -p 3000:3000 -e SUPABASE_URL=... -e SUPABASE_KEY=... ai-compass
```
