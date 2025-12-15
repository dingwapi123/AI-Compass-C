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
          <ClientOnly>
            <UInput
              v-model="searchQuery"
              placeholder="搜索AI工具..."
              size="xl"
              icon="i-heroicons-magnifying-glass"
              :ui="{ trailing: 'pointer-events-auto' }"
              class="w-full max-w-2xl"
              autocomplete="off"
              @keyup.enter="handleSearch"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-arrow-right"
                  @click="handleSearch"
                />
              </template>
            </UInput>
            <template #fallback>
              <USkeleton class="h-11 w-full max-w-2xl rounded-md" />
            </template>
          </ClientOnly>
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
              <UAvatar :src="tool.icon" :alt="tool.name" size="md" class="rounded-none" />
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
                  @click="handleCategoryChange(category.id)"
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

            <div class="space-y-3">
              <div
                v-for="(news, index) in latestNews"
                :key="index"
                class="hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer rounded-xl border border-gray-300 bg-white p-4 transition-colors dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 class="mb-2 line-clamp-2 font-bold text-gray-900 dark:text-white">
                  {{ news.title }}
                </h3>
                <p class="mb-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {{ news.content }}
                </p>
                <div class="text-xs text-gray-400">
                  {{ news.time }}
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
import { fetchRandomTools, fetchToolsByCategory } from '~/services/tools'
import { fetchNewsByDate } from '~/services/news'
import type { Tool } from '~/types'
import { storeToRefs } from 'pinia'

const toolsStore = useToolsStore()

// 1. Hot Tools: 使用 useAsyncData 在服务端预取数据
const { data: hotTools } = await useAsyncData<Tool[]>('home-hot-tools', () => fetchRandomTools(4), {
  default: () => [],
})

// 2. Categories: 获取所有分类 (通过 Store 获取以利用缓存)
await useAsyncData('home-categories', async () => {
  await toolsStore.fetchCategories()
  return true
})
const { categories: allCategories } = storeToRefs(toolsStore)

// 3. Filtered Tools Logic
// 计算初始分类 ID，避免副作用赋值
const initialCategoryId = computed(() => {
  if (allCategories.value && allCategories.value.length > 0) {
    const first = allCategories.value[0]
    return first ? first.id : ''
  }
  return ''
})

const selectedCategory = ref(initialCategoryId.value)

// 使用 useAsyncData 获取过滤后的工具列表，并监听 selectedCategory 变化
const { data: filteredTools } = await useAsyncData<Tool[]>(
  'home-filtered-tools',
  async () => {
    // 优先使用当前选中的分类，如果为空则尝试使用初始分类
    const categoryId = selectedCategory.value || initialCategoryId.value
    if (!categoryId) return []

    // 如果 selectedCategory 为空但计算出了初始值，同步更新它
    if (!selectedCategory.value && categoryId) {
      selectedCategory.value = categoryId
    }

    return await fetchToolsByCategory(categoryId, 4)
  },
  {
    watch: [selectedCategory], // 当 selectedCategory 变化时自动重新获取
    default: () => [],
  }
)

// 切换分类的处理函数
const handleCategoryChange = (categoryId: string) => {
  selectedCategory.value = categoryId
}

// 4. Search Logic
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo({
      path: '/search',
      query: { q: searchQuery.value.trim() },
    })
  } else {
    navigateTo('/search')
  }
}

// 5. News Logic
const { data: latestNews } = await useAsyncData(
  'home-latest-news',
  async () => {
    // 获取今天的快讯
    const news = await fetchNewsByDate(new Date())
    // 只取前 3 条，保持左右高度平衡
    return news.slice(0, 3)
  },
  {
    default: () => [],
  }
)
</script>
