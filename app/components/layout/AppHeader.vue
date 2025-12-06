<template>
  <UHeader>
    <template #left>
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white"
      >
        <NuxtImg src="/images/image.png" width="50" height="50" />
        <span>AI Compass</span>
      </NuxtLink>
    </template>

    <UNavigationMenu :items="navItems" />

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
    to: '/news',
    icon: 'i-heroicons-newspaper',
    children: [
      {
        label: '新闻资讯',
        to: '/news',
        description: '探索AI前沿，掌握行业发展趋势',
        icon: 'i-heroicons-presentation-chart-line',
      },
      {
        label: 'AI日报',
        to: '/daily',
        description: '每日精选AI热点，追踪最新行业动态',
        icon: 'i-heroicons-clock',
      },
    ],
  },
  { label: '关于', to: '/about', icon: 'i-heroicons-information-circle' },
])
</script>
