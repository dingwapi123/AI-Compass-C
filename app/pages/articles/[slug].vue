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
 * 加载当前文章的 Supabase 元数据（标题/描述/作者/分类/时间）
 */
type ArticleRow = {
  id: string
  slug: string
  title: string
  description?: string
  author_id?: string | null
  category_id?: string | null
  created_at?: string
}

async function fetchArticleBySlug(s: string): Promise<ArticleRow | null> {
  const { get } = useSupabaseRest()
  const rows = await get<ArticleRow[]>(
    'articles',
    { slug: `eq.${s}`, status: 'eq.published', select: 'id,slug,title,description,author_id,category_id,created_at', limit: 1 }
  )
  return rows?.[0] ?? null
}

const { data: article } = await useAsyncData<ArticleRow | null>(
  `article:${slug.value}:meta`,
  () => fetchArticleBySlug(slug.value)
)

/**
 * 加载当前文章文档（正文渲染仍使用 Nuxt Content）
 */
const { data: doc } = await useAsyncData<Doc | null>(
  `article:${slug.value}`,
  () => queryCollection('articles').path(`/articles/${slug.value}`).first()
)

/**
 * 加载相关文章（同分类的最多三条）
 */
const categoryId = computed(() => article.value?.category_id)
const articleId = computed(() => article.value?.id)
const { data: relatedRaw } = await useAsyncData<Doc[]>(
  `article:${slug.value}:related`,
  async () => {
    const { get } = useSupabaseRest()
    if (!categoryId.value) return []
    const rows = await get<{
      id: string
      slug: string
      title: string
      created_at?: string
      author_id?: string | null
    }[]>(
      'articles',
      { category_id: `eq.${categoryId.value}`, status: 'eq.published', select: 'id,slug,title,created_at,author_id', order: 'created_at.desc' }
    )
    // 排除当前文章
    const filtered = rows.filter(r => r.id !== articleId.value).slice(0, 3)

    // 批量作者名
    const authorIds = Array.from(new Set(filtered.map(r => r.author_id).filter(Boolean))) as string[]
    const authors = authorIds.length
      ? await get<{ id: string; name: string }[]>(
          'authors',
          { id: `in.(${authorIds.join(',')})`, select: 'id,name' }
        )
      : []
    const authorMap = new Map(authors.map(a => [a.id, a.name]))

    // 返回 PostCard 结构
    return filtered.map(r => ({
      path: `/articles/${r.slug}`,
      title: r.title,
      date: r.created_at,
      author: r.author_id ? authorMap.get(r.author_id) : undefined,
      tags: [],
    }))
  }
)
const related = computed(() => relatedRaw.value ?? [])

/** 设置文章 SEO 元信息 */
useSeoMeta({
  title: () => `${article.value?.title ?? doc.value?.title ?? '文章'} - AI Compass`,
  description: () => article.value?.description ?? doc.value?.description ?? '',
  ogTitle: () => article.value?.title ?? doc.value?.title ?? '文章',
  ogDescription: () => article.value?.description ?? doc.value?.description ?? '',
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