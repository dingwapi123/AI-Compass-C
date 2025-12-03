<template>
  <UContainer>
    <UPageHeader :title="category?.name || '分类'" :description="category?.description || '探索相关 AI 工具'">
      <template #left>
        <UBreadcrumb :links="breadcrumbLinks" />
      </template>
    </UPageHeader>

    <UPageSection>
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-gray-400" />
      </div>
      <div v-else-if="tools.length === 0" class="py-12 text-center text-gray-500">
        该分类下暂无工具
      </div>
      <div v-else class="grid gap-6 md:grid-cols-3">
        <UCard v-for="tool in tools" :key="tool.id" class="flex flex-col">
          <template #header>
             <div class="flex items-center justify-between">
               <NuxtLink :to="`/tools/${tool.slug}`" class="font-semibold hover:text-primary-500 hover:underline">
                 {{ tool.name }}
               </NuxtLink>
               <UBadge v-if="tool.pricing_model" :color="tool.pricing_model === 'free' ? 'success' : 'warning'" variant="subtle" size="xs">
                 {{ tool.pricing_model === 'free' ? '免费' : (tool.pricing_model === 'freemium' ? '免费试用' : '付费') }}
               </UBadge>
             </div>
          </template>
          <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {{ tool.description }}
          </p>
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-1 text-yellow-500">
              <UIcon name="i-heroicons-star-solid" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ tool.rating }}</span>
            </div>
          </div>
           <template #footer>
             <UButton :to="`/tools/${tool.slug}`" block variant="ghost" color="neutral">
               查看详情
             </UButton>
           </template>
        </UCard>
      </div>
    </UPageSection>

    <div v-if="total > limit" class="mt-6 flex justify-center">
      <UPagination v-model="page" :page-count="limit" :total="total" />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import type { Tool, Category } from '~/types'
import { useToolsStore } from '~/stores/tools'

const route = useRoute()
const toolsStore = useToolsStore()

const slugParts = computed(() => (route.params.slug as string[] | undefined) ?? [])
const slug = computed(() => slugParts.value[slugParts.value.length - 1])

const breadcrumbLinks = computed(() => {
  const links = [{ label: '首页', to: '/' }, { label: '全部分类', to: '/' }]
  if (category.value) {
    links.push({ label: category.value.name, to: `/categories/${category.value.slug}` })
  }
  return links
})

const limit = ref(12)
const page = ref(1)
const total = ref(0)
const tools = ref<Tool[]>([])
const category = ref<Category | null>(null)
const loading = ref(false)

// Using store's mock data for now as we don't have real DB
// In real app, this would call API
async function loadData() {
  loading.value = true
  try {
    // Ensure categories are loaded
    if (toolsStore.categories.length === 0) {
      await toolsStore.fetchCategories()
    }
    
    category.value = toolsStore.categories.find(c => c.slug === slug.value) || null
    
    if (category.value) {
       // Fetch tools for this category
       // Mocking the filter logic here
       if (toolsStore.tools.length === 0) {
         await toolsStore.fetchTools()
       }
       const allTools = toolsStore.tools.filter(t => t.category_id === category.value?.id)
       total.value = allTools.length
       const start = (page.value - 1) * limit.value
       tools.value = allTools.slice(start, start + limit.value)
    }
  } finally {
    loading.value = false
  }
}

watch([slug, page], loadData, { immediate: true })

useSeoMeta({
  title: () => category.value ? `分类：${category.value.name}` : '分类不存在',
  description: () => category.value?.description || 'AI 工具导航分类',
})
</script>