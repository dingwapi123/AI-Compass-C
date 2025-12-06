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
  { label: '文章', to: '/articles', icon: 'i-heroicons-newspaper' },
  { label: '关于', to: '/about', icon: 'i-heroicons-information-circle' },
])
</script>
