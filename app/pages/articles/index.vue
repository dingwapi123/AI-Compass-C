<template>
  <UContainer>
    <div class="flex flex-col gap-8 py-10 min-h-screen bg-white dark:dark:bg-gray-950 font-sans">
      <!-- Header Section -->
      <div class="flex flex-wrap justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div class="flex min-w-72 flex-col gap-2">
          <h1
            class="text-news-primary dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]"
          >
            探索AI前沿
          </h1>
          <p class="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
            获取最新的AI行业新闻、文章和更新
          </p>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="flex gap-3 px-4 sm:px-6 lg:px-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="filter in filters"
          :key="filter"
          class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 cursor-pointer transition-colors"
          :class="[
            activeFilter === filter
              ? 'bg-news-primary text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-news-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
          @click="activeFilter = filter"
        >
          <p class="text-sm font-medium leading-normal">{{ filter }}</p>
        </button>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        <NuxtLink
          v-for="article in articles"
          :key="article.id"
          :to="`/articles/${article.slug}`"
          class="flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 transition-shadow hover:shadow-lg dark:hover:shadow-gray-900/50 group"
        >
          <div
            class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden"
            :style="{ backgroundImage: `url(${article.image})` }"
          >
            <!-- Fallback or NuxtImg could be used here, but using bg-image as per design -->
          </div>
          <div class="flex flex-col gap-2 flex-grow">
            <h3
              class="text-news-primary dark:text-white text-base font-bold leading-normal group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            >
              {{ article.title }}
            </h3>
            <p
              class="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal flex-grow line-clamp-3"
            >
              {{ article.description }}
            </p>
            <p class="text-gray-500 dark:text-gray-500 text-xs font-normal leading-normal mt-2">
              来源: {{ article.source }} · {{ article.date }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-center p-4 mt-6 gap-2">
        <button
          class="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-news-primary dark:text-white"
          :disabled="currentPage === 1"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
        </button>

        <button
          v-for="page in [1, 2, 3]"
          :key="page"
          class="text-sm font-normal leading-normal flex size-10 items-center justify-center rounded-full transition-colors"
          :class="[
            currentPage === page
              ? 'bg-news-primary text-white font-bold'
              : 'text-news-primary dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800',
          ]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>

        <span
          class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-news-primary dark:text-white rounded-full"
          >...</span
        >

        <button
          class="text-sm font-normal leading-normal flex size-10 items-center justify-center text-news-primary dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          @click="currentPage = 10"
        >
          10
        </button>

        <button
          class="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-news-primary dark:text-white"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
/**
 * News Page
 * Implements the design from code.html using Tailwind CSS v4 and Vue Composition API.
 */

// Define Article Interface
interface Article {
  id: number
  title: string
  description: string
  source: string
  date: string
  image: string
  slug: string
}

// State
const activeFilter = ref('全部')
const currentPage = ref(1)

const filters = ['全部', '行业动态', '技术解读', '产品更新', '研究论文', '市场分析']

