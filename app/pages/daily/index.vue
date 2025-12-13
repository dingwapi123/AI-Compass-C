<template>
  <UContainer class="py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">最新AI日报</h1>
    </div>

    <div class="h-[40rem] space-y-4">
      <NuxtLink
        v-for="item in paginatedNews"
        :key="item.id"
        :to="`/daily/${item.id}`"
        class="group flex flex-col gap-4 border-b border-gray-200 pb-3 last:border-0 md:flex-row dark:border-gray-800"
      >
        <!-- Content Section -->
        <div class="min-w-0 flex-1">
          <h2
            class="group-hover:text-primary mb-2 line-clamp-1 cursor-pointer text-lg font-bold text-gray-900 transition-colors dark:text-white"
          >
            {{ item.date }} AI日报
          </h2>
          <p class="mb-2 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {{ item.content ? item.content.slice(0, 100).replace(/[#*`]/g, '') + '...' : '' }}
          </p>

          <div class="flex items-center gap-4 text-xs text-gray-400">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5" />
              <span>{{ item.date }}</span>
            </div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="w-full shrink-0 md:w-[180px]">
          <div class="aspect-[16/9] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            <NuxtImg
              :src="item.image"
              :alt="`${item.date} AI日报`"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center">
      <UPagination
        v-model:page="page"
        active-color="neutral"
        active-variant="solid"
        :total="dailyNews.length"
        :items-per-page="itemsPerPage"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { fetchDailyNews, type DailyNewsItem } from '~/services/daily'

/**
 * Pagination State
 */
const page = ref(1)
const itemsPerPage = ref(5) // Updated to 5 items per page
const dailyNews = ref<DailyNewsItem[]>([])
const loading = ref(false)

/**
 * Data Fetching
 */
const loadNews = async () => {
  loading.value = true
  try {
    const data = await fetchDailyNews()
    dailyNews.value = data
  } catch (e) {
    console.error('Failed to load daily news', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNews()
})

/**
 * Computed property for current page items
 */
const paginatedNews = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return dailyNews.value.slice(start, end)
})

// Scroll to top when page changes
watch(page, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

useHead({
  title: '最新AI日报 - AI Compass',
  meta: [{ name: 'description', content: 'AI领域每日热点，技术趋势与产品应用' }],
})
</script>
