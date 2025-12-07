<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
    <UContainer>
      <!-- Header -->
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI 快讯</h1>
        <p class="text-gray-500 dark:text-gray-400">实时追踪全球人工智能技术进展与行业动态</p>
      </div>

      <!-- Timeline Content -->
      <div class="relative max-w-3xl mx-auto">
        <!-- News Groups by Date -->
        <div v-for="group in groupedNews" :key="group.date" class="mb-12 relative">
          <!-- Date Sticky Header -->
          <div class="sticky top-20 z-10 flex justify-center mb-8">
            <span
              class="px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-sm font-medium border border-primary-100 dark:border-primary-900 shadow-sm backdrop-blur-sm"
            >
              {{ formatDate(group.date) }}
            </span>
          </div>

          <!-- Nuxt UI Timeline -->
          <UTimeline
            :items="mapToTimelineItems(group.items)"
            size="xl"
            color="neutral"
            :default-value="mapToTimelineItems(group.items).length"
          >
            <template #title="{ item }">
              <div class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <NuxtLink :to="item.originalData.link" target="_blank" rel="noopener noreferrer">
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                    {{ item.title }}
                  </h3>
                </NuxtLink>
              </div>
            </template>

            <template #description="{ item }">
              <div class="mt-1">
                <NuxtLink
                  :to="item.originalData.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-mono text-gray-400 dark:text-gray-500">{{
                      item.originalData.time
                    }}</span>
                    <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span class="text-xs text-primary-500">{{ item.originalData.source }}</span>
                  </div>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {{ item.description }}
                  </p>
                </NuxtLink>
                <div class="mt-3 flex items-center gap-2">
                  <UBadge
                    v-for="tag in item.originalData.tags"
                    :key="tag"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
              </div>
            </template>
          </UTimeline>
        </div>

        <!-- Loading State -->
        <div ref="loadTrigger" class="py-8 flex justify-center items-center">
          <div v-if="loading" class="flex flex-col items-center gap-2 text-gray-400">
            <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
            <span class="text-sm">正在加载更多快讯...</span>
          </div>
          <div v-else-if="error" class="flex flex-col items-center gap-2">
            <span class="text-red-500 text-sm">加载失败</span>
            <UButton color="neutral" variant="solid" size="sm" @click="retryLoad">重试</UButton>
          </div>
          <div v-else-if="!hasMore" class="text-gray-400 text-sm">- 已显示全部内容 -</div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import type { TimelineItem } from '@nuxt/ui'

// Types
interface NewsItem {
  id: string
  title: string
  summary: string
  content?: string
  source: string
  time: string
  date: string
  link?: string
  tags?: string[]
}

interface NewsGroup {
  date: string
  items: NewsItem[]
}

// SEO
useSeoMeta({
  title: 'AI 快讯 - 实时追踪全球人工智能动态',
  description: '提供最新的AI行业资讯、技术突破、产品发布和投融资动态。',
})

// State
const newsItems = ref<NewsItem[]>([])
const loading = ref(false)
const error = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = 10
const loadTrigger = ref<HTMLElement | null>(null)

// Helper to map NewsItem to TimelineItem
const mapToTimelineItems = (items: NewsItem[]): (TimelineItem & { originalData: NewsItem })[] => {
  return items.map((item) => ({
    icon: 'i-heroicons-newspaper',
    title: item.title,
    description: item.summary,
    originalData: item,
  }))
}

