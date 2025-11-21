<template>
  <UContainer>
    <UPageHeader title="搜索 AI 工具" description="支持名称与简介的模糊匹配" />

    <UPageSection>
      <div class="flex gap-3">
        <UInput v-model="keyword" placeholder="输入关键词，如：图像、代码、PPT" class="flex-1" />
        <UButton icon="i-lucide-search" color="primary" @click="doSearch">搜索</UButton>
      </div>
      <div v-if="history.length" class="mt-3 flex flex-wrap gap-2">
        <UBadge v-for="h in history" :key="h" :label="h" variant="soft" @click="apply(h)" />
        <UButton size="xs" variant="ghost" @click="clear">清空历史</UButton>
      </div>
    </UPageSection>

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

const store = useSearchStore()
store.load()
const keyword = ref(store.keyword)
const history = computed(() => store.history)

const limit = ref(21)
const page = ref(1)
const total = ref(0)
const tools = ref<Tool[]>([])

const { get } = useSupabaseRest()

/**
 * 执行搜索（最新排序）
 */
async function doSearch() {
  const kw = keyword.value.trim()
  store.keyword = kw
  if (!kw) { tools.value = []; total.value = 0; return }
  store.addHistory(kw)
  const { from, to } = buildPagination(limit.value, page.value)
  const data = await get<Tool[]>(
    'tools',
    { status: 'eq.published', order: 'created_at.desc', select: '*', or: `(name.ilike.*${kw}*,description.ilike.*${kw}*)` },
    { headers: { Range: `${from}-${to}` } }
  )
  tools.value = data
  total.value = tools.value.length < limit.value ? (page.value - 1) * limit.value + tools.value.length : page.value * limit.value + 1
}

/**
 * 应用历史搜索词
 */
function apply(term: string) {
  keyword.value = term
  page.value = 1
  doSearch()
}

/**
 * 清空历史
 */
function clear() { store.clearHistory() }

watch(page, () => { if (keyword.value) doSearch() })

useSeoMeta({
  title: '搜索 AI 工具',
  description: '按关键词模糊搜索工具名称与简介',
})
</script>

<style scoped></style>