// Mock Data from code.html
const articles = ref<Article[]>([
  {
    id: 1,
    slug: 'gpt-4o-launch',
    title: 'OpenAI发布新旗舰模型GPT-4o：实时语音与视觉交互的新纪元',
    description:
      'GPT-4o能够处理音频、视觉和文本的任意组合输入，并生成相应的组合输出，响应速度大幅提升...',
    source: 'OpenAI Blog',
    date: '2024年5月14日',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfIfRffNIYoDgWN8NF8ZFLvY7NHTbOUW0BiDuSs6YMRDZ-homNtkq__l3wDJ_E3twzQV5Ef1y4b6XvKYsI6UjipYn4FCNkh1X6Uu2wIhoopPRJMWS41OVo15fw3PaM8NCQsGqttnBth22uGojW1zWo4qaNx0mrC9POE0wOudIyo-c493Cbsq8URkBPR62UBUCvLLiI8L8J9vvS19cZsv4AakrxE7e6fIeD-_TeObZZfvblsGLIc_529Zb7n4NdN-1VzIcd58sTRspj',
  },
  {
    id: 2,
    slug: 'google-project-astra',
    title: '谷歌I/O大会总结：Project Astra展示多模态AI未来',
    description:
      '谷歌展示了其下一代AI助手Project Astra，能够通过手机摄像头实时理解和响应周围世界...',
    source: 'Google AI Blog',
    date: '2024年5月15日',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5lhzodClphIRkvByQ1oDntzKIRzDBTuLrY8WmciNdoDAKjmVdMOS17QFiHh9TZSG-0GsekG14DRBtXahrNIWNoTS9LqYX1LbWdsZQgSlXUi16DBpSkf94VpwrtrACk_CZvGmRABNEr4OakLJeONkz34V3SrI1QID9Sx_ygbYxGkw0Mch5TU4dNh78S4e1_YhbwMCVS_PuwxUMsgQHLanX8QS3y9D3H1QIaZ53FnIV7NRYFXkQzEX42vLcNhQYUoVAcQjorkDu5IM8',
  },
  {
    id: 3,
    slug: 'claude-3-5-sonnet',
    title: 'Anthropic发布Claude 3.5 Sonnet，速度更快成本更低',
    description:
      'Claude 3.5 Sonnet在编码、视觉和高阶指令遵循方面树立了新的行业标准，且速度是前代模型的两倍...',
    source: 'Anthropic News',
    date: '2024年6月20日',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfk0QwQRBC8WQF_f_9v9y9flQi-Ra5TkkZJL97jgCTSIG8oBDwIy_a3jPJb64SG2VZ7PbeCHbd_A6J7tX8-rYY9ugCNu8mvw8Qb4AdIdpeBxDvbdYG2UYSts0_2W6FmSk05wEDawwizwZ0dYgeXZCo9ptONSNHjPuHPLyNog66RkBKlXif4s6FmnkORke_tc3WxpS6VE5pBAkupFF4gOU7cCq5-350ocrdKZaKJ7YcvgZyQAzEZ9xDyHOHbQXx8j5yQ48U34tj9aIV',
  },
  {
    id: 4,
    slug: 'nvidia-blackwell',
    title: 'NVIDIA Blackwell架构芯片详情公布，推动下一代AI计算',
    description:
      'Blackwell GPU旨在为万亿参数级的大型语言模型提供动力，其性能实现了代际的巨大飞跃...',
    source: 'NVIDIA Blog',
    date: '2024年6月18日',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZJi88JCMJ_sJT--IJmsmrf3Pr4E9gI7kBudBhH_dGOHo-acJAc_lNOdgFwaaK2tWkJm6zwdtpzgzgFIQEA7zNuXfb_NbLtLMw503iQ66KfybtKABhvwfPWxRlHvtUzx66akmC3SXrgwHBL4httkbwXQ8v54fdUkZTxAi3_bo0PRifmocYi0pjinYBS4e5Ci6RMKxx_H1_XvyyCBG2VCa6UII26U55qnN8XkJWTPxiMOtz_wCr3LF0BwBMq4prXmn6EnNysJ09CH7v',
  },
  {
    id: 5,
    slug: 'diffusion-models-paper',
    title: '深度学习新突破：解读最新的扩散模型研究论文',
    description:
      '本文深入探讨了最新的几篇关于扩散模型的研究论文，分析了其在图像生成和数据合成方面的新进展...',
    source: 'arXiv',
    date: '2024年6月15日',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCr1f9v1xBAevevzE9HfWvWAgmHLjYfkYdHby8m_bDJ4M6cG4cjZGZBmeV88fGG9wWmbAFKdOUnm-Qfesg980_62nxFcf7MxnSJXpIdR2o-v4bv1oR5V0niIL8n-GPNOFu6UHhpFsANxdD8AUNC2t7_etpKbUv2mp1H7hUCJJYc78PxmYzpdrBKW54rfubDCSvx6CeJoXcLYN1CbJzZEKjzCythXjhHC8rGTvRGD8P3xM0B0h3VpqCjNfZRC407xlew7YtxkeN8LmOJ',
  },
  {
    id: 6,
    slug: 'ai-medical-diagnosis',
    title: 'AI在医疗诊断领域的应用与市场分析报告',
    description:
      '报告指出，AI辅助诊断市场预计在未来五年内将以30%的年复合增长率增长，尤其是在医学影像分析领域...',
    source: 'Market Research Hub',
    date: '2024年6月12日',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBn655LG7I6tlPRKV6it8FCvr6OsMkS965Eg0YC8hL2hGBlF7LT_L0K_4RC7WAq2CIcEMmk-nB1ZHJ2lSgceM5tnsCr_muPs7EABpuwK1v60L4gtq0nHDsaX__rNJqKDlvFvAlmiVSYpYQ5B-CneE7pWtZUTRAc3jQnIL-zIKOZynoPl8pM2EU7RADf3X6psK8WvP6nHO3j--ARIXgy7tn6gCJlBlmGsh903IrnYChq2Oj1Gzrr8DtEwEJe6j4ueJOF2frD94ohgARW',
  },
])

// SEO Meta
useSeoMeta({
  title: '最新AI资讯 - AI Compass',
  description: '探索AI前沿，获取最新的AI行业新闻、文章和更新',
  ogTitle: '最新AI资讯 - AI Compass',
  ogDescription: '探索AI前沿，获取最新的AI行业新闻、文章和更新',
})

definePageMeta({
  pageTransition: { name: 'fade', mode: 'out-in' },
})
</script>

<style scoped>
/* Ensure aspect ratio works if Tailwind plugin not present */
.aspect-video {
  aspect-ratio: 16 / 9;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
