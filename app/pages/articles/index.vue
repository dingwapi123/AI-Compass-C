<template>
  <UContainer>
    <UPageHeader
      title="文章列表"
      description="支持分类与标签筛选，点击进入详情阅读"
    >
      <template #headline>
        <div class="flex flex-wrap items-center gap-4">
          <USelect
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="选择分类"
            class="w-48"
          />
          <UInputTags
            v-model="selectedTags"
            placeholder="选择标签"
            :options="tagOptions"
            class="w-full md:w-96"
          />
        </div>
      </template>
    </UPageHeader>

    <UPageSection>
      <div v-if="listStatus === 'pending'">
        <USkeleton class="h-24 mb-4" v-for="i in 3" :key="i" />
      </div>
      <div v-else-if="filtered.length" class="grid gap-6 md:grid-cols-3">
        <UCard v-for="post in filtered" :key="post.path">
          <template #header>
            <NuxtLink :to="post.path" class="font-semibold hover:underline">{{
              post.title
            }}</NuxtLink>
          </template>
          <p class="text-sm text-neutral-600">
            {{ formatDate(post.date) }} · {{ post.author }} ·
            {{ post.category }}
          </p>
          <div class="mt-2 flex flex-wrap gap-2">
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
        <div v-if="listError" class="mt-4 text-sm text-red-600">加载文章列表失败：{{ String(listError) }}</div>
      </div>
    </UPageSection>
    <UPageSection>
      <div class="flex items-center justify-between">
        <div class="text-sm text-neutral-600">合计 {{ total }} 条 · 每页 {{ limit }} 条</div>
        <div class="flex items-center gap-2">
          <UButton :disabled="page <= 1" @click="page = Math.max(1, page - 1)">上一页</UButton>
          <UButton :disabled="page >= Math.ceil(total / limit) || total === 0" @click="page = page + 1">下一页</UButton>
        </div>
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
 * 加载文章列表（从 Supabase 获取，组装分类与标签，并解析总量）
 */
async function fetchArticlesPage(limit = 20, page = 1): Promise<{ items: ArticleCard[]; total: number }> {
  const { get, getRaw } = useSupabaseRest()
  const { from, to } = buildPagination(limit, page)

  const { data: rows, headers } = await getRaw<{
    id: string
    slug: string
    title: string
    author_id?: string | null
    category_id?: string | null
    created_at?: string
  }[]>(
    'articles',
    { status: 'eq.published', select: 'id,slug,title,author_id,category_id,created_at', order: 'created_at.desc' },
    { headers: { Range: `${from}-${to}` } }
  )
  const contentRange = headers.get('content-range') || '0-0/0'
  const total = Number(contentRange.split('/')[1] || 0)

  const articleIds = rows.map(r => r.id)
  const categoryIds = Array.from(new Set(rows.map(r => r.category_id).filter(Boolean))) as string[]
  const authorIds = Array.from(new Set(rows.map(r => r.author_id).filter(Boolean))) as string[]

  const categories = categoryIds.length
    ? await get<{ id: string; name: string; slug: string }[]>(
        'categories',
        { id: `in.(${categoryIds.join(',')})`, select: 'id,name,slug' }
      )
    : []
  const categoryMap = new Map(categories.map(c => [c.id, c]))

  const authors = authorIds.length
    ? await get<{ id: string; name: string }[]>(
        'authors',
        { id: `in.(${authorIds.join(',')})`, select: 'id,name' }
      )
    : []
  const authorMap = new Map(authors.map(a => [a.id, a]))

  const atMap = articleIds.length
    ? await get<{ article_id: string; tag_id: string }[]>(
        'article_tags',
        { article_id: `in.(${articleIds.join(',')})`, select: 'article_id,tag_id' }
      )
    : []
  const tagIds = Array.from(new Set(atMap.map(x => x.tag_id)))
  const tags = tagIds.length
    ? await get<{ id: string; name: string }[]>(
        'tags',
        { id: `in.(${tagIds.join(',')})`, select: 'id,name' }
      )
    : []
  const tagMap = new Map(tags.map(t => [t.id, t.name]))

  const items: ArticleCard[] = rows.map(r => {
    const tagsForArticle = atMap
      .filter(x => x.article_id === r.id)
      .map(x => tagMap.get(x.tag_id))
      .filter(Boolean) as string[]
    const cat = r.category_id ? categoryMap.get(r.category_id) : undefined
    const author = r.author_id ? authorMap.get(r.author_id) : undefined
    return {
      path: `/articles/${r.slug}`,
      title: r.title,
      date: r.created_at,
      author: author?.name,
      category: cat?.name,
      tags: tagsForArticle,
    }
  })

  return { items, total }
}

const limit = ref(20)
const page = ref(1)
const total = ref(0)
const { data: pageData, status: listStatus, error: listError } = await useAsyncData<{ items: ArticleCard[]; total: number}>(
  'articles:list',
  () => fetchArticlesPage(limit.value, page.value),
  { watch: [limit, page] }
)
const articles = computed<ArticleCard[]>(() => pageData.value?.items ?? [])
watch(pageData, (val) => { total.value = val?.total ?? 0 })

/**
 * 分类与标签筛选状态
 */
const selectedCategory = ref<string | undefined>(undefined)
const selectedTags = ref<string[]>([])

/**
 * 选项集合（从 Supabase 读取）
 */
const { get } = useSupabaseRest()
const { data: categoryOptionsRaw } = await useAsyncData<string[]>(
  'articles:categories:options',
  async () => {
    const rows = await get<{ id: string; name: string }[]>('categories', { select: 'id,name', order: 'name.asc' })
    return rows.map(r => r.name)
  }
)
const categoryOptions = computed<string[]>(() => categoryOptionsRaw.value ?? [])

const { data: tagOptionsRaw } = await useAsyncData<string[]>(
  'articles:tags:options',
  async () => {
    const rows = await get<{ id: string; name: string }[]>('tags', { select: 'id,name', order: 'name.asc' })
    return rows.map(r => r.name)
  }
)
const tagOptions = computed<string[]>(() => tagOptionsRaw.value ?? [])

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
