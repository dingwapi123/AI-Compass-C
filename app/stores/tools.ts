import { defineStore } from 'pinia'
import type { Tool, Category } from '~/types'
import { fetchCategories, fetchAllTools, fetchToolsByCategory, fetchTools } from '~/services/tools'

export const useToolsStore = defineStore('tools', () => {
  const categories = ref<Category[]>([])
  const tools = ref<Tool[]>([])
  const totalTools = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取并存储所有分类
   */
  const fetchCategoriesAction = async () => {
    // 如果已经有数据，可以选择不再请求，或者强制刷新
    // 这里简单起见，每次都请求
    loading.value = true
    try {
      const data = await fetchCategories()
      categories.value = data
    } catch (e) {
      console.error('Store: Error fetching categories', e)
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索工具（支持分页和筛选）
   */
  const searchToolsAction = async (params: {
    page?: number
    pageSize?: number
    search?: string
    categoryIds?: string[]
    pricing?: string[]
  } = {}) => {
    loading.value = true
    try {
      const { data, count } = await fetchTools(params)
      tools.value = data
      totalTools.value = count
    } catch (e) {
      console.error('Store: Error searching tools', e)
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取所有工具 (兼容旧 API)
   */
  const fetchToolsAction = async () => {
    loading.value = true
    try {
      const data = await fetchAllTools()
      tools.value = data
      totalTools.value = data.length // 近似值
    } catch (e) {
      console.error('Store: Error fetching tools', e)
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据分类获取工具（更新 tools 状态）
   * 注意：这会覆盖当前的 tools 列表
   */
  const fetchToolsByCategoryAction = async (categoryId: string) => {
    loading.value = true
    try {
      const data = await fetchToolsByCategory(categoryId)
      tools.value = data
      totalTools.value = data.length
    } catch (e) {
      console.error(`Store: Error fetching tools for category ${categoryId}`, e)
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    tools,
    totalTools,
    loading,
    error,
    fetchCategories: fetchCategoriesAction,
    fetchTools: fetchToolsAction,
    searchTools: searchToolsAction,
    fetchToolsByCategory: fetchToolsByCategoryAction,
  }
})
