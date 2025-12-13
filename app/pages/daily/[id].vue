<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
    <UContainer>
      <!-- Breadcrumb -->
      <UBreadcrumb :items="breadcrumbItems" class="mb-8" />

      <div v-if="dailyItem" class="mx-auto max-w-4xl">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            {{ dailyItem.date }} AI日报
          </h1>
          <div
            class="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
          >
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="h-4 w-4" />
              <span>{{ dailyItem.date }}</span>
            </div>
          </div>
        </div>

        <!-- Cover Image -->
        <div class="mb-10 aspect-[21/9] overflow-hidden rounded-2xl">
          <NuxtImg
            :src="dailyItem.image"
            :alt="`${dailyItem.date} AI日报`"
            class="h-full w-full object-cover"
          />
        </div>

        <!-- Markdown Content -->
        <div
          class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <ClientOnly>
            <MarkdownRender :content="dailyItem.content" />
          </ClientOnly>
        </div>
      </div>

      <!-- Loading/Error State -->
      <div v-else class="py-20 text-center">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-gray-400" />
        <p class="mt-4 text-gray-500">正在加载日报详情...</p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { fetchDailyNews, type DailyNewsItem } from '~/services/daily'
// MarkdownRender is now registered globally via plugin
// Styles are imported in main.css

const route = useRoute()
const id = route.params.id as string

// Extended interface for detail view
// interface DailyNewsDetail extends DailyNewsItem {
//   content: string
// }

const dailyItem = ref<DailyNewsItem | null>(null)

onMounted(async () => {
  // In a real app, we would fetch the single item by ID from the API
  // For now, we simulate fetching the list and finding the item, then adding mock markdown content
  try {
    const newsList = await fetchDailyNews()
    const item = newsList.find((i) => String(i.id) === id)

    if (item) {
      dailyItem.value = item
    } else {
      // Fallback if not found in recent list (or handle 404)
      dailyItem.value = {
        id: id,
        date: '2025-12-13',
        image:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
        content: '',
      }
    }
  } catch (e) {
    console.error('Failed to load daily news detail', e)
  }
})

const breadcrumbItems = computed(() => [
  { label: '首页', to: '/' },
  { label: 'AI 日报', to: '/daily' },
  { label: dailyItem.value ? `${dailyItem.value.date} AI日报` : '日报详情' },
])

useHead({
  title: computed(() =>
    dailyItem.value ? `${dailyItem.value.date} AI日报 - AI Compass` : '日报详情'
  ),
})
</script>

<style>
/* Optional: Customize Markstream styles if needed */
</style>
