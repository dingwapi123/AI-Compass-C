<template>
  <UContainer>
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon
        name="i-heroicons-arrow-path"
        class="h-8 w-8 animate-spin text-gray-400"
      />
    </div>
    <template v-else-if="tool">
      <UPageHeader :title="tool.name" :description="tool.description">
        <template #right>
          <div class="flex gap-2">
            <UButton
              icon="i-heroicons-heart"
              variant="ghost"
              :color="isFavorite ? 'error' : 'neutral'"
              @click="toggleFavorite"
            >
              {{ isFavorite ? "已收藏" : "收藏" }}
            </UButton>
            <UButton
              :to="tool.url"
              target="_blank"
              icon="i-lucide-external-link"
              color="primary"
              >访问官网</UButton
            >
          </div>
        </template>
      </UPageHeader>

      <UPageSection>
        <div class="flex flex-col gap-8 md:flex-row">
          <div class="w-full md:w-1/3 lg:w-1/4">
            <img
              :src="tool.image_url || 'https://via.placeholder.com/300x200'"
              :alt="tool.name"
              class="h-auto w-full rounded-lg object-cover shadow-md"
            />

            <div class="mt-6 space-y-4">
              <div
                class="flex items-center justify-between border-b pb-2 dark:border-gray-700"
              >
                <span class="text-sm text-gray-500">定价模式</span>
                <UBadge
                  :color="tool.pricing_model === 'free' ? 'success' : 'warning'"
                  variant="subtle"
                >
                  {{
                    tool.pricing_model === "free"
                      ? "免费"
                      : tool.pricing_model === "freemium"
                      ? "免费试用"
                      : "付费"
                  }}
                </UBadge>
              </div>
              <div
                class="flex items-center justify-between border-b pb-2 dark:border-gray-700"
              >
                <span class="text-sm text-gray-500">综合评分</span>
                <div class="flex items-center gap-1 text-yellow-500">
                  <UIcon name="i-heroicons-star-solid" />
                  <span class="font-bold">{{ tool.rating }}</span>
                  <span class="text-xs text-gray-400"
                    >({{ tool.review_count }} 人评)</span
                  >
                </div>
              </div>
              <div
                class="flex items-center justify-between border-b pb-2 dark:border-gray-700"
              >
                <span class="text-sm text-gray-500">发布时间</span>
                <span class="text-sm">{{
                  new Date(tool.created_at).toLocaleDateString()
                }}</span>
              </div>
            </div>
          </div>

          <div class="flex-1">
            <h3 class="mb-4 text-lg font-semibold">工具介绍</h3>
            <div class="prose dark:prose-invert max-w-none">
              <MarkdownView :source="tool.description" />
            </div>

            <div class="mt-8">
              <h3 class="mb-4 text-lg font-semibold">标签</h3>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="tag in tool.tags || []"
                  :key="tag"
                  :label="tag"
                  variant="soft"
                  color="neutral"
                />
              </div>
            </div>
          </div>
        </div>
      </UPageSection>

      <UPageSection title="相关工具" description="同分类下的其他工具">
        <div class="grid gap-6 md:grid-cols-3">
          <UCard v-for="t in related" :key="t.id" class="flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <NuxtLink
                  :to="`/tools/${t.slug}`"
                  class="font-semibold hover:text-primary-500 hover:underline"
                >
                  {{ t.name }}
                </NuxtLink>
              </div>
            </template>
            <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
              {{ t.description }}
            </p>
            <template #footer>
              <UButton
                :to="`/tools/${t.slug}`"
                block
                variant="ghost"
                color="neutral"
              >
                查看详情
              </UButton>
            </template>
          </UCard>
        </div>
      </UPageSection>
    </template>
    <div v-else class="py-12 text-center text-red-500">工具未找到</div>
  </UContainer>
</template>

<script lang="ts" setup>
import type { Tool, Category } from "~/types"
import { useToolsStore } from "~/stores/tools"
import { useUserStore } from "~/stores/user"

const route = useRoute()
const toolsStore = useToolsStore()
const userStore = useUserStore()
const slug = computed(() => route.params.slug as string)

const tool = ref<Tool | undefined>(undefined)
const related = ref<Tool[]>([])
const loading = ref(false)

// Initialize user store
if (import.meta.client) {
  userStore.init()
}

const isFavorite = computed(() =>
  tool.value ? userStore.isFavorite(tool.value.id) : false
)

function toggleFavorite() {
  if (tool.value) {
    userStore.toggleFavorite(tool.value.id)
  }
}

async function loadData() {
  loading.value = true
  try {
    tool.value = await toolsStore.getToolBySlug(slug.value)

    if (tool.value) {
      // Load related tools
      if (toolsStore.tools.length === 0) {
        await toolsStore.fetchTools()
      }
      related.value = toolsStore.tools
        .filter(
          (t) =>
            t.category_id === tool.value?.category_id && t.id !== tool.value?.id
        )
        .slice(0, 3)
    }
  } finally {
    loading.value = false
  }
}

watch(slug, loadData, { immediate: true })

useSeoMeta({
  title: () => tool.value?.name || "工具详情",
  description: () => tool.value?.description || "工具详情页",
})
</script>

<style scoped></style>
