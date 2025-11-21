<template>
  <div class="space-y-0">
    <div class="bg-gradient-to-b from-primary-50/60 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 pb-10">
      <UContainer>
        <div class="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-2 rounded-full bg-primary-100/70 px-4 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-100">
              <UIcon name="i-lucide-grid" /> 工具导航
            </div>
            <h1 class="text-3xl font-bold tracking-tight">AI 工具导航</h1>
            <p class="text-neutral-600 dark:text-neutral-300">搜索、筛选与发现常用 AI 工具，后续将接入实时数据与收藏。</p>
            <div class="flex flex-wrap gap-3">
              <UBadge color="primary" variant="soft" label="通用助手" />
              <UBadge color="primary" variant="soft" label="开发工具" />
              <UBadge color="primary" variant="soft" label="多模态" />
            </div>
          </div>
          <div class="w-full max-w-xl">
            <div class="rounded-2xl border border-neutral-200/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80 space-y-3">
              <div class="flex items-center gap-2 rounded-xl border border-neutral-200/60 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
                <UIcon name="i-lucide-search" class="text-neutral-500" />
                <input
                  v-model="keyword"
                  type="text"
                  placeholder="搜索工具名称或描述"
                  class="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
                />
              </div>
              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <USelect
                  v-model="selectedCategory"
                  :options="categoryOptions"
                  placeholder="分类"
                />
                <USelect
                  v-model="selectedPricing"
                  :options="pricingOptions"
                  placeholder="定价"
                />
                <USelect
                  v-model="selectedModel"
                  :options="modelOptions"
                  placeholder="模型支持"
                />
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer>
      <UPageSection title="热门分类">
        <div class="flex flex-wrap gap-3">
          <UButton
            v-for="cat in popularCategories"
            :key="cat"
            variant="ghost"
            size="sm"
            :color="selectedCategory === cat ? 'primary' : 'neutral'"
            @click="selectedCategory = selectedCategory === cat ? undefined : cat"
          >
            {{ cat }}
          </UButton>
        </div>
      </UPageSection>

      <UPageSection>
        <div v-if="filtered.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UCard v-for="tool in filtered" :key="tool.id" class="hover:-translate-y-1 hover:shadow-lg transition">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                  {{ tool.name.slice(0, 1) }}
                </div>
                <div class="flex-1">
                  <NuxtLink :to="`/tools/${tool.slug}`" class="font-semibold hover:underline">
                    {{ tool.name }}
                  </NuxtLink>
                  <div class="text-xs text-neutral-500">{{ tool.categories.join(' / ') }}</div>
                </div>
                <UBadge :label="pricingText(tool.pricing)" variant="soft" color="primary" />
              </div>
            </template>
            <p class="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
              {{ tool.description }}
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
              <UBadge v-for="tag in tool.tags || []" :key="tag" :label="tag" variant="subtle" color="primary" />
              <UBadge v-for="model in tool.models || []" :key="model" :label="model" variant="soft" color="primary" />
            </div>
            <div class="mt-4 flex items-center justify-between">
              <UButton :to="tool.url" target="_blank" size="xs" variant="ghost" icon="i-lucide-external-link">访问</UButton>
              <UButton :to="`/tools/${tool.slug}`" size="xs" variant="solid" color="primary" icon="i-lucide-arrow-right">详情</UButton>
            </div>
          </UCard>
        </div>
        <div v-else>
          <UEmpty
            title="暂无结果"
            description="调整筛选条件或清空关键词。"
          >
            <template #actions>
              <UButton variant="solid" color="primary" @click="resetFilters">重置筛选</UButton>
            </template>
          </UEmpty>
        </div>
      </UPageSection>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { mockTools, type ToolItem } from '~/utils/mockData'

const keyword = ref('')
const selectedCategory = ref<string | undefined>(undefined)
const selectedPricing = ref<ToolItem['pricing'] | undefined>(undefined)
const selectedModel = ref<string | undefined>(undefined)

const categories = computed(() => Array.from(new Set(mockTools.flatMap((t) => t.categories))))
const models = computed(() => Array.from(new Set(mockTools.flatMap((t) => t.models || []))))

const categoryOptions = computed(() => [{ label: '全部分类', value: undefined }, ...categories.value.map((c) => ({ label: c, value: c }))])
const pricingOptions = [
  { label: '全部定价', value: undefined },
  { label: '免费', value: 'free' },
  { label: '免费增值', value: 'freemium' },
  { label: '付费', value: 'paid' },
] as const
const modelOptions = computed(() => [{ label: '全部模型', value: undefined }, ...models.value.map((m) => ({ label: m, value: m }))])

const popularCategories = computed(() => categories.value.slice(0, 6))

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return mockTools.filter((tool) => {
    const kwOk = kw
      ? tool.name.toLowerCase().includes(kw) || tool.description.toLowerCase().includes(kw)
      : true
    const categoryOk = selectedCategory.value ? tool.categories.includes(selectedCategory.value) : true
    const pricingOk = selectedPricing.value ? tool.pricing === selectedPricing.value : true
    const modelOk = selectedModel.value ? (tool.models || []).includes(selectedModel.value) : true
    return kwOk && categoryOk && pricingOk && modelOk
  })
})

function resetFilters() {
  keyword.value = ''
  selectedCategory.value = undefined
  selectedPricing.value = undefined
  selectedModel.value = undefined
}

function pricingText(p?: ToolItem['pricing']) {
  if (p === 'free') return '免费'
  if (p === 'freemium') return '免费增值'
  if (p === 'paid') return '付费'
  return '未标注'
}

useSeoMeta({
  title: 'AI 工具导航 - AI Compass',
  description: '搜索与筛选常用 AI 工具，涵盖模型、定价与分类',
  ogTitle: 'AI 工具导航 - AI Compass',
  ogDescription: '搜索与筛选常用 AI 工具，涵盖模型、定价与分类',
})

definePageMeta({ pageTransition: { name: 'fade', mode: 'out-in' } })
</script>
