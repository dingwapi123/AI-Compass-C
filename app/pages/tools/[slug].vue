<template>
  <div class="bg-gray-50 dark:bg-gray-950 pb-24">
    <UContainer class="py-8">
      <!-- 1. Breadcrumb Section -->
      <nav class="flex items-center gap-2 mb-8 text-sm text-gray-500">
        <NuxtLink
          to="/"
          class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          Home
        </NuxtLink>
        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
        <NuxtLink
          to="/categories"
          class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          Categories
        </NuxtLink>
        <template v-if="category">
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
          <NuxtLink
            :to="`/categories/${category.slug}`"
            class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {{ category.name }}
          </NuxtLink>
        </template>
        <template v-if="tool">
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
          <span class="text-gray-900 dark:text-gray-200 font-medium truncate">{{ tool.name }}</span>
        </template>
      </nav>

      <div v-if="tool" class="space-y-8">
        <!-- 2. Hero Card Section -->
        <div
          class="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Logo -->
            <div class="flex-shrink-0">
              <UAvatar
                :src="
                  tool.image_url ||
                  `https://ui-avatars.com/api/?name=${tool.name}&background=random`
                "
                :alt="tool.name"
                size="3xl"
                class="w-32 h-32 rounded-2xl ring-1 ring-gray-200 dark:ring-gray-800 bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <!-- Main Info -->
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    {{ tool.name }}
                  </h1>
                  <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
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
                    class="rounded-xl px-6 py-3 font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    Visit Website
                  </UButton>
                </div>
              </div>

              <!-- Metadata / Tags -->
              <div
                class="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-3 items-center"
              >
                <!-- Pricing Badge -->
                <UBadge
                  :color="pricingColor"
                  variant="subtle"
                  size="md"
                  class="rounded-lg px-3 py-1.5 capitalize"
                >
                  {{ tool.pricing_model }}
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
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <!-- Left Column: Description & Gallery -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Description Card -->
            <section
              class="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Description</h2>
              <div
                class="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line"
              >
                {{ tool.description }}
              </div>
            </section>

            <!-- Gallery Card -->
            <section
              class="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gallery</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Placeholder 1 -->
                <div
                  class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center group cursor-pointer overflow-hidden"
                >
                  <div
                    class="text-gray-400 group-hover:scale-110 transition-transform duration-300"
                  >
                    <UIcon name="i-heroicons-photo" class="w-12 h-12 mx-auto mb-2" />
                  </div>
                </div>
                <!-- Placeholder 2 -->
                <div
                  class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center group cursor-pointer overflow-hidden"
                >
                  <div
                    class="text-gray-400 group-hover:scale-110 transition-transform duration-300"
                  >
                    <UIcon name="i-heroicons-photo" class="w-12 h-12 mx-auto mb-2" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Similar Tools -->
          <div class="space-y-8">
            <div
              class="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Similar Tools</h3>

              <div v-if="relatedTools.length > 0" class="space-y-6">
                <NuxtLink
                  v-for="related in relatedTools"
                  :key="related.id"
                  :to="`/tools/${related.slug}`"
                  class="flex items-start gap-4 group"
                >
                  <UAvatar
                    :src="
                      related.image_url ||
                      `https://ui-avatars.com/api/?name=${related.name}&background=random`
                    "
                    size="lg"
                    class="rounded-xl bg-gray-50 ring-1 ring-gray-100 dark:ring-gray-800 flex-shrink-0"
                  />
                  <div class="min-w-0 pt-1">
                    <div
                      class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate text-base mb-1"
                    >
                      {{ related.name }}
                    </div>
                    <div class="text-sm text-gray-500 line-clamp-2 leading-snug">
                      {{ related.description }}
                    </div>
                  </div>
                </NuxtLink>
              </div>
              <div v-else class="text-gray-500 text-center py-8">No similar tools found.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="!loading" class="text-center py-20">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 text-gray-400" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tool Not Found</h1>
        <p class="text-gray-500 mb-6">
          The tool you are looking for does not exist or has been removed.
        </p>
        <UButton to="/" color="gray" variant="solid">Return Home</UButton>
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
  return categories.value.find((c) => c.id === tool.value.category_id)
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
  switch (tool.value.pricing_model) {
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
