<template>
  <UContainer>
    <UPageHeader :title="item?.title" :description="item?.summary">
      <template #headline>
        <div class="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
          <UBadge v-if="item" :label="item.source" variant="subtle" color="primary" />
          <span v-if="item">{{ formatDate(item.published_at) }}</span>
          <div class="flex flex-wrap gap-2">
            <UBadge v-for="tag in item?.tags || []" :key="tag" :label="tag" variant="soft" color="primary" />
          </div>
          <UButton v-if="item" :to="item.source_url" target="_blank" variant="ghost" size="xs" icon="i-lucide-external-link">源站</UButton>
        </div>
      </template>
    </UPageHeader>

    <UPageSection v-if="item">
      <UCard>
        <p class="text-base leading-7 text-neutral-700 dark:text-neutral-200">
          {{ item.summary }}
        </p>
      </UCard>
    </UPageSection>

    <UPageSection v-if="related.length" title="相关快讯">
      <div class="grid gap-4 md:grid-cols-2">
        <UCard v-for="news in related" :key="news.id">
          <template #header>
            <div class="flex items-start justify-between gap-2">
              <NuxtLink :to="`/daily/${news.slug}`" class="font-semibold hover:underline">
                {{ news.title }}
              </NuxtLink>
              <UBadge :label="news.source" variant="subtle" color="primary" />
            </div>
          </template>
          <p class="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">{{ news.summary }}</p>
          <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span>{{ formatDate(news.published_at) }}</span>
            <UBadge v-for="tag in news.tags || []" :key="tag" :label="tag" variant="soft" color="primary" />
          </div>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection v-else>
      <UEmpty
        title="暂无相关快讯"
        description="返回列表查看更多动态。"
      >
        <template #actions>
          <UButton to="/daily" variant="solid" color="primary">返回快讯列表</UButton>
        </template>
      </UEmpty>
    </UPageSection>
  </UContainer>
</template>

<script setup lang="ts">
import { mockNews, type NewsItem } from '~/utils/mockData'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const item = computed<NewsItem | undefined>(() => mockNews.find((n) => n.slug === slug.value))
const related = computed(() => {
  if (!item.value) return []
  const tags = new Set(item.value.tags || [])
  return mockNews
    .filter((n) => n.slug !== item.value!.slug)
    .map((n) => {
      const overlap = (n.tags || []).some((t) => tags.has(t))
      return { data: n, weight: overlap ? 1 : 0 }
    })
    .filter((x) => x.weight > 0)
    .map((x) => x.data)
    .slice(0, 4)
})

function formatDate(input: string | Date) {
  const d = typeof input === 'string' ? new Date(input) : input
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

useSeoMeta({
  title: () => item.value ? `${item.value.title} - 每日快讯 - AI Compass` : '每日快讯 - AI Compass',
  description: () => item.value?.summary ?? 'AI 领域每日快讯详情',
})

definePageMeta({ pageTransition: { name: 'fade', mode: 'out-in' } })
</script>
