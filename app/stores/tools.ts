import { defineStore } from 'pinia'
import type { Tool, Category } from '~/types'

export const useToolsStore = defineStore('tools', () => {
  const tools = ref<Tool[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

  /**
   * 函数: fetchCategories
   * 作用: 从 Supabase 加载分类；可通过 options.noMock 禁止回退到 mock 数据
   */
  async function fetchCategories(options?: { noMock?: boolean }) {
    try {
      loading.value = true
      const { get } = useSupabaseRest()
      const data = await get<Category[]>('categories', {
        select: 'id,name,slug,icon,description,created_at',
      })
      categories.value = data && data.length ? data : []
    } catch (e) {
      console.error('Failed to fetch categories, using mock:', e)
      categories.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 函数: fetchTools
   * 作用: 从 Supabase 加载工具；可通过 options.noMock 禁止回退到 mock 数据
   */
  async function fetchTools(params?: Record<string, unknown>, options?: { noMock?: boolean }) {
    try {
      loading.value = true
      const { get } = useSupabaseRest()
      // Simply fetching all for demo, in production should use pagination
      const data = await get<Tool[]>('tools', {
        select:
          'id,name,slug,description,url,icon,images,tags,pricing,category_id,created_at,updated_at',
        ...params,
      })
      tools.value = data && data.length ? data : []
    } catch (e) {
      console.error('Failed to fetch tools, using mock:', e)
      tools.value = []
    } finally {
      loading.value = false
    }
  }

  async function getToolBySlug(slug: string) {
    // First check store
    const existing = tools.value.find((t) => t.slug === slug)
    if (existing) return existing

    // Then fetch
    try {
      const { get } = useSupabaseRest()
      const data = await get<Tool[]>('tools', { slug: `eq.${slug}` })
      return data?.[0]
    } catch (e) {
      return undefined
    }
  }

  return {
    tools,
    categories,
    loading,
    fetchCategories,
    fetchTools,
    getToolBySlug,
  }
})
