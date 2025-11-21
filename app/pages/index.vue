<template>
  <UContainer>
    <UPageHero
      title="AI Compass"
      description="每日 AI 快讯 + 工具导航，基于 Nuxt 4 + Nuxt UI，预留 Supabase 数据源。"
      :links="[
        { label: '查看快讯', to: '/daily', icon: 'i-lucide-newspaper' },
        { label: '工具导航', to: '/tools', icon: 'i-lucide-grid' },
        { label: '文章教程', to: '/articles', icon: 'i-lucide-book-open' },
      ]"
    >
      <template #headline>
        <div class="flex flex-col gap-3 md:flex-row">
          <div class="flex flex-1 items-center gap-3 rounded-xl border border-neutral-200/60 bg-white/60 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
            <UIcon name="i-lucide-search" class="text-neutral-500" />
            <input
              v-model="keyword"
              type="text"
              placeholder="搜索 AI 工具或快讯，例如：Claude、图像生成"
              class="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
            <UButton icon="i-lucide-arrow-right" variant="solid" color="primary" :to="searchLink" :disabled="!keyword.trim()">搜索</UButton>
          </div>
        </div>
      </template>
    </UPageHero>

    <UPageSection title="今日快讯" description="最新 4 条 AI 新闻，深入阅读可前往每日快讯页">
      <div class="grid gap-6 md:grid-cols-2">
        <UCard v-for="item in topNews" :key="item.id">
          <template #header>
            <div class="flex items-start justify-between gap-2">
              <NuxtLink :to="`/daily/${item.slug}`" class="font-semibold hover:underline">
                {{ item.title }}
              </NuxtLink>
              <UBadge :label="item.source" variant="subtle" color="primary" />
            </div>
          </template>
          <p class="text-sm text-neutral-600 dark:text-neutral-300">{{ item.summary }}</p>
          <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span>{{ formatDate(item.published_at) }}</span>
            <UBadge v-for="tag in item.tags || []" :key="tag" :label="tag" color="primary" variant="soft" />
            <UButton to="/daily" variant="ghost" size="2xs" icon="i-lucide-arrow-up-right">更多</UButton>
          </div>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection title="热门工具" description="精选高频使用的 AI 工具">
      <div class="grid gap-6 md:grid-cols-3">
        <UCard v-for="tool in topTools" :key="tool.id">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                {{ tool.name.slice(0, 1) }}
              </div>
              <div class="flex-1">
                <NuxtLink :to="`/tools/${tool.slug}`" class="font-semibold hover:underline">
                  {{ tool.name }}
                </NuxtLink>
                <div class="text-xs text-neutral-500">{{ tool.categories.join(" / ") }}</div>
              </div>
            </div>
          </template>
          <p class="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">{{ tool.description }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <UBadge v-for="tag in tool.tags || []" :key="tag" :label="tag" variant="subtle" color="primary" />
          </div>
          <div class="mt-4 flex items-center justify-between">
            <UBadge :label="pricingText(tool.pricing)" variant="soft" color="primary" />
            <UButton :to="tool.url" target="_blank" variant="ghost" size="xs" icon="i-lucide-external-link">访问</UButton>
          </div>
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
import { mockNews, mockTools, type NewsItem, type ToolItem } from '~/utils/mockData'

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

const keyword = ref('')
const searchLink = computed(() => keyword.value.trim() ? `/tools?q=${encodeURIComponent(keyword.value.trim())}` : '/tools')

const topNews = computed<NewsItem[]>(() => {
  return [...mockNews]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 4)
})

const topTools = computed<ToolItem[]>(() => mockTools.slice(0, 6))


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

function pricingText(p?: ToolItem['pricing']) {
  if (p === 'free') return '免费'
  if (p === 'freemium') return '免费增值'
  if (p === 'paid') return '付费'
  return '未标注'
}

useSeoMeta({
  title: "AI Compass 首页",
  description:
    "每日 AI 快讯与工具导航，基于 Nuxt 4 + Nuxt UI + Nuxt Content，预留 Supabase 数据源",
  ogTitle: "AI Compass 首页",
  ogDescription: "每日 AI 快讯与工具导航，基于 Nuxt 4 + Nuxt UI + Nuxt Content",
})
</script>

<style scoped></style>
