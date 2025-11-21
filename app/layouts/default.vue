<template>
  <UHeader :title="siteTitle" to="/">
    <template #left>
      <UNavigationMenu :items="navItems" />
    </template>
    <template #right>
      <ClientOnly>
        <UColorModeSwitch />
      </ClientOnly>
    </template>
  </UHeader>

  <UMain>
    <slot />
  </UMain>

  <UFooter>
    <template #left>
      <span class="text-sm">© {{ new Date().getFullYear() }} AI Compass</span>
    </template>
    <template #right>
      <UButton to="/articles" variant="link">文章</UButton>
    </template>
  </UFooter>
</template>

<script setup lang="ts">
/** 获取站点标题与导航项 */
const siteTitle: string = 'AI Compass'
const navItems = [
  { label: '首页', to: '/' },
  { label: '文章', to: '/articles' },
  { label: '每日快讯', to: '/daily' },
  { label: '工具库', to: '/tools' },
]
</script>

<style scoped></style>
