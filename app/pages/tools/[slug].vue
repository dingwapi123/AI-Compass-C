<template>
  <div class="bg-gray-50 pb-24 dark:bg-gray-950">
    <UContainer class="py-8">
      <!-- 1. Breadcrumb Section -->
      <UBreadcrumb :items="breadcrumbItems" class="mb-8" />

      <div v-if="tool" class="space-y-8">
        <!-- 2. Hero Card Section -->
        <div
          class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex flex-col gap-8 md:flex-row">
            <!-- Logo -->
            <div class="flex-shrink-0">
              <UAvatar
                :src="
                  (tool.images && tool.images[0]) ||
                  `https://ui-avatars.com/api/?name=${tool.name}&background=random`
                "
                :alt="tool.name"
                size="3xl"
                class="h-32 w-32 rounded-2xl bg-gray-50 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800"
              />
            </div>

            <!-- Main Info -->
            <div class="flex min-w-0 flex-1 flex-col justify-between">
              <div class="flex flex-col items-start justify-between gap-6 md:flex-row">
                <div>
                  <h1 class="mb-3 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                    {{ tool.name }}
                  </h1>
                  <p class="line-clamp-2 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    {{
                      tool.description
                        ? tool.description.slice(0, 150) +
                          (tool.description.length > 150 ? '...' : '')
                        : ''
                    }}
                  </p>
                </div>

                <div class="flex-shrink-0">
                  <UButton
                    :to="tool.url"
                    target="_blank"
                    color="neutral"
                    size="xl"
                    icon="i-heroicons-arrow-top-right-on-square"
                    class="rounded-xl px-6 py-3 font-semibold shadow-sm transition-all hover:shadow-md"
                  >
                    Visit Website
                  </UButton>
                </div>
              </div>

              <!-- Metadata / Tags -->
              <div
                class="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-8 dark:border-gray-800"
              >
                <!-- Pricing Badge -->
                <UBadge
                  :color="pricingColor"
                  variant="subtle"
                  size="md"
                  class="rounded-lg px-3 py-1.5 capitalize"
                >
                  {{ tool.pricing }}
                </UBadge>

                <!-- Category Badge -->
                <UBadge
                  v-if="category"
                  color="neutral"
                  variant="soft"
                  size="md"
                  class="rounded-lg px-3 py-1.5"
                >
                  {{ category.name }}
                </UBadge>

                <!-- Tags -->
                <UBadge
                  v-for="tag in tool.tags"
                  :key="tag"
                  color="neutral"
                  variant="soft"
                  size="md"
                  class="rounded-lg px-3 py-1.5"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Content Grid -->
        <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <!-- Left Column: Description & Gallery -->
          <div class="space-y-8 lg:col-span-2">
            <!-- Description Card -->
            <section
              class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Description</h2>
              <div
                class="prose dark:prose-invert max-w-none leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300"
              >
                {{ tool.description }}
              </div>
            </section>

            <!-- Gallery Card -->
            <section
              class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Gallery</h2>
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <!-- Placeholder 1 -->
                <div
                  class="group flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
                >
                  <div
                    class="text-gray-400 transition-transform duration-300 group-hover:scale-110"
                  >
                    <UIcon name="i-heroicons-photo" class="mx-auto mb-2 h-12 w-12" />
                  </div>
                </div>
                <!-- Placeholder 2 -->
                <div
                  class="group flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
                >
                  <div
                    class="text-gray-400 transition-transform duration-300 group-hover:scale-110"
                  >
                    <UIcon name="i-heroicons-photo" class="mx-auto mb-2 h-12 w-12" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Similar Tools -->
          <div class="space-y-8">
            <div
              class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 class="mb-6 text-xl font-bold text-gray-900 dark:text-white">Similar Tools</h3>

              <div v-if="relatedTools.length > 0" class="space-y-6">
                <NuxtLink
                  v-for="related in relatedTools"
                  :key="related.id"
                  :to="`/tools/${related.slug}`"
                  class="group flex items-start gap-4"
                >
                  <UAvatar
                    :src="
                      (related.images && related.images[0]) ||
                      `https://ui-avatars.com/api/?name=${related.name}&background=random`
                    "
                    size="lg"
                    class="flex-shrink-0 rounded-xl bg-gray-50 ring-1 ring-gray-100 dark:ring-gray-800"
                  />
                  <div class="min-w-0 pt-1">
                    <div
                      class="group-hover:text-primary-600 mb-1 truncate text-base font-bold text-gray-900 transition-colors dark:text-white"
                    >
                      {{ related.name }}
                    </div>
                    <div class="line-clamp-2 text-sm leading-snug text-gray-500">
                      {{ related.description }}
                    </div>
                  </div>
                </NuxtLink>
              </div>
              <div v-else class="py-8 text-center text-gray-500">No similar tools found.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="!loading" class="py-20 text-center">
        <div
          class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="h-8 w-8 text-gray-400" />
        </div>
        <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Tool Not Found</h1>
        <p class="mb-6 text-gray-500">
          The tool you are looking for does not exist or has been removed.
        </p>
        <UButton to="/" color="neutral" variant="solid">Return Home</UButton>
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

/**
 * Current Tool Computed Property
 */
const tool = computed(() => {
  return tools.value.find((t) => t.slug === toolSlug)
})

/**
 * Current Category Computed Property
 */
const category = computed(() => {
  if (!tool.value) return null
  return categories.value.find((c) => c.id === tool.value!.category_id)
})

/**
 * Breadcrumb Items
 */
const breadcrumbItems = computed(() => {
  const items: { label: string; to?: string }[] = [
    { label: '首页', to: '/' },
    { label: '分类', to: '/categories' },
  ]

  if (category.value) {
    items.push({
      label: category.value.name,
      to: `/categories/${category.value.slug}`,
    })
  }

  if (tool.value) {
    items.push({
      label: tool.value.name,
    })
  }

  return items
})

/**
 * Related Tools Computed Property
 * Filters tools by same category, excluding current tool
 */
const relatedTools = computed(() => {
  const currentTool = tool.value
  if (!currentTool) return []
  return tools.value
    .filter((t) => t.category_id === currentTool.category_id && t.id !== currentTool.id)
    .slice(0, 3)
})

/**
 * Pricing Model Badge Color
 */
const pricingColor = computed(() => {
  if (!tool.value) return 'neutral'
  switch (tool.value.pricing) {
    case 'free':
      return 'primary' // Changed to primary for better visibility
    case 'paid':
      return 'error'
    case 'freemium':
      return 'warning'
    default:
      return 'neutral'
  }
})

// SEO Meta
useHead({
  title: computed(() => (tool.value ? `${tool.value.name} - AI Navigator` : 'Tool Not Found')),
  meta: [
    {
      name: 'description',
      content: computed(() => tool.value?.description || 'Discover the best AI tools.'),
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
