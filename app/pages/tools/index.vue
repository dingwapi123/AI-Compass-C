<template>
  <div class="space-y-0">
    <div class="bg-gradient-to-b from-primary-50/60 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 pb-8">
      <UContainer>
        <div class="flex flex-col gap-4 py-10">
          <div class="space-y-3 max-w-3xl">
            <div class="inline-flex items-center gap-2 rounded-full bg-primary-100/70 px-4 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-100">
              <UIcon name="i-lucide-grid" /> 工具导航
            </div>
            <h1 class="text-3xl font-bold tracking-tight">AI 工具导航</h1>
            <p class="text-neutral-600 dark:text-neutral-300">按类别浏览常用工具，后续将接入实时数据与收藏。</p>
          </div>
          <div class="w-full max-w-xl">
            <div class="rounded-2xl border border-neutral-200/70 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
              <div class="text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-3">工具分类</div>
              <div class="space-y-2">
                <UButton
                  v-for="cat in categoryMenu"
                  :key="cat"
                  :color="selectedCategory === cat ? 'primary' : 'neutral'"
                  :variant="selectedCategory === cat ? 'soft' : 'ghost'"
                  block
                  class="justify-start"
                  @click="selectedCategory = cat"
                >
                  {{ cat }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer>
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
            description="调整分类或稍后再试。"
          >
            <template #actions>
              <UButton variant="solid" color="primary" @click="resetFilters">重置分类</UButton>
            </template>
          </UEmpty>
        </div>
      </UPageSection>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { mockTools, type ToolItem } from '~/utils/mockData'

const route = useRoute()
const keyword = ref('')
const categoryMenu = [
  'AI写作工具',
  'AI图像工具',
  'AI视频工具',
  'AI办公工具',
  'AI智能体',
  'AI聊天助手',
  'AI编程工具',
  'AI设计工具',
  'AI音频工具',
  'AI搜索引擎',
  'AI开发平台',
  'AI学习网站',
  'AI训练模型',
  'AI内容检测',
]
const selectedCategory = ref<string | undefined>(
  categoryMenu.includes(String(route.query.category || ''))
    ? String(route.query.category)
    : categoryMenu[0]
)

const filtered = computed(() => {
  return mockTools.filter((tool) => {
    const categoryOk = selectedCategory.value ? tool.categories.includes(selectedCategory.value) : true
    return categoryOk
  })
})

watch(
  () => route.query.category,
  (val) => {
    const next = typeof val === 'string' && categoryMenu.includes(val) ? val : categoryMenu[0]
    selectedCategory.value = next
  }
)

function resetFilters() {
  selectedCategory.value = categoryMenu[0]
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
