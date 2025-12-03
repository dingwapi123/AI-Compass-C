<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-semibold">{{ isNew ? '新增工具' : '编辑工具' }}</h2>
      <UButton to="/admin/tools" variant="ghost" icon="i-heroicons-arrow-left">返回列表</UButton>
    </div>

    <UCard>
      <form @submit.prevent="save" class="space-y-4">
        <UFormGroup label="名称" required>
          <UInput v-model="form.name" />
        </UFormGroup>
        
        <UFormGroup label="Slug (URL标识)" required>
          <UInput v-model="form.slug" />
        </UFormGroup>

        <UFormGroup label="描述" required>
          <UTextarea v-model="form.description" />
        </UFormGroup>

        <UFormGroup label="官网链接" required>
          <UInput v-model="form.url" />
        </UFormGroup>

        <UFormGroup label="封面图链接">
          <UInput v-model="form.image_url" />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
           <UFormGroup label="分类 ID" required>
             <UInput v-model="form.category_id" />
           </UFormGroup>
           <UFormGroup label="定价模式">
             <USelect v-model="form.pricing_model" :options="['free', 'freemium', 'paid']" />
           </UFormGroup>
        </div>

        <div class="flex items-center gap-2">
          <UCheckbox v-model="form.is_free" label="完全免费" />
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <UButton to="/admin/tools" variant="ghost" color="neutral">取消</UButton>
          <UButton type="submit" color="primary" :loading="loading">保存</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { Tool } from '~/types'
import { useToolsStore } from '~/stores/tools'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const toolsStore = useToolsStore()

const id = route.params.id as string
const isNew = id === 'new'
const loading = ref(false)

const form = reactive<Partial<Tool>>({
  name: '',
  slug: '',
  description: '',
  url: '',
  image_url: '',
  category_id: '',
  is_free: false,
  pricing_model: 'freemium',
  tags: [],
  rating: 0,
  review_count: 0
})

onMounted(async () => {
  if (!isNew) {
    // Ensure tools are loaded
    if (toolsStore.tools.length === 0) {
      await toolsStore.fetchTools()
    }
    const found = toolsStore.tools.find(t => t.id === id)
    if (found) {
      Object.assign(form, JSON.parse(JSON.stringify(found)))
    }
  }
})

async function save() {
  loading.value = true
  try {
    // Mock save
    await new Promise(r => setTimeout(r, 500))
    
    if (isNew) {
      const newTool = {
        ...form,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        review_count: 0,
        rating: 0
      } as Tool
      toolsStore.tools.unshift(newTool)
    } else {
      const index = toolsStore.tools.findIndex(t => t.id === id)
      if (index !== -1) {
        toolsStore.tools[index] = { ...toolsStore.tools[index], ...form } as Tool
      }
    }
    
    router.push('/admin/tools')
  } finally {
    loading.value = false
  }
}
</script>