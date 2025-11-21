<template>
  <div class="bg-gradient-to-b from-primary-50/60 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 pb-12">
    <UContainer>
      <div class="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div class="space-y-3 max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-primary-100/70 px-4 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-100">
            <UIcon name="i-lucide-book-open" /> 内容导航
          </div>
          <h1 class="text-3xl font-bold tracking-tight">文章列表</h1>
          <p class="text-neutral-600 dark:text-neutral-300">按分类与标签筛选，支持 Markdown / MDC 富内容阅读。</p>
          <div class="flex flex-wrap gap-3">
            <UBadge color="primary" variant="soft" label="教程" />
            <UBadge color="primary" variant="soft" label="案例" />
            <UBadge color="primary" variant="soft" label="最佳实践" />
          </div>
        </div>
        <div class="w-full max-w-md">
          <div class="rounded-2xl border border-neutral-200/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
            <div class="text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-3">快速筛选</div>
            <div class="flex flex-col gap-3">
              <USelect
                v-model="selectedCategory"
                :options="categoryOptions"
                placeholder="选择分类"
              />
              <UInputTags
                v-model="selectedTags"
                placeholder="选择标签"
                :options="tagOptions"
              />
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>

  <UContainer>
    <UPageSection class="pt-8">
      <div v-if="filtered.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UCard v-for="post in filtered" :key="post.path" class="hover:-translate-y-1 hover:shadow-lg transition">
          <template #header>
            <div class="flex flex-col gap-1">
              <NuxtLink :to="post.path" class="font-semibold hover:underline">
                {{ post.title }}
              </NuxtLink>
              <p class="text-xs text-neutral-500">
                {{ formatDate(post.date) }} · {{ post.author }} · {{ post.category || '未分类' }}
              </p>
            </div>
          </template>
          <div class="mt-1 flex flex-wrap gap-2">
            <UBadge
              v-for="tag in post.tags || []"
              :key="tag"
              :label="tag"
              color="primary"
              variant="subtle"
            />
          </div>
        </UCard>
      </div>
      <div v-else>
        <UEmpty
          title="暂无文章"
          description="请在 content/articles 下添加 .md 或 .mdc 文件（含 frontmatter），然后刷新开发服务。"
        >
          <template #actions>
            <UButton to="/" color="primary" variant="solid">返回首页</UButton>
          </template>
        </UEmpty>
      </div>
    </UPageSection>
  </UContainer>
</template>

<script setup lang="ts">
type ArticleCard = {
  path: string
  title?: string
  date?: string | Date
  author?: string
  tags?: string[]
  category?: string
}

/** 加载文章列表（全部） */
const { data: articlesRaw } = await useAsyncData<ArticleCard[]>(
  "articles:list",
  () => queryCollection("articles").all()
)
const articles = computed<ArticleCard[]>(() => articlesRaw.value ?? [])

/**
 * 分类与标签筛选状态
 */
const selectedCategory = ref<string | undefined>(undefined)
const selectedTags = ref<string[]>([])

/**
 * 选项集合（从文章中提取去重）
 */
const categoryOptions = computed<string[]>(() => {
  const set = new Set<string>()
  for (const a of articles.value) {
    if (a.category) set.add(String(a.category))
  }
  return Array.from(set)
})

const tagOptions = computed<string[]>(() => {
  const set = new Set<string>()
  for (const a of articles.value) {
    for (const t of a.tags || []) set.add(t)
  }
  return Array.from(set)
})

/**
 * 过滤后的文章列表
 */
const filtered = computed(() => {
  return articles.value.filter((a: ArticleCard) => {
    const catOk = selectedCategory.value
      ? a.category === selectedCategory.value
      : true
    const tagsOk = selectedTags.value.length
      ? selectedTags.value.every((t) => (a.tags || []).includes(t))
      : true
    return catOk && tagsOk
  })
})

/** 格式化日期 */
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
  title: "文章列表 - AI Compass",
  description: "基于 Nuxt Content 的文章列表，支持分类与标签筛选",
  ogTitle: "文章列表 - AI Compass",
  ogDescription: "基于 Nuxt Content 的文章列表，支持分类与标签筛选",
})

definePageMeta({ pageTransition: { name: "fade", mode: "out-in" } })
</script>

<style scoped></style>
