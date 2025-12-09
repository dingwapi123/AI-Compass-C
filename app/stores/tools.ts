import { defineStore } from 'pinia'
import type { Tool, Category } from '~/types'

export const useToolsStore = defineStore('tools', () => {
  const tools = ref<Tool[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

  // 使用 Service 层
  const toolService = useToolService()
  const categoryService = useCategoryService()

  /**
   * 函数: fetchCategories
   * 作用: 从 Supabase 加载分类
   */
  async function fetchCategories() {
    try {
      loading.value = true
      const data = await categoryService.fetchCategories()
      categories.value = data
    } catch (e) {
      console.error('Failed to fetch categories:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 函数: fetchTools
   * 作用: 从 Supabase 加载工具
   */
  async function fetchTools(params?: Record<string, unknown>) {
    try {
      loading.value = true
      const data = await toolService.fetchTools(params)
      tools.value = data
      return data
    } catch (e) {
      console.error('Failed to fetch tools:', e)
      return []
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
      return await toolService.fetchToolBySlug(slug)
    } catch {
      return undefined
    }
  }

  /**
   * 搜索工具
   */
  async function searchTools(query: string) {
    try {
      loading.value = true
      const data = await toolService.searchTools(query)
      return data
    } catch (e) {
      console.error('Search failed:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    tools,
    categories,
    loading,
    fetchCategories,
    fetchTools,
    getToolBySlug,
    searchTools,
  }
})
