<template>
  <UContainer class="py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">最新AI日报</h1>
    </div>

    <div class="space-y-4">
      <div
        v-for="item in paginatedNews"
        :key="item.id"
        class="group flex flex-col gap-4 border-b border-gray-200 pb-4 last:border-0 md:flex-row dark:border-gray-800"
      >
        <!-- Content Section -->
        <div class="min-w-0 flex-1">
          <h2
            class="group-hover:text-primary mb-2 line-clamp-1 cursor-pointer text-lg font-bold text-gray-900 transition-colors dark:text-white"
          >
            {{ item.title }}
          </h2>
          <p class="mb-2 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </p>

          <div class="flex items-center gap-4 text-xs text-gray-400">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5" />
              <span>{{ item.date }}</span>
            </div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="w-full shrink-0 md:w-[180px]">
          <div class="aspect-[16/9] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            <NuxtImg
              :src="item.image"
              :alt="item.title"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center">
      <UPagination
        v-model:page="page"
        active-color="neutral"
        active-variant="solid"
        :total="dailyNews.length"
        :items-per-page="itemsPerPage"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
/**
 * Interface for Daily News Item
 */
interface DailyNewsItem {
  id: number
  title: string
  description: string
  date: string
  image: string
}

/**
 * Pagination State
 */
const page = ref(1)
const itemsPerPage = ref(5) // Updated to 5 items per page

/**
 * Mock Data
 */
const dailyNews = ref<DailyNewsItem[]>([
  {
    id: 1,
    title: 'AI日报：可灵Avatar 2.0 上线；谷歌推出Gemini 3 Deep Think模式；阿里云析...',
    description:
      '欢迎来到【AI日报】栏目！这里是你每天探索人工智能世界的指南，每天我们为你呈现AI领域的热点内容，聚焦开发者，助你洞悉技术趋势、了解创新AI产品应用。',
    date: '昨天',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'AI日报：Kling 2.6将发布；千问APP推学习大模型；Z-Image-Turbo-Fun-Contr...',
    description:
      'Kling AI发布2.6版本，新增原生音频生成功能，支持中英双语对白、歌唱与音效同步输出，实现文本到视频的完整创作流程，标志着AI视频进入有声时代。',
    date: '3 天前',
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'AI日报：可灵AI全量上线O1视频大模型；千问APP接入万相Wan2.5；PixVerse ...',
    description:
      '可灵AI公司宣布其O1视频大模型已全量上线，采用统一多模态架构，支持文字、图像等多种输入方式，实现一句话生成视频。',
    date: '4 天前',
    image:
      'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'AI日报：北京发布人工智能产业白皮书；字节发布视频编辑模型Vidi2；快手将发...',
    description:
      '北京发布《人工智能产业白皮书（2025）》，预计核心产值超4500亿元。白皮书详细介绍了2025年中国人工智能大会在京召开情况。',
    date: '5 天前',
    image:
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'AI日报：OpenAI发布Sora 2.0预览版；Midjourney V7即将到来；Stability AI...',
    description:
      'OpenAI今日展示了Sora 2.0的惊人能力，生成视频的时长提升至2分钟，且保持了极高的一致性和物理模拟准确度。',
    date: '6 天前',
    image:
      'https://images.unsplash.com/photo-1535378433864-48cf10419c5c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'AI日报：Meta推出Llama 4系列模型；Hugging Face发布新开源榜单；Anthropic...',
    description:
      'Meta开源了Llama 4系列模型，包含7B、13B、70B三个版本，在多项基准测试中超越了同级别的闭源模型。',
    date: '1 周前',
    image:
      'https://images.unsplash.com/photo-1589254065878-42c9da9e2cb6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'AI日报：苹果WWDC发布Siri 2.0；微软Copilot全面升级；GitHub Copilot X...',
    description:
      '苹果在WWDC上发布了基于大模型的Siri 2.0，支持更自然的对话和跨应用操作。微软宣布Copilot将集成到Windows 12的核心系统层级。',
    date: '1 周前',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'AI日报：特斯拉FSD V13北美公测；Waymo扩大无人驾驶服务范围；百度Apollo...',
    description:
      '特斯拉FSD V13版本开始在北美地区进行大规模公测，新版本采用了端到端神经网络架构，驾驶表现更加拟人化。',
    date: '2 周前',
    image:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
  },
])

/**
 * Computed property for current page items
 */
const paginatedNews = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return dailyNews.value.slice(start, end)
})

// Scroll to top when page changes
watch(page, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

useHead({
  title: '最新AI日报 - AI Compass',
  meta: [{ name: 'description', content: 'AI领域每日热点，技术趋势与产品应用' }],
})
</script>
