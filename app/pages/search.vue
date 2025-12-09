<template>
  <div
    class="text-news-primary min-h-screen bg-white font-sans dark:bg-gray-950 dark:text-gray-200"
  >
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
        <!-- Sidebar Filters -->
        <aside class="col-span-1">
          <div class="sticky top-4">
            <div
              class="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div class="mb-4 flex items-center justify-between">
                <h1 class="text-base font-bold">筛选条件</h1>
                <UButton variant="ghost" color="neutral" size="xs" @click="resetFilters">
                  重置
                </UButton>
              </div>

              <!-- Nuxt UI Accordion for Filters -->
              <UAccordion
                :items="accordionItems"
                type="multiple"
                :default-value="['0', '1']"
                :ui="{ item: 'py-0' }"
              >
                <!-- Categories Slot -->
                <template #categories>
                  <div class="pt-2 pb-4">
                    <UCheckboxGroup
                      v-model="selectedCategoryIds"
                      :items="categoryOptions"
                      color="neutral"
                      :ui="{
                        item: 'py-1.5 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                        label: 'text-sm font-normal',
                      }"
                    />
                  </div>
                </template>

                <!-- Pricing Slot -->
                <template #pricing>
                  <div class="pt-2 pb-4">
                    <UCheckboxGroup
                      v-model="selectedPricing"
                      :items="pricingModels"
                      color="neutral"
                      :ui="{
                        item: 'py-1.5 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                        label: 'text-sm font-normal',
                      }"
                    />
                  </div>
                </template>
              </UAccordion>
            </div>
          </div>
        </aside>

        <!-- Results Section -->
        <div class="col-span-1 flex min-h-[60vh] flex-col md:col-span-3">
          <!-- Main Search Bar -->
          <div class="mb-8">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="搜索 AI 工具、新闻或功能..."
              size="xl"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  v-if="searchQuery"
                  color="neutral"
                  variant="link"
                  icon="i-heroicons-x-mark"
                  :padded="false"
                  @click="searchQuery = ''"
                />
              </template>
            </UInput>
          </div>

          <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p class="text-xl font-bold md:text-2xl">
              为您找到与 ‘{{ searchQuery || '全部' }}’ 相关的 {{ filteredTools.length }} 个AI工具
            </p>
          </div>

          <!-- Tool Grid -->
          <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <USkeleton v-for="i in 6" :key="i" class="h-64 w-full rounded-xl" />
          </div>
          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="tool in paginatedTools"
              :key="tool.id"
              class="group flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div class="p-5">
                <div class="mb-3 flex items-start gap-4">
                  <img
                    v-if="tool.icon"
                    class="h-12 w-12 rounded-lg bg-gray-100 object-cover dark:bg-gray-800"
                    :src="tool.icon"
                    :alt="tool.name"
                  />
                  <div
                    v-else
                    class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl font-bold text-gray-400 dark:bg-gray-800"
                  >
                    {{ tool.name.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="text-base font-bold">{{ tool.name }}</h3>
                    <p class="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {{ tool.description }}
                    </p>
                  </div>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <UBadge
                    v-if="tool.pricing"
                    :color="getTagColor(tool.pricing)"
                    variant="subtle"
                    size="xs"
                    class="rounded-full"
                  >
                    {{ tool.pricing }}
                  </UBadge>
                  <UBadge
                    v-for="tag in tool.tags"
                    :key="tag"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                    class="rounded-full"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
              </div>
              <div
                class="border-t border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700/50 dark:bg-gray-800/30"
              >
                <NuxtLink
                  :to="`/tools/${tool.slug}`"
                  class="group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center justify-center text-sm font-semibold text-gray-900 transition-colors dark:text-white"
                >
                  查看详情
                  <UIcon
                    name="i-heroicons-arrow-right"
                    class="ml-1 transition-transform group-hover:translate-x-1"
                  />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="mt-auto flex justify-center pt-12">
            <UPagination
              v-model:page="page"
              active-color="neutral"
              active-variant="solid"
              :items-per-page="itemsPerPage"
              :total="filteredTools.length > 0 ? filteredTools.length : 1"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Search Page
 * Allows users to search and filter AI tools.
 * Uses real data from Supabase via useToolsStore.
 */
import { storeToRefs } from 'pinia'

useSeoMeta({
  title: '搜索 - AI Compass',
  description: '搜索 AI 工具、资讯和资源',
})

const toolsStore = useToolsStore()
const { tools, categories, loading } = storeToRefs(toolsStore)

// Fetch Data
// We fetch all tools for client-side filtering for now.
// For large datasets, this should be server-side filtered.
await useAsyncData('search-data', async () => {
  await Promise.all([toolsStore.fetchCategories(), toolsStore.fetchTools()])
  return true
})

// --- Filter Options ---

// Categories options for CheckboxGroup
const categoryOptions = computed(() => {
  return categories.value.map((c) => ({
    label: c.name,
    value: c.id,
  }))
})

// Pricing options
const pricingModels = computed(() => [
  { label: '免费', value: 'free' },
  { label: '免费试用', value: 'freemium' },
  { label: '付费', value: 'paid' },
])

const accordionItems = [
  {
    label: '分类',
    slot: 'categories',
  },
  {
    label: '价格',
    slot: 'pricing',
  },
]

// --- State ---
const route = useRoute()
const searchQuery = ref((route.query.q as string) || '')
const selectedCategoryIds = ref<string[]>([]) // Store Category IDs
const selectedPricing = ref<string[]>([])

const page = ref(1)
const itemsPerPage = 12

// --- Computed ---
const filteredTools = computed(() => {
  let result = tools.value

  // Search Query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        (tool.tags && tool.tags.some((tag) => tag.toLowerCase().includes(query)))
    )
  }

  // Categories
  if (selectedCategoryIds.value.length > 0) {
    result = result.filter((tool) => selectedCategoryIds.value.includes(tool.category_id))
  }

  // Pricing
  if (selectedPricing.value.length > 0) {
    result = result.filter((tool) => selectedPricing.value.includes(tool.pricing))
  }

  return result
})

const paginatedTools = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTools.value.slice(start, end)
})

// --- Methods ---
const resetFilters = () => {
  selectedCategoryIds.value = []
  selectedPricing.value = []
  searchQuery.value = ''
  page.value = 1
}

// --- Helpers ---
const getTagColor = (tag: string) => {
  if (tag === 'paid' || tag === '付费') return 'info'
  if (tag === 'free' || tag === '免费') return 'success'
  if (tag === 'freemium' || tag === '免费试用') return 'warning'
  return 'neutral'
}

// Watchers
watch([searchQuery, selectedCategoryIds, selectedPricing], () => {
  page.value = 1
})
</script>
