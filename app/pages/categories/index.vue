<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-start gap-4">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
          所有 AI 工具
        </h1>
        <p class="text-base font-normal text-gray-600 dark:text-gray-400 max-w-2xl">
          探索我们完整的 AI 工具库，发现能提升您工作效率的最佳解决方案。
        </p>
      </div>
    </div>

    <!-- Toolbar -->
    <div
      class="flex justify-between items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3"
    >
      <p class="text-sm text-gray-600 dark:text-gray-400">找到 {{ tools.length }} 个工具</p>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <USkeleton v-for="i in 8" :key="i" class="aspect-square rounded-xl w-full" />
    </div>

    <div
      v-else-if="tools.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ToolMinimalCard v-for="tool in tools" :key="tool.id" :tool="tool" />
    </div>

    <div v-else class="text-center py-20">
      <div
        class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"
      >
        <UIcon name="i-heroicons-inbox" class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无工具</h3>
      <p class="text-gray-500 dark:text-gray-400">还没有收录任何工具。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const toolsStore = useToolsStore()
const { tools, loading } = storeToRefs(toolsStore)

// Ensure data is loaded
await toolsStore.fetchTools()

useHead({
  title: '所有工具 - AI Compass',
  meta: [{ name: 'description', content: '浏览 AI Compass 的所有工具列表。' }],
})
</script>
