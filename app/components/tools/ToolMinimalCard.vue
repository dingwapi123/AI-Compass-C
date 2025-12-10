<template>
  <NuxtLink :to="`/tools/${tool.slug}`" class="flex flex-col gap-3 group">
    <div
      class="w-full bg-gray-200 dark:bg-gray-800 aspect-square bg-cover rounded-xl bg-center transition-transform duration-300 group-hover:scale-[1.02]"
      :style="{
        backgroundImage: `url(${(tool.icon || (tool.images && tool.images[0]) || `https://ui-avatars.com/api/?name=${tool.name}&background=random`)})`,
      }"
    />
    <div class="flex flex-col gap-1">
      <h4
        class="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors"
      >
        {{ tool.name }}
      </h4>
      <p class="text-sm font-normal text-gray-600 dark:text-gray-400 line-clamp-1">
        {{ tool.description }}
      </p>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { Tool } from '~/types'

defineProps<{
  tool: Tool
}>()
</script>
