<template>
  <UContainer>
    <UPageHeader title="AI 工具导航" description="根据最新或推荐排序浏览已发布的工具">
      <template #right>
        <USelect v-model="sort" :options="sortOptions" size="sm" />
      </template>
    </UPageHeader>

    <UPageSection>
      <div class="grid gap-6 md:grid-cols-3">
        <UCard v-for="tool in tools" :key="tool.id">
          <template #header>
            <div class="flex items-center gap-3">
              <UAvatar :src="tool.logo_url" :alt="tool.name" size="sm" />
              <NuxtLink :to="`/tools/${tool.slug}`" class="font-semibold hover:underline">{{ tool.name }}</NuxtLink>
              <UBadge v-if="isToday(tool.added_date)" color="primary" variant="soft" label="今日" />
              <UBadge v-if="tool.featured" color="amber" variant="soft" label="推荐" />
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
  added_date?: string | Date
  featured?: boolean
  created_at?: string
}

const sortOptions = [
  { label: '最新', value: 'latest' },
  { label: '推荐', value: 'featured' },
]
const sort = ref<'latest' | 'featured'>('latest')
const limit = ref(21)
const page = ref(1)
const total = ref(0)

const { get } = useSupabaseRest()

/**
 * 加载工具列表（支持排序与分页）
 */
async function loadTools() {
  const { from, to } = buildPagination(limit.value, page.value)
  const params: Record<string, any> = {
    status: 'eq.published',
    select: '*',
    limit: limit.value,
    // PostgREST 通过 Range 头分页；这里使用 $fetch 的 headers 传入（见 options）
  }
  if (sort.value === 'latest') {
    params.order = 'created_at.desc'
  } else if (sort.value === 'featured') {
    params.featured = 'eq.true'
    params.order = 'updated_at.desc'
  }
  const data = await get<Tool[]>(
    'tools',
    params,
    {
      headers: {
        Range: `${from}-${to}`,
      },
    }
  )
  tools.value = data
  // 注：total 需要通过 Content-Range 读取；此处简化为在推荐模式使用列表长度
  total.value = tools.value.length < limit.value ? (page.value - 1) * limit.value + tools.value.length : page.value * limit.value + 1
}

const tools = ref<Tool[]>([])

watch([sort, page], () => {
  loadTools()
})

onMounted(() => {
  loadTools()
})

/**
 * 判断是否为今日新增
 */
function isToday(input?: string | Date) {
  if (!input) return false
  const d = typeof input === 'string' ? new Date(input) : input
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

useSeoMeta({
  title: 'AI 工具导航',
  description: '浏览已发布的 AI 工具，按最新或推荐排序',
})
</script>

<style scoped></style>