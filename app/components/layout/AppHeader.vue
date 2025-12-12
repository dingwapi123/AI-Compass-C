<template>
  <UHeader>
    <template #left>
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
      >
        <NuxtImg src="/images/image.png" width="50" height="50" />
        <span>AI Compass</span>
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="navItems"
      :ui="{
        childList: 'grid grid-cols-1 gap-2',
      }"
    />

    <template #right>
      <div class="flex items-center gap-2">
        <UButton to="/search" icon="i-heroicons-magnifying-glass" variant="ghost" color="neutral" />
        <UColorModeButton />
      </div>
    </template>

    <template #body>
      <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>

<script lang="ts" setup>
const navItems = ref([
  { label: '首页', to: '/', icon: 'i-heroicons-home' },
  { label: '分类', to: '/categories', icon: 'i-heroicons-squares-2x2' },
  {
    label: '资讯',
    to: '/breaking-news',
    icon: 'i-heroicons-newspaper',
    children: [
      {
        label: 'AI快讯',
        to: '/breaking-news',
        description: 'AI领域的突发新闻与重要动态',
        icon: 'i-heroicons-clock',
      },
      {
        label: 'AI日报',
        to: '/daily',
        description: '每日精选AI热点，追踪最新行业动态',
        icon: 'i-heroicons-presentation-chart-line',
      },
    ],
  },
  { label: '关于', to: '/about', icon: 'i-heroicons-information-circle' },
  { label: '工具', to: '/manage-tools', icon: 'i-heroicons-calculator' },
])
</script>
