<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <UContainer>
      <div class="grid grid-cols-12 gap-8 py-8">
        <!-- Sidebar -->
        <aside class="col-span-12 md:col-span-3 lg:col-span-2">
          <div class="sticky top-24">
            <div class="flex flex-col gap-4">
              <h3 class="text-base font-medium px-3 text-gray-900 dark:text-gray-100">分类</h3>
              <div class="flex flex-col gap-1">
                <!-- All Tools Link -->
                <NuxtLink 
                  to="/categories" 
                  class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                  :class="!route.params.slug ? 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'"
                >
                  <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5" />
                  <span class="text-sm font-medium">所有工具</span>
                </NuxtLink>

                <!-- Category Links -->
                <NuxtLink 
                  v-for="category in categories" 
                  :key="category.id" 
                  :to="`/categories/${category.slug}`"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                  :class="route.params.slug === category.slug ? 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'"
                >
                  <UIcon :name="category.icon || 'i-heroicons-tag'" class="w-5 h-5" />
                  <span class="text-sm font-medium">{{ category.name }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="col-span-12 md:col-span-9 lg:col-span-10">
          <NuxtPage />
        </main>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const route = useRoute()
const toolsStore = useToolsStore()
const { categories } = storeToRefs(toolsStore)

// Ensure categories are loaded
await toolsStore.fetchCategories()
</script>
