<template>
  <UContainer>
    <UPageHeader :title="tool?.name || '工具详情'" :description="tool?.description || ''">
      <template #right>
        <UButton v-if="tool?.website_url" :to="tool?.website_url" target="_blank" icon="i-lucide-external-link" color="primary">访问官网</UButton>
      </template>
    </UPageHeader>

    <UPageSection>
      <div class="flex items-start gap-6">
        <UAvatar :src="tool?.logo_url" :alt="tool?.name" size="xl" />
        <div class="flex-1">
          <p class="text-neutral-700">{{ tool?.description }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <UBadge v-for="cat in categories" :key="cat.id" :label="cat.name" variant="soft" />
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection title="相关工具" description="同分类下的其他工具">
      <div class="grid gap-6 md:grid-cols-3">
        <UCard v-for="t in related" :key="t.id">
          <template #header>
            <div class="flex items-center gap-3">
              <UAvatar :src="t.logo_url" :alt="t.name" size="sm" />
              <NuxtLink :to="`/tools/${t.slug}`" class="font-semibold hover:underline">{{ t.name }}</NuxtLink>
            </div>
          </template>
          <p class="text-sm text-neutral-600">{{ t.description }}</p>
          <div class="mt-3">
            <UButton :to="t.website_url" target="_blank" icon="i-lucide-external-link" size="xs" color="primary" variant="ghost">官网</UButton>
          </div>
        </UCard>
      </div>
    </UPageSection>
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
type Category = { id: string, name: string, slug: string }

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const tool = ref<Tool | null>(null)
const categories = ref<Category[]>([])
const related = ref<Tool[]>([])

const { get } = useSupabaseRest()

/**
 * 加载工具详情与分类
 */
async function loadDetail() {
  const items = await get<Tool[]>('tools', { slug: `eq.${slug.value}`, status: 'eq.published', select: '*' })
  tool.value = items?.[0] || null
  if (!tool.value) return

  // 查询该工具所属分类
  const links = await get<{ category_id: string }[]>('tool_categories', { tool_id: `eq.${tool.value.id}`, select: 'category_id' })
  const catIds = links.map(l => l.category_id)
  categories.value = catIds.length ? await get<Category[]>('categories', { id: `in.(${catIds.join(',')})`, select: '*' }) : []
}

/**
 * 加载相关工具（同分类，排除当前，取最新）
 */
async function loadRelated() {
  if (!categories.value.length || !tool.value) { related.value = []; return }
  const links = await get<{ tool_id: string }[]>('tool_categories', { category_id: `in.(${categories.value.map(c => c.id).join(',')})`, select: 'tool_id' })
  const ids = Array.from(new Set(links.map(l => l.tool_id))).filter(id => id !== tool.value!.id)
  related.value = ids.length ? await get<Tool[]>('tools', { id: `in.(${ids.join(',')})`, status: 'eq.published', order: 'created_at.desc', select: '*' }) : []
  related.value = related.value.slice(0, 6)
}

watch(slug, async () => { await loadDetail(); await loadRelated() })
onMounted(async () => { await loadDetail(); await loadRelated() })

useSeoMeta({
  title: () => tool.value?.name || '工具详情',
  description: () => tool.value?.description || '工具详情页',
})
</script>

<style scoped></style>