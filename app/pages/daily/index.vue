<template>
  <div class="space-y-0">
    <div
      class="bg-gradient-to-b from-primary-50/60 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 pb-10"
    >
      <UContainer>
        <div
          class="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between"
        >
          <div class="space-y-3 max-w-2xl">
            <div
              class="inline-flex items-center gap-2 rounded-full bg-primary-100/70 px-4 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-100"
            >
              <UIcon name="i-lucide-rows" /> 每日快讯
            </div>
            <h1 class="text-3xl font-bold tracking-tight">AI 快讯流</h1>
            <p class="text-neutral-600 dark:text-neutral-300">
              汇总过去几日的重要更新，按来源、标签与关键词快速检索。
            </p>
          </div>
          <div class="w-full max-w-lg">
            <div
              class="rounded-2xl border border-neutral-200/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80"
            >
              <div
                class="text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-3"
              >
                筛选
              </div>
              <div class="flex flex-col gap-3">
                <USelect
                  v-model="selectedSource"
                  :options="sourceOptions"
                  placeholder="来源"
                />
                <UInputTags
                  v-model="selectedTags"
                  :options="tagOptions"
                  placeholder="标签"
                />
                <div
                  class="flex items-center gap-2 rounded-xl border border-neutral-200/60 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <UIcon name="i-lucide-search" class="text-neutral-500" />
                  <input
                    v-model="keyword"
                    type="text"
                    placeholder="搜索标题或摘要"
                    class="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer>
      <UPageSection class="pt-8">
        <div v-if="groupedNews.length" class="space-y-8">
          <div v-for="group in groupedNews" :key="group.date" class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="text-lg font-semibold">{{ group.date }}</div>
              <div class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <UCard
                v-for="item in group.items"
                :key="item.id"
                class="hover:-translate-y-1 hover:shadow-lg transition"
              >
                <template #header>
                  <div class="flex items-start justify-between gap-2">
                    <NuxtLink
                      :to="`/daily/${item.slug}`"
                      class="font-semibold hover:underline"
                    >
                      {{ item.title }}
                    </NuxtLink>
                    <UBadge
                      :label="item.source"
                      variant="subtle"
                      color="primary"
                    />
                  </div>
                </template>
                <p
                  class="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3"
                >
                  {{ item.summary }}
                </p>
                <div
                  class="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500"
                >
                  <span>{{ formatDate(item.published_at) }}</span>
                  <UBadge
                    v-for="tag in item.tags || []"
                    :key="tag"
                    :label="tag"
                    variant="soft"
                    color="primary"
                  />
                  <UButton
                    :to="item.source_url"
                    target="_blank"
                    variant="ghost"
                    icon="i-lucide-external-link"
                    >源站</UButton
                  >
                </div>
              </UCard>
            </div>
          </div>
        </div>
        <div v-else>
          <UEmpty title="暂无快讯" description="调整筛选条件或稍后再试。">
            <template #actions>
              <UButton to="/" variant="solid" color="primary">返回首页</UButton>
            </template>
          </UEmpty>
        </div>
      </UPageSection>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { mockNews, type NewsItem } from "~/utils/mockData"

const keyword = ref("")
const selectedSource = ref<string | undefined>(undefined)
const selectedTags = ref<string[]>([])

const sourceOptions = computed(() => {
  const opts = Array.from(new Set(mockNews.map((n) => n.source)))
  return [
    { label: "全部来源", value: undefined },
    ...opts.map((s) => ({ label: s, value: s })),
  ] as const
})

const tagOptions = computed(() => {
  const set = new Set<string>()
  mockNews.forEach((n) => (n.tags || []).forEach((t) => set.add(t)))
  return Array.from(set)
})

const filtered = computed<NewsItem[]>(() => {
  return mockNews.filter((item) => {
    const kw = keyword.value.trim().toLowerCase()
    const kwOk = kw
      ? item.title.toLowerCase().includes(kw) ||
        item.summary.toLowerCase().includes(kw)
      : true
    const sourceOk = selectedSource.value
      ? item.source === selectedSource.value
      : true
    const tagsOk = selectedTags.value.length
      ? selectedTags.value.every((t) => (item.tags || []).includes(t))
      : true
    return kwOk && sourceOk && tagsOk
  })
})

const groupedNews = computed(() => {
  const map = new Map<string, NewsItem[]>()
  for (const n of filtered.value) {
    const key = formatDate(n.published_at)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(n)
  }
  return Array.from(map.entries())
    .map(([date, items]) => ({
      date,
      items: items.sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      ),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function formatDate(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

useSeoMeta({
  title: "每日快讯 - AI Compass",
  description: "AI 领域每日快讯与动态聚合，支持筛选来源与标签",
  ogTitle: "每日快讯 - AI Compass",
  ogDescription: "AI 领域每日快讯与动态聚合，支持筛选来源与标签",
})

definePageMeta({ pageTransition: { name: "fade", mode: "out-in" } })
</script>
