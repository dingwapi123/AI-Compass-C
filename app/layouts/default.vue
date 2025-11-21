<template>
  <UHeader :title="siteTitle" to="/">
    <UNavigationMenu :items="navItems" />
    <template #right>
      <ClientOnly>
        <UColorModeSwitch />
      </ClientOnly>
    </template>
    <template #body>
      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        class="-mx-2.5"
      />
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
const siteTitle: string = "AI Compass"
const navItems = [
  { label: "首页", to: "/" },
  { label: "每日快讯", to: "/daily" },
  {
    label: "工具",
    to: "/tools",
  },
]
</script>

<style scoped></style>
