<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
    <UContainer>
      <!-- Breadcrumb -->
      <UBreadcrumb :items="breadcrumbItems" class="mb-8" />

      <div v-if="dailyItem" class="mx-auto max-w-4xl">
        <!-- Markdown Content -->
        <div
          class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <MDC :value="dailyItem.content" tag="article" />
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
import { fetchDailyNews } from '~/services/daily'
import type { DailyNewsItem } from '~/types/daily'

const route = useRoute()
const id = route.params.id as string

const dailyItem = ref<DailyNewsItem | null>(null)

onMounted(async () => {
  try {
    // 尝试直接通过日期 ID 获取
    const { items } = await fetchDailyNews({ date: id })
    if (items && items.length > 0) {
      dailyItem.value = items[0] || null
    } else {
      // 如果没有找到，可能是旧链接或格式错误，尝试作为普通分页获取（后备方案）
      // 或者直接显示 404
      console.warn('Daily report not found for date:', id)
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
