<template>
  <UContainer>
    <UPageHeader :title="tool?.name" :description="tool?.description">
      <template #headline>
        <div class="flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
          <UBadge v-for="cat in tool?.categories || []" :key="cat" :label="cat" variant="subtle" color="primary" />
          <UBadge v-if="tool" :label="pricingText(tool.pricing)" variant="soft" color="primary" />
          <UButton v-if="tool" :to="tool.url" target="_blank" variant="ghost" size="xs" icon="i-lucide-external-link">访问官网</UButton>
        </div>
      </template>
    </UPageHeader>

    <UPageSection v-if="tool">
      <div class="grid gap-6 lg:grid-cols-3">
        <UCard class="lg:col-span-2">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="text-sm text-neutral-500">工具简介</div>
            </div>
          </template>
          <p class="text-base leading-7 text-neutral-700 dark:text-neutral-200">
            {{ tool.description }}
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <UBadge v-for="tag in tool.tags || []" :key="tag" :label="tag" variant="subtle" color="primary" />
            <UBadge v-for="model in tool.models || []" :key="model" :label="model" variant="soft" color="primary" />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="text-sm text-neutral-500">规格</div>
          </template>
          <ul class="space-y-3 text-sm text-neutral-700 dark:text-neutral-200">
            <li class="flex items-center justify-between gap-3">
              <span>定价</span>
              <span class="font-medium">{{ pricingText(tool.pricing) }}</span>
            </li>
            <li class="flex items-start justify-between gap-3">
              <span>模型支持</span>
              <span class="text-right">
                <span v-for="model in tool.models || []" :key="model" class="block">{{ model }}</span>
                <span v-if="!tool.models?.length">未标注</span>
              </span>
            </li>
            <li class="flex items-start justify-between gap-3">
              <span>分类</span>
              <span class="text-right">
                <span v-for="cat in tool.categories" :key="cat" class="block">{{ cat }}</span>
              </span>
            </li>
          </ul>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection v-if="relatedTools.length" title="相关工具推荐">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UCard v-for="item in relatedTools" :key="item.id">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                {{ item.name.slice(0, 1) }}
              </div>
              <div class="flex-1">
                <NuxtLink :to="`/tools/${item.slug}`" class="font-semibold hover:underline">
                  {{ item.name }}
                </NuxtLink>
                <div class="text-xs text-neutral-500">{{ item.categories.join(' / ') }}</div>
              </div>
            </div>
          </template>
          <p class="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
            {{ item.description }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <UBadge v-for="tag in item.tags || []" :key="tag" :label="tag" variant="subtle" color="primary" />
          </div>
          <div class="mt-4 flex items-center justify-between">
            <UButton :to="item.url" target="_blank" size="xs" variant="ghost" icon="i-lucide-external-link">访问</UButton>
            <UButton :to="`/tools/${item.slug}`" size="xs" variant="solid" color="primary" icon="i-lucide-arrow-right">详情</UButton>
          </div>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection v-else>
      <UEmpty
        title="暂无推荐"
        description="返回工具列表查看更多。"
      >
        <template #actions>
          <UButton to="/tools" variant="solid" color="primary">回到工具列表</UButton>
        </template>
      </UEmpty>
    </UPageSection>
  </UContainer>
</template>

<script setup lang="ts">
import { mockTools, type ToolItem } from '~/utils/mockData'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const tool = computed<ToolItem | undefined>(() => mockTools.find((t) => t.slug === slug.value))

const relatedTools = computed(() => {
  if (!tool.value) return []
  const cats = new Set(tool.value.categories)
  return mockTools
    .filter((t) => t.slug !== tool.value?.slug)
    .map((t) => {
      const overlap = t.categories.some((c) => cats.has(c))
      return { data: t, weight: overlap ? 1 : 0 }
    })
    .filter((x) => x.weight > 0)
    .map((x) => x.data)
    .slice(0, 6)
})

function pricingText(p?: ToolItem['pricing']) {
  if (p === 'free') return '免费'
  if (p === 'freemium') return '免费增值'
  if (p === 'paid') return '付费'
  return '未标注'
}

useSeoMeta({
  title: () => tool.value ? `${tool.value.name} - AI 工具 - AI Compass` : 'AI 工具 - AI Compass',
  description: () => tool.value?.description ?? 'AI 工具详情页',
})

definePageMeta({ pageTransition: { name: 'fade', mode: 'out-in' } })
</script>
