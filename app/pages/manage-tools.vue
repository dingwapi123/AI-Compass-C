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
        title="编辑工具"
        description="修改工具基础信息与资源"
        :dismissible="true"
        :close="{ variant: 'ghost', color: 'neutral' }"
        class="w-[1100px] max-w-[90vw] h-[85vh]"
      >
        <template #body>
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
                  <div class="flex gap-4 items-start rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                    <UAvatar
                      :src="logoPreview"
                      :alt="editingTool.name"
                      size="xl"
                      class="flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                    <div class="flex-1 space-y-2">
                      <UInput
                        type="file"
                        accept="image/*"
                        size="lg"
                        icon="i-heroicons-photo"
                        @change="(e: Event) => handleLogoSelect(e)"
                      />
                      <p v-if="editingTool.icon || logoFile" class="text-xs text-gray-500 break-all">
                        当前: {{ logoFile ? '本地预览（保存后上传）' : editingTool.icon }}
                      </p>
                    </div>
                  </div>
                </UFormField>

                <UFormField label="图片 (Images)" name="images" class="col-span-1 sm:col-span-2">
                  <div class="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
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
                        multiple
                        size="md"
                        icon="i-heroicons-plus"
                        class="flex-1"
                        @change="(e: Event) => handleImageSelect(e)"
                      />
                      <span v-if="updating" class="text-xs text-neutral-500">处理中...</span>
                    </div>
                  </div>
                </UFormField>
              </div>
            </UForm>
          </div>
        </template>
        <template #footer>
          <div class="flex items-center justify-end gap-3 p-4 w-full">
            <UButton label="取消" color="neutral" variant="soft" size="lg" @click="isEditModalOpen = false" />
            <UButton type="submit" label="保存更改" color="neutral" variant="solid" size="lg" :loading="updating" @click="handleUpdateTool" />
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
const { uploadFile } = useSupabaseUpload()
const toast = useToast()

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
// 待上传文件暂存
const logoFile = ref<File | null>(null)
const imageFiles = ref<File[]>([])
const logoPreview = computed(() => (logoFile.value ? URL.createObjectURL(logoFile.value) : (editingTool.icon || '')))

/**
 * 选择 Logo 文件（仅缓存，不立即上传）
 */
const handleLogoSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  logoFile.value = file
}

/**
 * 选择展示图片文件（支持多次选择，累计缓存）
 */
const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return
  for (let i = 0; i < files.length; i++) {
    imageFiles.value.push(files.item(i) as File)
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
    if (!editingTool.id) {
      throw new Error('Tool ID is missing')
    }

    // 1) 上传文件（如有选择）并组装最终字段
    const updates = JSON.parse(JSON.stringify(editingTool))
    delete updates.id // ID 不可更新

    // 上传 Logo 至 tools/logos，并将返回 URL 写入 icon
    if (logoFile.value) {
      const logoUrl = await uploadFile(logoFile.value, 'tools', 'logos/')
      updates.icon = logoUrl
      editingTool.icon = logoUrl
    }

    // 上传所有待新增图片至 tools/images，并追加到 images
    if (!updates.images) updates.images = []
    if (imageFiles.value.length > 0) {
      const uploadedUrls: string[] = []
      for (const file of imageFiles.value) {
        const url = await uploadFile(file, 'tools', 'images/')
        uploadedUrls.push(url)
      }
      updates.images = [...(updates.images as string[]), ...uploadedUrls]
      editingTool.images = updates.images
      imageFiles.value = []
    }

    // 更新时间戳
    updates.updated_at = new Date().toISOString()

    // 调用 Store 更新数据
    await toolsStore.updateTool(editingTool.id, updates)
    
    toast.add({
      title: '更新成功',
      description: `${editingTool.name} 的信息已更新。`,
      icon: 'i-heroicons-check-circle',
      color: 'success',
    })
    isEditModalOpen.value = false
    
    // 可选：重新获取列表以确保数据一致性
    // await fetchTools() 
  } catch (error) {
    console.error('Failed to update tool:', error)
    toast.add({
      title: '更新失败',
      description: error instanceof Error ? error.message : '请稍后重试',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    })
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
