<template>
  <div class="flex flex-col gap-6 p-6">
    <UContainer>
      <!-- Header -->
      <div class="mb-3 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">工具管理</h1>
        <UButton
          icon="i-heroicons-plus"
          color="neutral"
          variant="solid"
          label="新增工具"
          to="/tools/create"
        />
      </div>

      <!-- Toolbar -->
      <div class="mb-3 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <UInput
            :model-value="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="搜索工具..."
            class="w-64"
            @update:model-value="handleSearchChange"
          />
          <USelectMenu
            :model-value="selectedCategory"
            :items="categoryOptions"
            :search-input="false"
            placeholder="全部分类"
            class="w-40"
            @update:model-value="handleCategoryChange"
          />
        </div>
      </div>

      <!-- Table -->
      <UCard>
        <UTable :data="tools" :columns="columns" :loading="loading" />

        <!-- Pagination -->
        <div
          class="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800"
        >
          <div class="text-sm text-gray-500 dark:text-gray-400">共 {{ totalTools }} 条记录</div>
          <UPagination
            v-if="totalTools > 0"
            v-model:page="page"
            :total="totalTools"
            :items-per-page="pageSize"
            active-color="neutral"
            active-variant="solid"
            color="neutral"
            size="sm"
          />
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Tool } from '~/types'

const toolsStore = useToolsStore()
const { tools, totalTools, loading, categories } = storeToRefs(toolsStore)

const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

// State
const page = ref(1)
const pageSize = 10
const search = ref('')
const selectedCategory = ref<{ label: string; value: string } | null>({
  label: '全部分类',
  value: '',
})

// Helpers
const getCategoryName = (id: string) => {
  return categories.value.find((c) => c.id === id)?.name || '-'
}

const getPricingColor = (pricing: string) => {
  switch (pricing) {
    case 'free':
      return 'success'
    case 'paid':
      return 'info'
    case 'freemium':
      return 'warning'
    default:
      return 'neutral'
  }
}

// Actions
const handleDelete = async (row: Tool) => {
  if (confirm(`确定要删除 ${row.name} 吗？`)) {
    // TODO: Implement delete logic
    console.log('Delete', row.id)
  }
}

const handleSearchChange = (val: string) => {
  search.value = val
  page.value = 1
}

const handleCategoryChange = (val: { label: string; value: string } | null) => {
  selectedCategory.value = val
  page.value = 1
}

// Table Columns
const columns: TableColumn<Tool>[] = [
  {
    accessorKey: 'name',
    header: '工具名称',
    cell: ({ row }) => {
      const tool = row.original
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: tool.icon || (tool.images && tool.images[0]) || '',
          alt: tool.name,
          size: 'sm',
        }),
        h('span', { class: 'font-medium text-gray-900 dark:text-white' }, tool.name),
      ])
    },
  },
  {
    accessorKey: 'category_id',
    header: '分类',
    cell: ({ row }) => {
      const tool = row.original
      const name = getCategoryName(tool.category_id)
      return name
        ? h(UBadge, { color: 'neutral', variant: 'subtle', size: 'xs' }, () => name)
        : h('span', { class: 'text-gray-400' }, '-')
    },
  },
  {
    accessorKey: 'pricing',
    header: '价格模式',
    cell: ({ row }) => {
      const pricing = row.getValue('pricing') as string
      return h(
        UBadge,
        {
          color: getPricingColor(pricing),
          variant: 'subtle',
          size: 'xs',
          class: 'capitalize',
        },
        () => pricing
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      const tool = row.original
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UButton, {
          icon: 'i-heroicons-pencil-square',
          color: 'neutral',
          variant: 'ghost',
          size: 'xs',
          to: `/tools/${tool.slug}/edit`,
        }),
        h(UButton, {
          icon: 'i-heroicons-trash',
          color: 'error',
          variant: 'ghost',
          size: 'xs',
          onClick: () => handleDelete(tool),
        }),
      ])
    },
  },
]

// Computed Options
const categoryOptions = computed(() => {
  return [
    { label: '全部分类', value: '' },
    ...categories.value.map((c) => ({
      label: c.name,
      value: c.id,
    })),
  ]
})

// Fetch Data
const fetchTools = async () => {
  await toolsStore.searchTools({
    page: page.value,
    pageSize: pageSize,
    search: search.value,
    categoryIds:
      selectedCategory.value && selectedCategory.value.value
        ? [selectedCategory.value.value]
        : undefined,
  })
}

// Initial Load
await toolsStore.fetchCategories()
await fetchTools()

// Watchers
watch(
  [page, search, selectedCategory],
  () => {
    fetchTools()
  },
  { deep: true }
)
</script>
