<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-start gap-4">
      <div v-if="category" class="flex flex-col gap-2">
        <h1 class="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
          {{ category.name }}
        </h1>
        <p class="text-base font-normal text-gray-600 dark:text-gray-400 max-w-2xl">
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
    <div v-if="category" class="flex justify-between items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        找到 {{ categoryTools.length }} 个工具
      </p>
      <div class="flex gap-1">
        <UButton
          icon="i-heroicons-arrows-up-down"
          color="gray"
          variant="ghost"
          size="sm"
          :ui="{ rounded: 'rounded-md' }"
        />
        <UButton
          icon="i-heroicons-funnel"
          color="gray"
          variant="ghost"
          size="sm"
          :ui="{ rounded: 'rounded-md' }"
        />
        <UButton
          icon="i-heroicons-squares-2x2"
          color="gray"
          variant="ghost"
          size="sm"
          :ui="{ rounded: 'rounded-md' }"
        />
      </div>
    </div>

    <!-- Grid -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <USkeleton v-for="i in 8" :key="i" class="aspect-square rounded-xl w-full" />
    </div>

    <div v-else-if="categoryTools.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ToolMinimalCard 
        v-for="tool in categoryTools" 
        :key="tool.id" 
        :tool="tool" 
      />
    </div>

    <div v-else-if="category" class="text-center py-20">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
        <UIcon name="i-heroicons-inbox" class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无工具</h3>
      <p class="text-gray-500 dark:text-gray-400">该分类下还没有收录任何工具。</p>
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

const category = computed(() => {
  return categories.value.find(c => c.slug === categorySlug)
})

const categoryTools = computed(() => {
  if (!category.value) return []
  return tools.value.filter(t => t.category_id === category.value?.id)
})

useHead({
  title: computed(() => category.value ? `${category.value.name} - AI Compass` : '分类不存在 - AI Compass'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => category.value?.description || '探索 AI Compass 的工具分类。') 
    }
  ]
})

// Handle 404
if (!category.value && !loading.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Category Not Found'
  })
}
</script>
