<template>
  <div>
    <!-- Hero Section -->
    <section class="relative py-24 overflow-hidden bg-white dark:bg-gray-950">
      <div
        class="absolute inset-0 bg-[url('https://design.ai-compass.com/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
      />

      <UContainer class="relative z-10 text-center">
        <UBadge color="primary" variant="subtle" size="md" class="mb-6 rounded-full">
          Explore the Future of AI
        </UBadge>

        <h1
          class="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
        >
          Discover the Best <br />
          <span class="text-primary-500">AI Tools</span> for You
        </h1>

        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Navigating the AI landscape has never been easier. Find, compare, and use the top AI tools
          to supercharge your workflow.
        </p>

        <div class="max-w-xl mx-auto mb-12">
          <UInput
            icon="i-heroicons-magnifying-glass"
            placeholder="Search for tools (e.g. 'ChatGPT', 'Image Generator')..."
            size="xl"
            :ui="{ icon: { trailing: { pointer: '' } } }"
            class="w-full"
            @keyup.enter="navigateTo('/search')"
          >
            <template #trailing>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-arrow-right"
                @click="navigateTo('/search')"
              />
            </template>
          </UInput>
        </div>

        <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <span>Popular:</span>
          <NuxtLink
            to="/search?q=writing"
            class="hover:text-primary-500 underline decoration-dotted"
            >Writing</NuxtLink
          >
          <NuxtLink to="/search?q=image" class="hover:text-primary-500 underline decoration-dotted"
            >Image Generation</NuxtLink
          >
          <NuxtLink to="/search?q=coding" class="hover:text-primary-500 underline decoration-dotted"
            >Coding</NuxtLink
          >
        </div>
      </UContainer>
    </section>

    <!-- Categories Section -->
    <section
      class="py-16 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800"
    >
      <UContainer>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Browse Categories</h2>
          <UButton
            to="/categories"
            variant="ghost"
            color="gray"
            trailing-icon="i-heroicons-arrow-right"
          >
            View All
          </UButton>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/categories/${category.slug}`"
            class="group"
          >
            <div
              class="h-full p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-center"
            >
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-500 mb-3 group-hover:scale-110 transition-transform"
              >
                <UIcon :name="category.icon || 'i-heroicons-cube'" class="w-6 h-6" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ category.name }}</h3>
              <p class="text-xs text-gray-500">120+ Tools</p>
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- Featured Tools Section -->
    <section class="py-20">
      <UContainer>
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Tools</h2>
            <p class="text-gray-500 dark:text-gray-400">
              Hand-picked AI tools to boost your productivity.
            </p>
          </div>
          <UButton to="/search" color="white" trailing-icon="i-heroicons-arrow-right">
            Explore All
          </UButton>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ToolCard v-for="tool in featuredTools" :key="tool.id" :tool="tool" />
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useToolsStore } from '~/stores/tools'

const toolsStore = useToolsStore()

// Fetch data on server side
await useAsyncData('home-data', async () => {
  await Promise.all([toolsStore.fetchCategories(), toolsStore.fetchTools()])
  return true
})

const categories = computed(() => toolsStore.categories.slice(0, 5))
const featuredTools = computed(() => toolsStore.tools.slice(0, 6))

useSeoMeta({
  title: 'AI Compass - Discover the Best AI Tools',
  description: 'Your ultimate guide to the AI landscape. Find, compare and review top AI tools.',
})
</script>
