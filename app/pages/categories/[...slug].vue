<template>
  <UContainer>
    <UPageHeader :title="pageTitle" description="分类筛选下的工具列表">
      <template #left>
        <UBreadcrumb :links="breadcrumbLinks" />
      </template>
    </UPageHeader>

    <UPageSection>
      <div class="grid gap-6 md:grid-cols-3">
        <UCard v-for="tool in tools" :key="tool.id">
          <template #header>
            <div class="flex items-center gap-3">
              <UAvatar :src="tool.logo_url" :alt="tool.name" size="sm" />
              <NuxtLink :to="`/tools/${tool.slug}`" class="font-semibold hover:underline">{{ tool.name }}</NuxtLink>
            </div>
          </template>
          <p class="text-sm text-neutral-600">{{ tool.description }}</p>
          <div class="mt-3">
            <UButton :to="tool.website_url" target="_blank" icon="i-lucide-external-link" size="xs" color="primary" variant="ghost">官网</UButton>
          </div>
        </UCard>
      </div>
    </UPageSection>

    <div class="mt-6 flex justify-center">
      <UPagination v-model="page" :page-count="limit" :total="total" />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
type Tool = {
  id: string
  name: string
  slug: string
  description?: string
  website_url?: string
  logo_url?: string
}

type Category = { id: string, name: string, slug: string, parent_id?: string | null }

const route = useRoute()
const slugParts = computed(() => (route.params.slug as string[] | undefined) ?? [])
const slug = computed(() => slugParts.value.join('/'))
const pageTitle = computed(() => slugParts.value[slugParts.value.length - 1] || '分类')

const breadcrumbLinks = computed(() => {
  const links = [{ label: '全部分类', to: '/categories' }]
  let acc = ''
  for (const part of slugParts.value) {
    acc = acc ? `${acc}/${part}` : part
    links.push({ label: part, to: `/categories/${acc}` })
  }
  return links
})

const limit = ref(21)
const page = ref(1)
const total = ref(0)
const tools = ref<Tool[]>([])
const category = ref<Category | null>(null)

const { get } = useSupabaseRest()

/**
 * 按分类加载工具列表
 */
async function loadByCategory() {
  if (!slug.value) return
  const cats = await get<Category[]>('categories', { slug: `eq.${slug.value}` })
  category.value = cats?.[0] || null
  if (!category.value) { tools.value = []; total.value = 0; return }

  // 获取该分类下的工具 ID 列表
  const links = await get<{ tool_id: string }[]>('tool_categories', { category_id: `eq.${category.value.id}`, select: 'tool_id' })
  const ids = links.map(l => l.tool_id)
  if (!ids.length) { tools.value = []; total.value = 0; return }

  const { from, to } = buildPagination(limit.value, page.value)
  const data = await get<Tool[]>(
    'tools',
    { id: `in.(${ids.join(',')})`, status: 'eq.published', order: 'created_at.desc', select: '*' },
    { headers: { Range: `${from}-${to}` } }
  )
  tools.value = data
  total.value = tools.value.length < limit.value ? (page.value - 1) * limit.value + tools.value.length : page.value * limit.value + 1
}

watch([slug, page], () => { loadByCategory() })
onMounted(() => { loadByCategory() })

useSeoMeta({
  title: () => `分类：${pageTitle.value}`,
  description: () => `浏览分类「${pageTitle.value}」下的工具集合`,
})
</script>

<style scoped></style>