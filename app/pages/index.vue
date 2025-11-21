<template>
  <UContainer>
    <UPageHero
      title="AI Compass"
      description="基于 Nuxt 4 + Nuxt UI 的生产级站点模板，优化 SSR 与 SEO，集成 Nuxt Content 作为内容系统。"
      :links="[
        { label: '开始阅读', to: '/articles', icon: 'i-lucide-book-open' },
        {
          label: '了解更多',
          to: 'https://nuxt.com',
          icon: 'i-lucide-external-link',
        },
      ]"
    />

    <UPageSection title="特色内容" description="为移动端与桌面端提供一致的体验">
      <div class="grid gap-6 md:grid-cols-3">
        <UCard>
          <template #header>响应式布局</template>
          <p>使用 Nuxt UI 组件与 Tailwind 设计系统实现响应式布局。</p>
        </UCard>
        <UCard>
          <template #header>内容管理</template>
          <p>集成 Nuxt Content，支持 Markdown/MDC 渲染与导航。</p>
        </UCard>
        <UCard>
          <template #header>性能优化</template>
          <p>默认 SSR、预加载关键资源与稳定的页面过渡，提升 LCP/FID/CLS。</p>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection title="最新文章" description="来自内容仓库">
      <div class="grid gap-6 md:grid-cols-3">
        <UCard v-for="post in latest" :key="post.path">
          <template #header>
            <NuxtLink :to="post.path" class="font-semibold hover:underline">{{
              post.title
            }}</NuxtLink>
          </template>
          <p class="text-sm text-neutral-600">
            {{ formatDate(post.date) }} · {{ post.author }}
          </p>
          <div class="mt-2 flex flex-wrap gap-2">
            <UBadge
              v-for="tag in (post.tags || [])"
              :key="tag"
              :label="tag"
              color="primary"
              variant="subtle"
            />
          </div>
        </UCard>
      </div>
    </UPageSection>
  </UContainer>
</template>

<script lang="ts" setup>

type PostCard = {
  path: string
  title?: string
  date?: string | Date
  author?: string
  tags?: string[]
}

/**
 * 加载最新文章（前三条）
 */
const { data: latestRaw } = await useAsyncData<PostCard[]>(
  'home:latest',
  () => queryCollection('articles').order('date', 'DESC').limit(3).select('path', 'title', 'date', 'author', 'tags').all()
)
const latest = computed<PostCard[]>(() => latestRaw.value ?? [])

/**
 * 格式化日期
 */
function formatDate(input?: string | Date): string {
  if (!input) return ""
  const d = typeof input === "string" ? new Date(input) : input
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

useSeoMeta({
  title: "AI Compass 首页",
  description:
    "Nuxt 4 + Nuxt UI + Nuxt Content 的生产级模板，支持 SSR 与优秀的性能指标",
  ogTitle: "AI Compass 首页",
  ogDescription: "Nuxt 4 + Nuxt UI + Nuxt Content 的生产级模板",
})
</script>

<style scoped></style>