// Mock Data Generator
const generateMockData = (pageNum: number, size: number): NewsItem[] => {
  const baseDate = new Date('2025-12-07') // Simulated "Today"
  const items: NewsItem[] = []

  const sources = ['IT之家', '机器之心', '量子位', 'TechWeb', 'AI工具集', '36氪']
  const tagsPool = ['大模型', 'OpenAI', 'Google', '融资', '新产品', '行业动态', 'Agent']

  const titles = [
    'OpenAI发布GPT-5预览版，多模态能力大幅提升',
    'Google Gemini Ultra 2.0 正式上线，支持百万级Context',
    'Meta开源Llama 4，参数量高达400B',
    '苹果Siri全面接入Apple Intelligence，体验质的飞跃',
    'Midjourney V7发布，生成视频功能惊艳全场',
    'Anthropic Claude 4 Opus登顶各项基准测试',
    '微软Copilot Pro新增企业级数据保护功能',
    '马斯克xAI宣布Grok-2开源，挑战GPT-4',
    '国内某大模型初创公司完成B轮融资，估值超20亿美元',
    '斯坦福发布最新AI指数报告，中国AI专利申请量全球第一',
    'NVIDIA发布新一代AI推理芯片，能效比提升3倍',
    'Adobe Firefly Video模型正式商用，影视行业迎变革',
    'GitHub Copilot Workspace全量开放，重新定义编程体验',
    'DeepMind AlphaFold 4解构更多蛋白质结构',
    '特斯拉FSD V13北美全量推送，接近L4级自动驾驶',
  ]

  for (let i = 0; i < size; i++) {
    const dateOffset = Math.floor(((pageNum - 1) * size + i) / 5)
    const currentDate = new Date(baseDate)
    currentDate.setDate(baseDate.getDate() - dateOffset)

    const dateStr = currentDate.toISOString().split('T')[0] || ''
    const hour = Math.floor(Math.random() * 14) + 8 // 08:00 - 22:00
    const minute = Math.floor(Math.random() * 60)
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

    const titleIndex = (pageNum * size + i) % titles.length

    const randomSource = sources[Math.floor(Math.random() * sources.length)] || '未知来源'
    const randomTag1 = tagsPool[Math.floor(Math.random() * tagsPool.length)] || 'AI'
    const randomTag2 = tagsPool[Math.floor(Math.random() * tagsPool.length)] || '科技'

    items.push({
      id: `${pageNum}-${i}-${Date.now()}`,
      title: titles[titleIndex] || '暂无标题',
      summary: `这里是关于"${
        titles[titleIndex] || '新闻'
      }"的详细摘要。该事件标志着AI领域的又一重大突破，预计将对行业产生深远影响。技术细节方面，新模型采用了...`,
      content: `这里是关于"${
        titles[titleIndex] || '新闻'
      }"的详细内容。该事件标志着AI领域的又一重大突破，预计将对行业产生深远影响。\n\n技术细节方面，新模型采用了最新的Transformer架构变体，在推理速度和准确性上都有显著提升。业内专家认为，这可能会加速AGI的到来。\n\n此外，多家科技巨头也纷纷跟进，宣布了各自的应对策略。市场反应热烈，相关概念股今日大涨。`,
      source: randomSource,
      time: timeStr,
      date: dateStr,
      tags: [randomTag1, randomTag2],
      link: '#',
    })
  }

  // Add some real data from context for the first page
  if (pageNum === 1) {
    const realNews: NewsItem[] = [
      {
        id: 'real-1',
        title: '快手可灵 O1 主体库上线',
        summary: '“主体库”支持一键复用、自由组合，视频 O1 支持至多参考 7 个主体。',
        content:
          '快手可灵 O1 主体库上线：只要有多角度参考图就能让 AI“记住”主角。根据介绍，“主体库”支持一键复用、自由组合，视频 O1 支持至多参考 7 个主体、图片 O1 支持至多参考 10 个主体。当用户只提供了一张主要参考图时，AI 也可以帮助用户自动扩展更多视角，并智能生成主体描述。',
        source: 'IT之家',
        time: '21:42',
        date: '2025-12-06',
        tags: ['新功能', '视频生成'],
      },
      {
        id: 'real-2',
        title: '世界首个原生多模态架构NEO发布',
        summary: '视觉和语言彻底被焊死，1/10数据追平GPT-4V。',
        content:
          'Ilya刚预言完，世界首个原生多模态架构NEO就来了：视觉和语言彻底被焊死1/10数据追平GPT-4V',
        source: '量子位',
        time: '21:39',
        date: '2025-12-06',
        tags: ['多模态', '架构创新'],
      },
      {
        id: 'real-3',
        title: 'SpaceX 有望超 OpenAI 登顶美国私营公司市值榜首',
        summary: '若交易完成，其公司估值有望翻倍至 8000 亿美元。',
        content:
          '目标 2026 年 IPO 上市：SpaceX 有望超 OpenAI 登顶美国私营公司市值榜首。华尔街日报昨日 发布博文，报道称 SpaceX 正启动新一轮二次股票出售，若交易完成，其公司估值有望翻倍至 8000 亿美元，一举超越 OpenAI 成为全美最有价值的私营公司。',
        source: 'TechWeb',
        time: '17:56',
        date: '2025-12-06',
        tags: ['商业', 'OpenAI'],
      },
    ]
    // Insert real news at the beginning
    items.unshift(...realNews)
  }

  // Sort by date desc, time desc
  return items.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date)
    return b.time.localeCompare(a.time)
  })
}

// Data Fetching
const fetchNews = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  error.value = false

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate end of data
    if (page.value > 5) {
      hasMore.value = false
      loading.value = false
      return
    }

    const newItems = generateMockData(page.value, pageSize)
    newsItems.value.push(...newItems)
    page.value++
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

// Grouping Logic
const groupedNews = computed<NewsGroup[]>(() => {
  const groups: Record<string, NewsItem[]> = {}

  newsItems.value.forEach((item) => {
    if (!groups[item.date]) {
      groups[item.date] = []
    }
    groups[item.date].push(item)
  })

  // Sort dates descending
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => ({
      date,
      items: groups[date].sort((a, b) => b.time.localeCompare(a.time)), // Ensure items within group are sorted
    }))
})

// Format Date Helper
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date('2025-12-07') // Using simulated today
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (dateStr === today.toISOString().split('T')[0]) return '今天'
  if (dateStr === yesterday.toISOString().split('T')[0]) return '昨天'

  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// Interaction
const retryLoad = () => {
  fetchNews()
}

// Infinite Scroll
useIntersectionObserver(
  loadTrigger,
  (entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting && hasMore.value && !loading.value && !error.value) {
      fetchNews()
    }
  },
  { threshold: 0.1 }
)

// Initial Load
onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
