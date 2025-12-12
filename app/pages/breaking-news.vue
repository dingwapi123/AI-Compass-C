<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
    <UContainer>
      <!-- Header -->
      <div class="mb-10 text-center">
        <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">AI 快讯</h1>
        <p class="text-gray-500 dark:text-gray-400">实时追踪全球人工智能技术进展与行业动态</p>
      </div>

      <!-- Timeline Content -->
      <div class="relative mx-auto max-w-3xl">
        <!-- News Groups by Date -->
        <div v-for="group in groupedNews" :key="group.date" class="relative mb-12">
          <!-- Date Sticky Header -->
          <div class="sticky top-20 z-10 mb-8 flex justify-center">
            <span
              class="bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-900 rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm"
            >
              {{ formatDate(group.date) }}
            </span>
          </div>

          <!-- Nuxt UI Timeline -->
          <UTimeline
            :items="mapToTimelineItems(group.items)"
            size="xl"
            color="neutral"
            :default-value="mapToTimelineItems(group.items).length"
          >
            <template #title="{ item }">
              <div class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <NuxtLink :to="item.originalData.link" target="_blank" rel="noopener noreferrer">
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                    {{ item.title }}
                  </h3>
                </NuxtLink>
              </div>
            </template>

            <template #description="{ item }">
              <div class="mt-1">
                <NuxtLink
                  :to="item.originalData.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block"
                >
                  <div class="mb-2 flex items-center gap-2">
                    <span class="font-mono text-xs text-gray-400 dark:text-gray-500">{{
                      item.originalData.time
                    }}</span>
                    <span class="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span class="text-primary-500 text-xs">{{ item.originalData.source }}</span>
                  </div>
                  <p
                    class="line-clamp-3 text-sm leading-relaxed text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    {{ item.description }}
                  </p>
                </NuxtLink>
                <div class="mt-3 flex items-center gap-2">
                  <UBadge
                    v-for="tag in item.originalData.tags"
                    :key="tag"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
              </div>
            </template>
          </UTimeline>
        </div>

        <!-- Loading State -->
        <div ref="loadTrigger" class="flex items-center justify-center py-8">
          <div v-if="loading" class="flex flex-col items-center gap-2 text-gray-400">
            <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin" />
            <span class="text-sm">正在加载更多快讯...</span>
          </div>
          <div v-else-if="error" class="flex flex-col items-center gap-2">
            <span class="text-sm text-red-500">加载失败</span>
            <UButton color="neutral" variant="solid" size="sm" @click="retryLoad">重试</UButton>
          </div>
          <div v-else-if="!hasMore" class="text-sm text-gray-400">- 已显示全部内容 -</div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import type { NewsItem, NewsGroup } from '~/types/news'
import { fetchNewsByDate } from '~/services/news'

// Types
interface TimelineItem {
  icon?: string
  title?: string
  description?: string
  originalData?: NewsItem
}

// SEO
useSeoMeta({
  title: 'AI 快讯 - 实时追踪全球人工智能动态',
  description: '提供最新的AI行业资讯、技术突破、产品发布和投融资动态。',
})

// State
const newsItems = ref<NewsItem[]>([])
const loading = ref(false)
const error = ref(false)
const hasMore = ref(true)
const loadTrigger = ref<HTMLElement | null>(null)
// 从当前日期开始回溯
const currentFetchDate = ref(new Date())

// Helper to map NewsItem to TimelineItem
const mapToTimelineItems = (items: NewsItem[]): (TimelineItem & { originalData: NewsItem })[] => {
  return items.map((item) => ({
    icon: 'i-heroicons-newspaper',
    title: item.title,
    description: item.summary,
    originalData: item,
  }))
}

// Data Fetching
const fetchNews = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  error.value = false

  try {
    const newItems = await fetchNewsByDate(currentFetchDate.value)

    if (newItems.length > 0) {
      const existingIds = new Set(newsItems.value.map((i) => i.id))
      const uniqueItems = newItems.filter((i) => !existingIds.has(i.id))
      newsItems.value.push(...uniqueItems)
    }

    // 准备下一次加载前一天的数据
    const nextDate = new Date(currentFetchDate.value)
    nextDate.setDate(nextDate.getDate() - 1)
    currentFetchDate.value = nextDate

    // 限制回溯到30天前
    const limitDate = new Date()
    limitDate.setDate(limitDate.getDate() - 30)
    if (currentFetchDate.value < limitDate) {
      hasMore.value = false
    }
  } catch (e) {
    console.error('Failed to fetch news:', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Grouping Logic
const groupedNews = computed<NewsGroup[]>(() => {
  const groups: Record<string, NewsItem[]> = {}

  newsItems.value.forEach((item) => {
    if (!groups[item.date]) {
      groups[item.date] = []
    }
    groups[item.date]!.push(item)
  })

  // Sort dates descending
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => ({
      date,
      items: groups[date]!.sort((a, b) => b.time.localeCompare(a.time)), // Ensure items within group are sorted
    }))
})

// Format Date Helper
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const dateIso = date.toISOString().split('T')[0]
  const todayIso = today.toISOString().split('T')[0]
  const yesterdayIso = yesterday.toISOString().split('T')[0]

  if (dateIso === todayIso) return '今天'
  if (dateIso === yesterdayIso) return '昨天'

  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// Interaction
const retryLoad = () => {
  fetchNews()
}

// Infinite Scroll
useIntersectionObserver(
  loadTrigger,
  (entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting && hasMore.value && !loading.value && !error.value) {
      fetchNews()
    }
  },
  { threshold: 0.1 }
)

// Initial Load
onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
