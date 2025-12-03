<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">工具管理</h2>
      <UButton to="/admin/tools/new" icon="i-heroicons-plus" color="primary">新增工具</UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex gap-4">
          <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="搜索工具..." />
        </div>
      </template>
      
      <UTable :rows="filteredTools" :columns="columns">
        <template #name-data="{ row }">
           <div class="flex items-center gap-2">
             <UAvatar :src="(row as any).image_url" :alt="(row as any).name" size="xs" />
             <NuxtLink :to="`/admin/tools/${(row as any).id}`" class="font-medium hover:underline text-primary-500">
               {{ (row as any).name }}
             </NuxtLink>
           </div>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton :to="`/admin/tools/${(row as any).id}`" size="xs" variant="ghost" icon="i-heroicons-pencil-square" />
            <UButton size="xs" variant="ghost" color="error" icon="i-heroicons-trash" @click="deleteTool((row as any).id)" />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { Tool } from '~/types'
import { useToolsStore } from '~/stores/tools'

definePageMeta({
  layout: 'admin',
  title: '工具管理'
})

const toolsStore = useToolsStore()
const search = ref('')

if (import.meta.client && toolsStore.tools.length === 0) {
  toolsStore.fetchTools()
}

const filteredTools = computed<Tool[]>(() => {
  if (!search.value) return toolsStore.tools
  const kw = search.value.toLowerCase()
  return toolsStore.tools.filter(t => t.name.toLowerCase().includes(kw))
})

const columns: any[] = [
  { key: 'name', label: '名称' },
  { key: 'slug', label: 'Slug' },
  { key: 'category_id', label: '分类' },
  { key: 'rating', label: '评分' },
  { key: 'actions', label: '操作' }
]

function deleteTool(id: string) {
  if (confirm('确认删除该工具吗？')) {
    // TODO: Call API
    // For now, just modify local store
    const index = toolsStore.tools.findIndex(t => t.id === id)
    if (index !== -1) {
      toolsStore.tools.splice(index, 1)
    }
  }
}
</script>