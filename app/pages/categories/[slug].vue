<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div v-if="category" class="flex flex-col gap-2">
        <h1 class="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
          {{ category.name }}
        </h1>
        <p class="max-w-2xl text-base font-normal text-gray-600 dark:text-gray-400">
          {{ category.description || `探索所有 ${category.name} 相关的 AI 工具。` }}
        </p>
      </div>
      <div v-else-if="!loading" class="flex flex-col gap-2">
        <h1 class="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
          分类不存在
        </h1>
        <UButton to="/categories" variant="ghost" class="w-fit">返回所有工具</UButton>
      </div>
    </div>

    <!-- Toolbar -->
    <div
      v-if="category"
      class="flex items-center justify-between gap-2 border-b border-gray-200 pb-3 dark:border-gray-800"
    >
      <p class="text-sm text-gray-600 dark:text-gray-400">找到 {{ categoryTools.length }} 个工具</p>
      <div class="flex gap-1">
        <USelectMenu
          v-model="selectedPricing"
          :items="pricingOptions"
          :search-input="false"
          color="neutral"
          variant="soft"
          icon="i-heroicons-funnel"
          class="w-32"
        />
      </div>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <USkeleton v-for="i in 8" :key="i" class="aspect-square w-full rounded-xl" />
    </div>

    <div
      v-else-if="filteredTools.length > 0"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ToolMinimalCard v-for="tool in filteredTools" :key="tool.id" :tool="tool" />
    </div>

    <div v-else-if="category" class="py-20 text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800"
      >
        <UIcon name="i-heroicons-inbox" class="h-8 w-8" />
      </div>
      <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">暂无工具</h3>
      <p class="text-gray-500 dark:text-gray-400">
        {{ selectedPricing ? '没有符合条件的工具。' : '该分类下还没有收录任何工具。' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const route = useRoute()
const toolsStore = useToolsStore()
const { categories, tools, loading } = storeToRefs(toolsStore)

// Load data
await toolsStore.fetchCategories()
await toolsStore.fetchTools()

const categorySlug = route.params.slug as string

// Pricing Filter
const pricingOptions = [
  { label: '全部', value: '' },
  { label: '免费', value: 'free' },
  { label: '免费试用', value: 'freemium' },
  { label: '付费', value: 'paid' },
]
const selectedPricing = ref(pricingOptions[0])

const category = computed(() => {
  return categories.value.find((c) => c.slug === categorySlug)
})

const categoryTools = computed(() => {
  if (!category.value) return []
  return tools.value.filter((t) => t.category_id === category.value?.id)
})

const filteredTools = computed(() => {
  let result = categoryTools.value
  if (selectedPricing.value && selectedPricing.value.value) {
    result = result.filter((t) => t.pricing === selectedPricing.value?.value)
  }
  return result
})

useHead({
  title: computed(() =>
    category.value ? `${category.value.name} - AI Compass` : '分类不存在 - AI Compass'
  ),
  meta: [
    {
      name: 'description',
      content: computed(() => category.value?.description || '探索 AI Compass 的工具分类。'),
    },
  ],
})

// Handle 404
if (!category.value && !loading.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Category Not Found',
  })
}
</script>
