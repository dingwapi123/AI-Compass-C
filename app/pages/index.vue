<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Hero Section -->
    <section class="bg-white py-20 text-center dark:bg-gray-950">
      <UContainer>
        <h1
          class="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl dark:text-white"
        >
          探索AI的世界
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400">
          您的最佳AI工具导航，为您精心挑选和分类。
        </p>

        <div class="mx-auto mt-8">
          <UInput
            placeholder="搜索AI工具..."
            size="xl"
            icon="i-heroicons-magnifying-glass"
            :ui="{ trailing: 'pointer-events-auto' }"
            class="w-full max-w-2xl"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-arrow-right"
                @click="navigateTo('/search')"
              />
            </template>
          </UInput>
        </div>
      </UContainer>
    </section>

    <!-- Hot Tools Section -->
    <section class="pb-12">
      <UContainer>
        <div class="mb-6 flex items-center gap-2">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">热门AI工具</h2>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="tool in hotTools"
            :key="tool.id"
            :to="`/tools/${tool.slug}`"
            class="group block rounded-md border border-gray-300 bg-white p-4 transition-shadow hover:border-gray-800 dark:border-gray-800 dark:bg-gray-900 hover:dark:border-gray-300"
          >
            <div class="flex items-center gap-4">
              <UAvatar
                :src="
                  (tool.images && tool.images[0]) ||
                  `https://ui-avatars.com/api/?name=${tool.name}&background=random`
                "
                :alt="tool.name"
                size="md"
                class="rounded-lg"
              />
              <div class="min-w-0 flex-1">
                <h3
                  class="group-hover:text-primary-500 truncate font-semibold text-gray-900 transition-colors dark:text-white"
                >
                  {{ tool.name }}
                </h3>
                <p class="truncate text-xs text-gray-500">
                  {{ tool.description }}
                </p>
              </div>
              <UIcon
                name="i-heroicons-arrow-right"
                class="group-hover:text-primary-500 h-5 w-5 text-gray-300 transition-colors"
              />
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- Main Content -->
    <section class="pb-20">
      <UContainer>
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <!-- Left Column: Categories & Tools Grid (8 cols) -->
          <div class="space-y-8 lg:col-span-8">
            <!-- Categories Tabs -->
            <div>
              <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">AI工具分类</h2>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="category in allCategories"
                  :key="category.id"
                  :color="selectedCategory === category.id ? 'neutral' : 'neutral'"
                  :variant="selectedCategory === category.id ? 'solid' : 'soft'"
                  size="sm"
                  class="rounded-full px-4"
                  @click="selectedCategory = category.id"
                >
                  {{ category.name }}
                </UButton>
              </div>
            </div>

            <!-- Tools List -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ToolCard v-for="tool in filteredTools" :key="tool.id" :tool="tool" class="h-full" />
            </div>

            <!-- View All Link -->
            <div class="flex justify-start pt-8">
              <UButton
                to="/categories"
                variant="outline"
                color="neutral"
                size="lg"
                trailing-icon="i-heroicons-arrow-right"
                class="px-8 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                浏览全部工具库
              </UButton>
            </div>
          </div>

          <!-- Right Column: Latest News (4 cols) -->
          <div class="space-y-6 lg:col-span-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">最新资讯</h2>

            <div class="space-y-4">
              <div
                v-for="(news, index) in latestNews"
                :key="index"
                class="hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer rounded-xl border border-gray-300 bg-white p-5 transition-colors dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 class="mb-2 line-clamp-2 font-bold text-gray-900 dark:text-white">
                  {{ news.title }}
                </h3>
                <p class="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {{ news.summary }}
                </p>
                <div class="text-xs text-gray-400">
                  {{ news.date }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const toolsStore = useToolsStore()
const { tools, categories } = storeToRefs(toolsStore)

// Initialize data (使用 useAsyncData 确保服务端/客户端数据同步，避免水合错误)
await useAsyncData('home-data', async () => {
  await Promise.all([toolsStore.fetchCategories(), toolsStore.fetchTools()])
  return true
})

// State
const selectedCategory = ref('all')

// Add 'All' category to the list
const allCategories = computed(() => [
  { id: 'all', name: '全部', slug: 'all' },
  ...categories.value,
])

// Computed
const hotTools = computed(() => {
  // Just taking first 4 tools as hot tools for demo
  return tools.value.slice(0, 4)
})

const filteredTools = computed(() => {
  if (selectedCategory.value === 'all') {
    return tools.value
  }
  return tools.value.filter((t) => t.category_id === selectedCategory.value)
})

// Mock News Data
const latestNews = [
  {
    title: 'OpenAI 发布全新旗舰模型 GPT-4o',
    summary: '速度更快、功能更强，并免费向所有用户开放。',
    date: '2024年5月13日',
  },
  {
    title: 'Google I/O 展示了跨产品的重大AI更新',
    summary: 'Gemini模型已集成到 Workspace、Android 和搜索中。',
    date: '2024年5月14日',
  },
  {
    title: 'Adobe 在 Photoshop 中引入新的生成填充功能',
    summary: '为专业图像编辑扩展了AI功能。',
    date: '2024年5月10日',
  },
]

// Update categories list to include 'All' logic in template
// We'll just use a local computed for the categories display
// Note: In real app, 'allCategories' logic might be better handled here
// But for now I'll just update the v-for to iterate over `allCategories`
// Wait, I can just use the existing `categories` and prepend 'All' manually in template or computed.
// Let's stick to the computed `allCategories` logic above, but I need to rename the v-for source.
</script>
