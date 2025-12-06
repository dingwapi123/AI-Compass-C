<template>
  <UFooter>
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns" />
      </UContainer>
    </template>

    <template #left>
      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>&copy; {{ new Date().getFullYear() }} AI Compass</span>
        <span class="hidden md:inline">·</span>
        <span class="hidden md:inline">All rights reserved.</span>
      </div>
    </template>

    <template #right>
      <div class="flex gap-2">
        <UButton
          icon="i-simple-icons-github"
          variant="ghost"
          color="neutral"
          to="https://github.com"
          target="_blank"
        />
      </div>
    </template>
  </UFooter>
</template>

<script lang="ts" setup>
const columns = [
  {
    label: '资源',
    children: [
      { label: '首页', to: '/' },
      { label: '分类', to: '/categories' },
      { label: '资讯', to: '/articles' },
    ],
  },
  {
    label: '社区',
    children: [
      { label: '关于我们', to: '/about' },
      { label: 'GitHub', to: 'https://github.com', target: '_blank' },
    ],
  },
]
</script>
