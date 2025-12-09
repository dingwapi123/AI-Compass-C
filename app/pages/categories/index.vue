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
      <p class="text-sm text-gray-600 dark:text-gray-400">找到 {{ tools.length }} 个工具</p>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      <p class="text-gray-500 dark:text-gray-400">还没有收录任何工具。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const toolsStore = useToolsStore()
const { tools, loading } = storeToRefs(toolsStore)

// Ensure data is loaded
await useAsyncData('categories-index', async () => {
  await toolsStore.fetchTools()
  return true
})

useHead({
  title: '所有工具 - AI Compass',
  meta: [{ name: 'description', content: '浏览 AI Compass 的所有工具列表。' }],
})
</script>
