<template>
  <UContainer>
    <UPageHero
      title="AI Compass"
      description="基于 Nuxt 4 + Nuxt UI 的生产级站点模板，优化 SSR 与 SEO，集成 Nuxt Content 作为内容系统。"
      :links="[
        { label: '开始阅读', to: '/articles', icon: 'i-lucide-book-open' },
        {
          label: '了解更多',
          to: 'https://nuxt.com',
          icon: 'i-lucide-external-link',
        },
      ]"
    />

    <UPageSection title="热门分类" description="探索不同领域的 AI 工具">
      <div class="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group block"
        >
          <UCard class="h-full transition-all group-hover:ring-primary-500">
            <div class="flex flex-col items-center text-center">
              <UIcon :name="category.icon || 'i-heroicons-cube'" class="mb-3 h-8 w-8 text-primary-500" />
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ category.name }}</h3>
              <p class="mt-1 text-xs text-gray-500">{{ category.description }}</p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UPageSection>

    <UPageSection title="精选工具" description="最受欢迎的 AI 效率神器">
      <div class="grid gap-6 md:grid-cols-3">
        <UCard v-for="tool in featuredTools" :key="tool.id" class="flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <NuxtLink :to="`/tools/${tool.slug}`" class="font-semibold hover:text-primary-500 hover:underline">
                {{ tool.name }}
              </NuxtLink>
              <UBadge v-if="tool.pricing_model" :color="tool.pricing_model === 'free' ? 'success' : 'warning'" variant="subtle" size="xs">
                {{ tool.pricing_model === 'free' ? '免费' : (tool.pricing_model === 'freemium' ? '免费试用' : '付费') }}
              </UBadge>
            </div>
          </template>
          
          <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {{ tool.description }}
          </p>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-1 text-yellow-500">
              <UIcon name="i-heroicons-star-solid" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ tool.rating }}</span>
            </div>
            <div class="flex gap-2">
               <UBadge
                v-for="tag in (tool.tags || []).slice(0, 2)"
                :key="tag"
                :label="tag"
                color="neutral"
                variant="soft"
                size="xs"
              />
            </div>
          </div>

          <template #footer>
            <UButton :to="`/tools/${tool.slug}`" block variant="ghost" color="neutral">
              查看详情
            </UButton>
          </template>
        </UCard>
      </div>
    </UPageSection>
  </UContainer>
</template>

<script lang="ts" setup>
import { useToolsStore } from '~/stores/tools'

const toolsStore = useToolsStore()

// Fetch data on server side
await useAsyncData('home-data', async () => {
  await Promise.all([
    toolsStore.fetchCategories(),
    toolsStore.fetchTools()
  ])
  return true
})

const categories = computed(() => toolsStore.categories)
const featuredTools = computed(() => toolsStore.tools.slice(0, 6))
</script>

<style scoped></style>
