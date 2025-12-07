<template>
  <div
    class="min-h-screen bg-white dark:bg-gray-950 font-sans text-news-primary dark:text-gray-200"
  >
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <aside class="col-span-1">
          <div class="sticky top-4">
            <div
              class="flex flex-col p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <div class="flex justify-between items-center mb-4">
                <h1 class="text-base font-bold">筛选条件</h1>
                <UButton variant="ghost" color="neutral" size="xs" @click="resetFilters">
                  重置
                </UButton>
              </div>

              <!-- Nuxt UI Accordion for Filters -->
              <UAccordion
                :items="accordionItems"
                type="multiple"
                :default-value="['0', '1', '2']"
                :ui="{ item: 'py-0' }"
              >
                <!-- Categories Slot -->
                <template #categories>
                  <div class="pt-2 pb-4">
                    <UCheckboxGroup
                      v-model="selectedCategories"
                      :items="categories"
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

                <!-- Platforms Slot -->
                <template #platforms>
                  <div class="pt-2 pb-4">
                    <UCheckboxGroup
                      v-model="selectedPlatforms"
                      :items="platforms"
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
        <div class="col-span-1 md:col-span-3 flex flex-col min-h-[60vh]">
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

          <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p class="text-xl md:text-2xl font-bold">
              为您找到与 ‘{{ searchQuery || '全部' }}’ 相关的 {{ filteredTools.length }} 个AI工具
            </p>
          </div>

          <!-- Tool Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="tool in filteredTools"
              :key="tool.id"
              class="group flex flex-col justify-between bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div class="p-5">
                <div class="flex items-start gap-4 mb-3">
                  <img
                    class="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                    :src="tool.logo"
                    :alt="tool.name"
                  />
                  <div>
                    <h3 class="font-bold text-base">{{ tool.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {{ tool.description }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2 mt-4">
                  <UBadge
                    v-for="tag in tool.tags"
                    :key="tag"
                    :color="getTagColor(tag)"
                    variant="subtle"
                    size="xs"
                    class="rounded-full"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
              </div>
              <div
                class="px-5 py-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700/50"
              >
                <NuxtLink
                  :to="tool.url"
                  class="flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                >
                  访问官网
                  <UIcon
                    name="i-heroicons-arrow-right"
                    class="ml-1 transition-transform group-hover:translate-x-1"
                  />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex justify-center pt-12 mt-auto">
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
 * Refactored to use Nuxt UI components.
 */

useSeoMeta({
  title: '搜索 - AI Compass',
  description: '搜索 AI 工具、资讯和资源',
})

// --- Mock Data ---
interface Tool {
  id: number
  name: string
  description: string
  logo: string
  tags: string[]
  category: string
  pricing: string
  platform: string[]
  url: string
}

const tools = ref<Tool[]>([
  {
    id: 1,
    name: 'Jasper AI',
    description: '专为企业营销团队打造，快速生成高质量营销文案、博客文章和社交媒体内容。',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdMwRGIe_McQAL98t3csP8dUKcJlv24wtvd2JXgdN3j0UsA794CTbJwubB4JmtT4rQAkvy0aR-N2b4J7miGMdMXOzYPlYxYTPNc2_0Q_fviVlqSz7foajmWLV28TLAl0-NnDNCTHRkD2gNKo_7ailsBVa49GyF1fOjFCGElvyvjF0wvaOcch84rDR_clxKGpuUIGAp04RuqOumvgnJriygK1yyVYJfMpkBrNVF9Yl8x8R3bjx-LoSU8hENgIk2u4xDakZ2MyxM1QRq',
    tags: ['付费', '营销', '写作'],
    category: '文本生成',
    pricing: '付费',
    platform: ['Web'],
    url: '#',
  },
  {
    id: 2,
    name: 'Copy.ai',
    description: '利用AI技术，为您的业务生成各种创意文案，包括广告语、产品描述和邮件。',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6eQFxy7rcNLcThaQ0A__BubgAszcMYv5b4ULy1pdtLH62KgyDc-KiMyxJjXSyyfAEg7dQfXmjsA_TEW90_Ba0eW7IPftBNGNBjGoU6Yatm7VSSMfwgpI8IZ3y_Bp2LRazk_I5-wZ3ji37gDYl86J32dj5FFtf75kZXZpc9LhfZA-jJ9Gh3sFRQMs2hBtVZGdR4UXMmYDFCM0-pT4Q5hZM1x5Iczmwn0jcMCY3MZQoD2AsuAtD9oldv_5FlciOw9hwvkSBqyF-uwTT',
    tags: ['免费试用', '文案', '自动化'],
    category: '文本生成',
    pricing: '免费试用',
    platform: ['Web'],
    url: '#',
  },
  {
    id: 3,
    name: 'Writesonic',
    description: '一款多功能AI写作助手，能生成SEO友好的文章、广告和社交媒体帖子。',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5G17T8n6YR5ju0QN7-WJcgRVWO3l6xbgLzKfIDch9JJ6FaMrEM5M0z_l_0z21AUi7LPchOx3JhTtlZSNr2UAe-uj_E8VdkT56H4N4tlG_Izl6LBVFmpoQnJzOt-jY0lDF24ngS2hduP6D_b8asHCfITVxK2J7S-AaHk-8C34MHWTdw6kSqEEpnv6kDjEgFJXgHGPoN7EGD3wDe8wzgZskqFqHqk-ttvoFR4qJXjOrj-8AwHeV3BCGuo25ApMF_bkssyudJOY2pBSN',
    tags: ['免费试用', 'SEO', '内容创作'],
    category: '文本生成',
    pricing: '免费试用',
    platform: ['Web'],
    url: '#',
  },
  {
    id: 4,
    name: 'Rytr',
    description: '经济实惠的AI写作工具，适合博主、营销人员和企业家，提供多种写作模板。',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa6YyJnt8l-k899_5HamLFvxt1wFeZDApjWNTzY9Ye37j5oLoSvsNGg_38heDZrX24sS9-fIude4tlgKjRNHLKh-MX2qasfFvlquJyRQng9Arj4-FUTkJLC933GU4hpCXE98Z6-P_mdAh1FnYvKP4skYaCbcjfIxe9uRpntv4IshYNt0sytNL2EPpwx-ceZNS3-WrFkYocZTe6P_x2UDEfylxaHwv7s62AdQpT7VIDrSiQYtqfkgQPHDaNYy1FenaIyjZwW3TjGcnF',
    tags: ['免费', '博客', '模板'],
    category: '文本生成',
    pricing: '免费',
    platform: ['Web'],
    url: '#',
  },
  {
    id: 5,
    name: 'Anyword',
    description: '专注于效果的文案生成平台，预测文案表现，帮助优化转化率。',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1Ym9SYlAfP7SZcbgEUPcMqFY6-Mkkh0fvh7Q6zgzwDc5ltlBCyGJAfNzdWHMo7s60K0fEhnqN_Bn3CFTsXIM6XDl7IPciV5KkKxPTHR7AwCuljoL2wSq_pqnAOzywTxaO1-lCyntMt0y7GhuH4gUgU_KoLadGLDj-0BkPcfAJIfp7aq9VmmN-RKzxXjbTpQR3SgiU4w7uVFErOrh-ys142MKCG2pG4uujIRaxxngcIvi0jkQVrgcJd7P2pZYHTeKNkBUigNbAK1AB',
    tags: ['付费', '数据驱动', '转化率'],
    category: '文本生成',
    pricing: '付费',
    platform: ['Web'],
    url: '#',
  },
  {
    id: 6,
    name: 'Notion AI',
    description: '集成在Notion笔记应用中，随时随地帮你总结、改写和创作文本内容。',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvjXAV9t_phvHS52fLJA6BkTgt0au8JcGF_I-O2A0JjPAO5mUiucqUT4Pn1jzTGqCqhi76dQN8veIYaC-t1fi1o0co_bd8AXOgf17ZCzRDoJryFDOXoH8qjBdyHCs3rHkMOdr5SjRHklnXQUOERLo2CSBGeoYnMOcwynDUakWqf4DfQOmR6msHuu9ohgrxw5fucjIbAOPC4pOYkUymLpnTI87XbZvBpBMcLv_Em2JQALtUK9QMkOa_4UDJDMblIUGbnQ7IH4pgH9vL',
    tags: ['付费', '效率', '笔记'],
    category: '文本生成',
    pricing: '付费',
    platform: ['Web', 'iOS', 'Android'],
    url: '#',
  },
])

// --- Filter Options ---
const categories = [
  { label: '文本生成', value: '文本生成' },
  { label: '图像处理', value: '图像处理' },
  { label: '代码辅助', value: '代码辅助' },
  { label: '音频编辑', value: '音频编辑' },
]

const pricingModels = [
  { label: '免费', value: '免费' },
  { label: '付费', value: '付费' },
  { label: '免费试用', value: '免费试用' },
]

const platforms = [
  { label: 'Web', value: 'Web' },
  { label: 'iOS', value: 'iOS' },
  { label: 'Android', value: 'Android' },
]

// Accordion Items
const accordionItems = [
  { label: '工具类别', slot: 'categories' },
  { label: '价格模型', slot: 'pricing' },
  { label: '平台支持', slot: 'platforms' },
]

// --- State ---
const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const selectedPricing = ref<string[]>([])
const selectedPlatforms = ref<string[]>([])

const page = ref(1)
const itemsPerPage = 12

// --- Computed ---
const filteredTools = computed(() => {
  return tools.value.filter((tool) => {
    // Search Query
    if (
      searchQuery.value &&
      !tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      !tool.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    ) {
      return false
    }

    // Categories
    if (selectedCategories.value.length > 0 && !selectedCategories.value.includes(tool.category)) {
      return false
    }

    // Pricing
    if (selectedPricing.value.length > 0 && !selectedPricing.value.includes(tool.pricing)) {
      return false
    }

    // Platforms
    if (
      selectedPlatforms.value.length > 0 &&
      !tool.platform.some((p) => selectedPlatforms.value.includes(p))
    ) {
      return false
    }

    return true
  })
})

// --- Methods ---
const resetFilters = () => {
  selectedCategories.value = []
  selectedPricing.value = []
  selectedPlatforms.value = []
  searchQuery.value = ''
}

// --- Helpers ---
const getTagColor = (tag: string) => {
  if (tag === '付费') return 'info'
  if (tag === '免费') return 'success'
  if (tag === '免费试用') return 'primary'
  return 'neutral'
}
</script>
