<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
          所有 AI 工具
        </h1>
        <p class="max-w-2xl text-base font-normal text-gray-600 dark:text-gray-400">
          探索我们完整的 AI 工具库，发现能提升您工作效率的最佳解决方案。
        </p>
      </div>
    </div>

    <!-- Toolbar -->
    <div
      class="flex items-center justify-between gap-2 border-b border-gray-200 pb-3 dark:border-gray-800"
    >
      <p class="text-sm text-gray-600 dark:text-gray-400">找到 {{ totalTools }} 个工具</p>
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
    <div class="min-h-[600px]">
      <div
        v-if="loading"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <USkeleton v-for="i in 8" :key="i" class="aspect-square w-full rounded-xl" />
      </div>

      <div
        v-else-if="tools.length > 0"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <ToolMinimalCard v-for="tool in tools" :key="tool.id" :tool="tool" />
      </div>

      <div v-else class="py-20 text-center">
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800"
        >
          <UIcon name="i-heroicons-inbox" class="h-8 w-8" />
        </div>
        <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">暂无工具</h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ selectedPricing ? '没有符合条件的工具。' : '还没有收录任何工具。' }}
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalTools > 0" class="flex justify-center pt-8">
      <UPagination
        v-model:page="page"
        :total="totalTools"
        :items-per-page="pageSize"
        show-edges
        :sibling-count="1"
        active-color="neutral"
        active-variant="solid"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const toolsStore = useToolsStore()
const { tools, totalTools, loading } = storeToRefs(toolsStore)

// State
const page = ref(1)
const pageSize = 12
const pricingOptions = [
  { label: '全部', value: '' },
  { label: '免费', value: 'free' },
  { label: '免费试用', value: 'freemium' },
  { label: '付费', value: 'paid' },
]
const selectedPricing = ref(pricingOptions[0])

// Query Parameters
const queryParams = computed(() => {
  const params: {
    page: number
    pageSize: number
    pricing?: string[]
  } = {
    page: page.value,
    pageSize: pageSize,
  }
  if (selectedPricing.value && selectedPricing.value.value) {
    params.pricing = [selectedPricing.value.value]
  }
  return params
})

// Fetch Data
// 使用 useAsyncData 确保服务端渲染和客户端交互
const { refresh } = await useAsyncData('categories-index', async () => {
  // 强制每次执行
  await toolsStore.searchTools(queryParams.value)
  return true
})

// 监听 queryParams 变化，强制刷新数据
watch(
  queryParams,
  () => {
    refresh()
  },
  { deep: true }
)

// Reset page when filter changes
watch(selectedPricing, () => {
  page.value = 1
})

useHead({
  title: '所有工具 - AI Compass',
  meta: [{ name: 'description', content: '浏览 AI Compass 的所有工具列表。' }],
})
</script>
