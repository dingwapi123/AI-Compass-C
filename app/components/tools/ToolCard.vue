<template>
  <NuxtLink :to="`/tools/${tool.slug}`" class="block h-full">
    <UCard
      class="h-full transition-all hover:ring-2 hover:ring-primary-500 hover:shadow-lg flex flex-col group"
    >
      <template #header>
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="tool.image_url"
              :alt="tool.name"
              size="md"
              class="bg-gray-50 dark:bg-gray-800 rounded-xl"
            />
            <div>
              <h3
                class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors"
              >
                {{ tool.name }}
              </h3>
              <div class="flex gap-2 mt-1">
                <UBadge
                  v-if="tool.pricing_model"
                  :color="pricingColor"
                  variant="subtle"
                  size="xs"
                  class="capitalize"
                >
                  {{ tool.pricing_model }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </template>

      <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 flex-1">
        {{ tool.description }}
      </p>

      <template #footer>
      <div class="flex items-center justify-end pt-2">
        <UButton 
          :to="`/tools/${tool.slug}`" 
          variant="ghost" 
          color="neutral" 
          size="sm"
          trailing-icon="i-heroicons-arrow-right"
        >
          Details
        </UButton>
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
  switch (props.tool.pricing_model) {
    case 'free':
      return 'success'
    case 'paid':
      return 'error'
    case 'freemium':
      return 'warning'
    default:
      return 'neutral'
  }
})
</script>
