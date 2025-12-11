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
            :model-value="selectedCategory || undefined"
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
      <!-- Edit Modal -->
      <UModal
        v-model:open="isEditModalOpen"
        :dismissible="false"
        title="编辑工具"
        :ui="{
          content: 'max-w-2xl sm:max-w-2xl',
        }"
      >
        <template #content>
          <div class="p-6">
            <UForm :state="editingTool" class="space-y-6" @submit="handleUpdateTool">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <UFormField label="工具名称" name="name" required class="col-span-1 sm:col-span-2">
                  <UInput v-model="editingTool.name" size="lg" icon="i-heroicons-wrench-screwdriver" />
                </UFormField>

                <UFormField label="URL" name="url" required class="col-span-1 sm:col-span-2">
                  <UInput v-model="editingTool.url" size="lg" icon="i-heroicons-link" class="w-full"/>
                </UFormField>

                <UFormField label="分类" name="category_id" required>
                  <USelectMenu
                    :model-value="editingTool.category_id"
                    :items="categoryOptions.filter((c) => c.value !== '')"
                    :search-input="false"
                    value-key="value"
                    size="lg"
                    class="w-full"
                    icon="i-heroicons-tag"
                    @update:model-value="(val: any) => editingTool.category_id = val"
                  />
                </UFormField>

                <UFormField label="价格模式" name="pricing" required>
                  <USelectMenu
                    v-model="editingTool.pricing"
                    :items="pricingOptions"
                    :search-input="false"
                    size="lg"
                    class="w-full"
                    icon="i-heroicons-currency-dollar"
                  />
                </UFormField>

                <UFormField label="描述" name="description" required class="col-span-1 sm:col-span-2">
                  <UTextarea v-model="editingTool.description" :rows="4" size="lg" class="w-full" />  
                </UFormField>

                <UFormField label="Logo (Icon)" name="icon" class="col-span-1 sm:col-span-2">
                  <div class="flex gap-4 items-start">
                    <UAvatar
                      :src="editingTool.icon || ''"
                      :alt="editingTool.name"
                      size="xl"
                      class="flex-shrink-0"
                    />
                    <div class="flex-1 space-y-2">
                      <UInput
                        type="file"
                        accept="image/*"
                        size="lg"
                        icon="i-heroicons-photo"
                        @change="(e: Event) => handleLogoUpload(e)"
                      />
                      <p v-if="editingTool.icon" class="text-xs text-gray-500 break-all">
                        当前: {{ editingTool.icon }}
                      </p>
                    </div>
                  </div>
                </UFormField>

                <UFormField label="图片 (Images)" name="images" class="col-span-1 sm:col-span-2">
                  <div class="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                    <div v-for="(img, index) in (editingTool.images || [])" :key="index" class="flex items-center gap-3">
                      <div class="h-10 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                        <img v-if="img" :src="img" class="h-full w-full object-cover" >
                      </div>
                      <div class="flex-1 text-sm text-gray-600 dark:text-gray-400 truncate">
                        {{ img }}
                      </div>
                      <UButton
                        icon="i-heroicons-trash"
                        color="error"
                        variant="ghost"
                        size="sm"
                        @click="removeImage(index)"
                      />
                    </div>
                    
                    <div class="flex items-center gap-2">
                      <UInput
                        type="file"
                        accept="image/*"
                        size="md"
                        icon="i-heroicons-plus"
                        class="flex-1"
                        @change="(e: Event) => handleImageUpload(e)"
                      />
                      <span v-if="uploadInProgress" class="text-xs text-neutral-500">上传中...</span>
                    </div>
                  </div>
                </UFormField>
              </div>

              <div class="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                <UButton label="取消" color="neutral" variant="soft" size="lg" @click="isEditModalOpen = false" />
                <UButton type="submit" label="保存更改" color="neutral" variant="solid" size="lg" :loading="updating" icon="i-heroicons-check" />
              </div>
            </UForm>
          </div>
        </template>
      </UModal>
    </ucard></UContainer>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Tool } from '~/types'
import { useSupabaseUpload } from '~/composables/useSupabaseUpload'

const toolsStore = useToolsStore()
const { tools, totalTools, loading, categories } = storeToRefs(toolsStore)
const { uploadFile, uploading: uploadInProgress } = useSupabaseUpload()

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

// Edit State
const isEditModalOpen = ref(false)
const updating = ref(false)
const editingTool = reactive<Partial<Tool>>({
  id: '',
  name: '',
  description: '',
  url: '',
  icon: '',
  images: [],
  category_id: '',
  pricing: 'free',
})

const pricingOptions = ['free', 'paid', 'freemium']

// Upload Handlers
const handleLogoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (file) {
    try {
      const url = await uploadFile(file, 'tools', 'logos/')
      editingTool.icon = url
    } catch (error) {
      console.error('Logo upload failed:', error)
      alert('Logo上传失败，请重试')
    } finally {
      input.value = '' // Reset input
    }
  }
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (file) {
    try {
      const url = await uploadFile(file, 'tools', 'images/')
      if (!editingTool.images) editingTool.images = []
      editingTool.images.push(url)
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('图片上传失败，请重试')
    } finally {
      input.value = '' // Reset input
    }
  }
}

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
const handleEdit = (row: Tool) => {
  Object.assign(editingTool, JSON.parse(JSON.stringify(row)))
  if (!editingTool.images) editingTool.images = []
  isEditModalOpen.value = true
}

const handleUpdateTool = async () => {
  updating.value = true
  try {
    // TODO: Implement update logic in store
    console.log('Update tool:', editingTool)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    isEditModalOpen.value = false
    // Refresh list if needed
    // await fetchTools() 
  } catch (error) {
    console.error('Failed to update tool:', error)
  } finally {
    updating.value = false
  }
}

const removeImage = (index: number) => {
  if (editingTool.images) {
    editingTool.images.splice(index, 1)
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
          onClick: () => handleEdit(tool),
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
