<template>
  <UContainer>
    <UPageHeader title="文章列表" description="支持分类与标签筛选，点击进入详情阅读">
      <template #headline>
        <div class="flex flex-wrap items-center gap-4">
          <USelect v-model="selectedCategory" :options="categoryOptions" placeholder="选择分类" class="w-48" />
          <UInputTags v-model="selectedTags" placeholder="选择标签" :options="tagOptions" class="w-full md:w-96" />
        </div>
      </template>
    </UPageHeader>

    <UPageSection>
      <div class="grid gap-6 md:grid-cols-3">
        <UCard v-for="post in filtered" :key="post.path">
          <template #header>
            <NuxtLink :to="post.path" class="font-semibold hover:underline">{{ post.title }}</NuxtLink>
          </template>
          <p class="text-sm text-neutral-600">{{ formatDate(post.date) }} · {{ post.author }} · {{ post.category }}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <UBadge v-for="tag in (post.tags || [])" :key="tag" :label="tag" color="primary" variant="subtle" />
          </div>
        </UCard>
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

/**
 * 加载文章列表（全部）
 */
const { data: articlesRaw } = await useAsyncData<ArticleCard[]>(
  'articles:list',
  () => queryCollection('articles').order('date', 'DESC').select('path', 'title', 'date', 'author', 'tags', 'category').all()
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
    for (const t of (a.tags || [])) set.add(t)
  }
  return Array.from(set)
})

/**
 * 过滤后的文章列表
 */
const filtered = computed(() => {
  return articles.value.filter((a) => {
    const catOk = selectedCategory.value ? a.category === selectedCategory.value : true
    const tagsOk = selectedTags.value.length
      ? selectedTags.value.every((t) => ((a.tags || [])).includes(t))
      : true
    return catOk && tagsOk
  })
})

/** 格式化日期 */
function formatDate(input?: string | Date): string {
  if (!input) return ''
  const d = typeof input === 'string' ? new Date(input) : input
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

useSeoMeta({
  title: '文章列表 - AI Compass',
  description: '基于 Nuxt Content 的文章列表，支持分类与标签筛选',
  ogTitle: '文章列表 - AI Compass',
  ogDescription: '基于 Nuxt Content 的文章列表，支持分类与标签筛选',
})

definePageMeta({ pageTransition: { name: 'fade', mode: 'out-in' } })
</script>

<style scoped></style>