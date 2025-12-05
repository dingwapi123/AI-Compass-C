<template>
  <UHeader>
    <template #left>
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white"
      >
        <NuxtImg src="/images/image.png" width="32" height="32" />
        <img src="~/assets/images/image.png" width="32" height="32" />

        <!-- <Img :src="image" width="32" height="32" /> -->

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
import image from '~/assets/images/image.png'
const navItems = ref([
  { label: 'Home', to: '/', icon: 'i-heroicons-home' },
  { label: 'Categories', to: '/categories', icon: 'i-heroicons-squares-2x2' },
  { label: 'News', to: '/articles', icon: 'i-heroicons-newspaper' },
  { label: 'About', to: '/about', icon: 'i-heroicons-information-circle' },
])
</script>
