<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
    <!-- Tool Header -->
    <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <UContainer class="py-12">
        <div v-if="tool" class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Logo -->
          <UAvatar
            :src="
              tool.image_url || `https://ui-avatars.com/api/?name=${tool.name}&background=random`
            "
            :alt="tool.name"
            size="3xl"
            class="ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-800 shadow-sm rounded-2xl"
          />

          <div class="flex-1 min-w-0">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-4 text-sm text-gray-500">
              <NuxtLink to="/" class="hover:text-primary-500">首页</NuxtLink>
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
              <NuxtLink to="/categories" class="hover:text-primary-500">分类</NuxtLink>
              <template v-if="category">
                <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
                <NuxtLink :to="`/categories/${category.slug}`" class="hover:text-primary-500">
                  {{ category.name }}
                </NuxtLink>
              </template>
            </div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ tool.name }}
                </h1>
                <div class="flex items-center gap-3 text-sm">
                  <UBadge :color="pricingColor" variant="subtle" class="capitalize">
                    {{ tool.pricing_model }}
                  </UBadge>
                </div>
              </div>

              <div class="flex gap-3">
                <UButton
                  :to="tool.url"
                  target="_blank"
                  color="neutral"
                  size="lg"
                  icon="i-heroicons-arrow-top-right-on-square"
                  class="rounded-full"
                >
                  访问官网
                </UButton>
                <!-- <UButton to="https://github.com/nuxt/ui" target="_blank"> 查看代码 </UButton> -->
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!loading" class="text-center py-12">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">未找到该工具</h1>
          <UButton to="/" class="mt-4" variant="ghost">返回首页</UButton>
        </div>
      </UContainer>
    </div>

    <!-- Content -->
    <UContainer v-if="tool" class="py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-10">
          <!-- Description -->
          <section
            class="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800"
          >
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              关于 {{ tool.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {{ tool.description }}
            </p>
          </section>

          <!-- Screenshots (Placeholder) -->
          <section
            class="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800"
          >
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">应用截图</h2>
            <div
              class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400"
            >
              <div class="text-center">
                <UIcon name="i-heroicons-photo" class="w-12 h-12 mx-auto mb-2" />
                <span>暂无截图</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Info Card -->
          <div
            class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h3 class="font-bold text-gray-900 dark:text-white mb-4">工具信息</h3>
            <div class="space-y-4">
              <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span class="text-gray-500 text-sm">分类</span>
                <NuxtLink
                  v-if="category"
                  :to="`/categories/${category.slug}`"
                  class="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  {{ category.name }}
                </NuxtLink>
                <span v-else class="text-sm text-gray-900 dark:text-white">-</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span class="text-gray-500 text-sm">价格模式</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">{{
                  tool.pricing_model
                }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span class="text-gray-500 text-sm">发布时间</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ new Date(tool.created_at).toLocaleDateString() }}
                </span>
              </div>
            </div>

            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">标签</h4>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="tag in tool.tags"
                  :key="tag"
                  color="neutral"
                  variant="soft"
                  size="xs"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </div>
          </div>

          <!-- Related Tools -->
          <div
            v-if="relatedTools.length > 0"
            class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h3 class="font-bold text-gray-900 dark:text-white mb-4">相关推荐</h3>
            <div class="space-y-4">
              <NuxtLink
                v-for="related in relatedTools"
                :key="related.id"
                :to="`/tools/${related.slug}`"
                class="flex gap-3 group"
              >
                <UAvatar
                  :src="
                    related.image_url ||
                    `https://ui-avatars.com/api/?name=${related.name}&background=random`
                  "
                  size="md"
                  class="rounded-lg bg-gray-50"
                />
                <div class="flex-1 min-w-0">
                  <div
                    class="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate"
                  >
                    {{ related.name }}
                  </div>
                  <div class="text-xs text-gray-500 truncate">{{ related.description }}</div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const route = useRoute()
const toolsStore = useToolsStore()
const { tools, categories, loading } = storeToRefs(toolsStore)

// Load data
await toolsStore.fetchCategories()
await toolsStore.fetchTools()

const toolSlug = route.params.slug as string

const tool = computed(() => {
  return tools.value.find((t) => t.slug === toolSlug)
})

const category = computed(() => {
  if (!tool.value) return null
  return categories.value.find((c) => c.id === tool.value.category_id)
})

const relatedTools = computed(() => {
  const currentTool = tool.value
  if (!currentTool) return []
  // Find tools in same category, excluding current one, limit to 3
  return tools.value
    .filter((t) => t.category_id === currentTool.category_id && t.id !== currentTool.id)
    .slice(0, 3)
})

const pricingColor = computed(() => {
  switch (tool.value?.pricing_model) {
    case 'free':
      return 'success'
    case 'paid':
      return 'error'
    case 'freemium':
      return 'warning'
    default:
      return 'neutral'
  }
})

useHead({
  title: computed(() =>
    tool.value ? `${tool.value.name} - AI Compass` : '工具不存在 - AI Compass'
  ),
  meta: [
    {
      name: 'description',
      content: computed(() => tool.value?.description || '查看 AI 工具详情。'),
    },
  ],
})

// Handle 404
if (!tool.value && !loading.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tool Not Found',
  })
}
</script>
