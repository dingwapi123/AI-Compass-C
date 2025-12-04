<template>
  <NuxtLink :to="`/tools/${tool.slug}`" class="flex flex-col gap-3 group">
    <div
      class="w-full bg-gray-200 dark:bg-gray-800 aspect-square bg-cover rounded-xl bg-center transition-transform duration-300 group-hover:scale-[1.02]"
      :style="{
        backgroundImage: `url(${
          tool.image_url || `https://ui-avatars.com/api/?name=${tool.name}&background=random`
        })`,
      }"
    />
    <div class="flex flex-col gap-1">
      <h4
        class="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors"
      >
        {{ tool.name }}
      </h4>
      <p class="text-sm font-normal text-gray-600 dark:text-gray-400 line-clamp-2">
        {{ tool.description }}
      </p>
      <span
        class="text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
      >
        查看详情 <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
      </span>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { Tool } from '~/types'

defineProps<{
  tool: Tool
}>()
</script>
