<template>
  <div
    class="flex flex-col min-h-screen bg-news-bg-light dark:bg-news-bg-dark font-sans text-news-primary dark:text-gray-200"
  >
    <main class="flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl flex flex-col gap-10">
        <!-- Header Section -->
        <div class="flex min-w-72 flex-col gap-3 text-center">
          <h1
            class="text-4xl font-black leading-tight tracking-[-0.033em] text-news-primary dark:text-white md:text-5xl"
          >
            关于我们
          </h1>
          <p
            class="text-base font-normal leading-normal text-gray-600 dark:text-gray-400 md:text-lg"
          >
            一个收集、分类并连接到最新AI资讯和工具的导航网站。
          </p>
        </div>

        <!-- Content Sections -->
        <div class="flex flex-col gap-8">
          <section>
            <h2
              class="text-[22px] font-bold leading-tight tracking-[-0.015em] text-news-primary dark:text-white pb-3 pt-5"
            >
              关于 AI导航
            </h2>
            <p class="text-base font-normal leading-relaxed text-gray-700 dark:text-gray-300">
              欢迎来到AI导航，我们是一个致力于简化您探索人工智能世界的专业平台。在这里，我们精心策划和分类了海量的AI信息和前沿工具，帮助您轻松发现、学习和应用AI技术。
            </p>
          </section>

          <section>
            <h2
              class="text-[22px] font-bold leading-tight tracking-[-0.015em] text-news-primary dark:text-white pb-3 pt-5"
            >
              我们的宗旨与愿景
            </h2>
            <p class="text-base font-normal leading-relaxed text-gray-700 dark:text-gray-300 pb-3">
              我们的核心宗旨是为用户提供一个高效、可靠的AI资源入口。面对日新月异的AI技术和层出不穷的应用工具，我们旨在通过系统化的整理和分类，降低用户获取高质量信息的门槛，帮助每个人都能跟上AI时代的步伐。
            </p>
            <p class="text-base font-normal leading-relaxed text-gray-700 dark:text-gray-300">
              我们的愿景是成为连接用户与AI未来的桥梁。我们相信，通过普及AI知识和工具，可以激发更多创新，无论是专业开发者、行业研究者还是充满好奇心的初学者，都能在这里找到灵感和价值，共同推动人工智能技术的发展与应用。
            </p>
          </section>

          <section>
            <h2
              class="text-[22px] font-bold leading-tight tracking-[-0.015em] text-news-primary dark:text-white pb-3 pt-5"
            >
              重要声明
            </h2>
            <p class="text-base font-normal leading-relaxed text-gray-700 dark:text-gray-300">
              本网站作为AI工具和资讯的聚合导航平台，所有内容均来源于第三方网站。我们不拥有所链接的任何AI工具的所有权，也不对其内容、功能或行为负责。本站提供的信息仅供参考，用户在使用任何第三方工具前，请务必仔细阅读并遵守其服务条款和隐私政策。对于因使用本站链接的任何第三方服务而造成的任何直接或间接损失，本站概不负责。
            </p>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * About Page
 * Displays platform information, mission, and disclaimer.
 * Based on provided code.html design.
 */

useSeoMeta({
  title: '关于我们 - AI Compass',
  description: '一个收集、分类并连接到最新AI资讯和工具的导航网站。',
})

definePageMeta({
  pageTransition: { name: 'fade', mode: 'out-in' },
})
</script>
