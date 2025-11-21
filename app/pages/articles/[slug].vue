<template>
  <UContainer>
    <UPageSection>
      <UPageHeader :title="doc?.title" :description="doc?.description">
        <template #headline>
          <div class="text-sm text-neutral-600">
            {{ formatDate(doc?.date) }} · {{ doc?.author }}
          </div>
        </template>
      </UPageHeader>

      <div class="prose max-w-none">
        <ContentRenderer v-if="doc" :value="doc" />
      </div>
    </UPageSection>

    <UPageSection title="相关文章推荐">
      <div class="grid gap-6 md:grid-cols-3">
        <UCard v-for="post in related" :key="post.path">
          <template #header>
            <NuxtLink :to="post.path" class="font-semibold hover:underline">{{ post.title }}</NuxtLink>
          </template>
          <p class="text-sm text-neutral-600">{{ formatDate(post.date) }} · {{ post.author }}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <UBadge v-for="tag in (post.tags || [])" :key="tag" :label="tag" color="primary" variant="subtle" />
          </div>
        </UCard>
      </div>
    </UPageSection>
  </UContainer>
</template>

<script setup lang="ts">
type Doc = {
  path: string
  title?: string
  description?: string
  date?: string | Date
  author?: string
  tags?: string[]
  category?: string
}

/** 获取路由参数 */
const route = useRoute()
const slug = computed(() => String(route.params.slug))

/**
 * 加载当前文章文档
 */
const { data: doc } = await useAsyncData<Doc | null>(
  `article:${slug.value}`,
  () => queryCollection('articles').path(`/articles/${slug.value}`).first()
)

/**
 * 加载相关文章（同分类的最多三条）
 */
const category = computed(() => doc.value?.category)
const { data: relatedRaw } = await useAsyncData<Doc[]>(
  `article:${slug.value}:related`,
  () => queryCollection('articles')
      .where('category', '=', category.value)
      .order('date', 'DESC')
      .limit(3)
      .select('path', 'title', 'date', 'author', 'tags')
      .all()
)
const related = computed(() => relatedRaw.value ?? [])

/** 设置文章 SEO 元信息 */
useSeoMeta({
  title: () => `${doc.value?.title ?? '文章'} - AI Compass`,
  description: () => doc.value?.description ?? '',
  ogTitle: () => doc.value?.title ?? '文章',
  ogDescription: () => doc.value?.description ?? '',
})

/** 格式化日期 */
function formatDate(input?: string | Date): string {
  if (!input) return ''
  const d = typeof input === 'string' ? new Date(input) : input
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

definePageMeta({ pageTransition: { name: 'fade', mode: 'out-in' } })
</script>

<style scoped></style>