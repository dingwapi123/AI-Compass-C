<template>
  <NuxtLink :to="`/tools/${tool.slug}`" class="block h-full">
    <UCard
      class="hover:ring-primary-500 group flex h-full flex-col transition-all hover:shadow-lg hover:ring-2"
    >
      <template #header>
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="tool.icon || (tool.images && tool.images[0]) || ''"
              :alt="tool.name"
              size="md"
              class="rounded-none bg-gray-50 dark:bg-gray-800"
            />
            <div>
              <h3
                class="group-hover:text-primary-600 font-bold text-gray-900 transition-colors dark:text-white"
              >
                {{ tool.name }}
              </h3>
              <div class="mt-1 flex gap-2">
                <UBadge
                  v-if="tool.pricing"
                  :color="pricingColor"
                  variant="subtle"
                  size="xs"
                  class="capitalize"
                >
                  {{ tool.pricing }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </template>

      <p class="line-clamp-3 flex-1 text-sm text-gray-500 dark:text-gray-400">
        {{ tool.description }}
      </p>

      <template #footer>
        <div class="flex items-center justify-end pt-2">
          <span
            class="group-hover:text-primary-500 flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors dark:text-gray-400"
          >
            Details
            <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
          </span>
        </div>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { Tool } from '~/types'

const props = defineProps<{
  tool: Tool
}>()

const pricingColor = computed(() => {
  switch (props.tool.pricing) {
    case 'free':
      return 'success'
    case 'paid':
      return 'info'
    case 'freemium':
      return 'warning'
    default:
      return 'neutral'
  }
})
</script>
