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
        <UButton
          icon="i-simple-icons-twitter"
          variant="ghost"
          color="neutral"
          to="https://twitter.com"
          target="_blank"
        />
      </div>
    </template>
  </UFooter>
</template>

<script lang="ts" setup>
const columns = [
  {
    label: 'Resources',
    children: [
      { label: 'Home', to: '/' },
      { label: 'Categories', to: '/categories' },
      { label: 'News', to: '/articles' },
    ],
  },
  {
    label: 'Community',
    children: [
      { label: 'About Us', to: '/about' },
      { label: 'Submit Tool', to: '/admin' },
      { label: 'GitHub', to: 'https://github.com', target: '_blank' },
    ],
  },
  {
    label: 'Legal',
    children: [
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
    ],
  },
]
</script>
