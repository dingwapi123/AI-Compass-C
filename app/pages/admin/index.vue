<template>
  <div>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-primary-100 p-3 dark:bg-primary-900/30">
            <UIcon
              name="i-heroicons-wrench-screwdriver"
              class="h-6 w-6 text-primary-500"
            />
          </div>
          <div>
            <p class="text-sm text-gray-500">总工具数</p>
            <p class="text-2xl font-bold">{{ stats.totalTools }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
            <UIcon
              name="i-heroicons-check-circle"
              class="h-6 w-6 text-green-500"
            />
          </div>
          <div>
            <p class="text-sm text-gray-500">已发布</p>
            <p class="text-2xl font-bold">{{ stats.publishedTools }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
            <UIcon name="i-heroicons-star" class="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p class="text-sm text-gray-500">总评价数</p>
            <p class="text-2xl font-bold">{{ stats.totalReviews }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
            <UIcon name="i-heroicons-users" class="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p class="text-sm text-gray-500">注册用户</p>
            <p class="text-2xl font-bold">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <div class="mt-8">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">最近添加</h2>
        <UButton to="/admin/tools" variant="ghost" color="primary"
          >查看全部</UButton
        >
      </div>
      <UCard>
        <UTable :rows="recentTools" :columns="columns">
          <template #name-data="{ row }">
            <div class="flex items-center gap-2">
              <UAvatar
                :src="(row as any).image_url"
                :alt="(row as any).name"
                size="xs"
              />
              <span class="font-medium">{{ (row as any).name }}</span>
            </div>
          </template>
          <template #status-data="{ row }">
            <UBadge color="success" variant="subtle" size="xs"
              >Published</UBadge
            >
          </template>
          <template #created_at-data="{ row }">
            {{ new Date((row as any).created_at).toLocaleDateString() }}
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Tool } from "~/types"
import { useToolsStore } from "~/stores/tools"

definePageMeta({
  layout: "admin",
  title: "仪表盘",
})

const toolsStore = useToolsStore()

// Ensure data is loaded
if (import.meta.client && toolsStore.tools.length === 0) {
  toolsStore.fetchTools()
}

const stats = computed(() => ({
  totalTools: toolsStore.tools.length,
  publishedTools: toolsStore.tools.length, // Mock status
  totalReviews: toolsStore.tools.reduce(
    (acc, t) => acc + (t.review_count || 0),
    0
  ),
  totalUsers: 128, // Mock
}))

const recentTools = computed<Tool[]>(() => toolsStore.tools.slice(0, 5))

const columns: any[] = [
  { key: "name", label: "名称" },
  { key: "category_id", label: "分类ID" },
  { key: "status", label: "状态" },
  { key: "created_at", label: "创建时间" },
]
</script>
