import { defineStore } from 'pinia'
import type { Tool, Category } from '~/types'
import {
  fetchCategories,
  fetchAllTools,
  fetchToolsByCategory,
  fetchTools,
  fetchToolBySlug,
  fetchRandomToolsByCategory,
  updateTool,
  createTool,
} from '~/services/tools'

export const useToolsStore = defineStore('tools', () => {
  const categories = ref<Category[]>([])
  const tools = ref<Tool[]>([])
  const currentTool = ref<Tool | null>(null)
  const relatedTools = ref<Tool[]>([])
  const totalTools = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取并存储所有分类
   */
  const fetchCategoriesAction = async () => {
    // 如果已经有数据，不再请求
    if (categories.value.length > 0) return

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
  const searchToolsAction = async (
    params: {
      page?: number
      pageSize?: number
      search?: string
      categoryIds?: string[]
      pricing?: string[]
    } = {}
  ) => {
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
    // 如果已经有大量数据（简单判定），可能不需要重新获取所有
    // 但为了保证数据新鲜度，这里还是获取，或者可以加个 force 参数
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

  /**
   * 获取单个工具详情
   */
  const fetchToolAction = async (slug: string) => {
    loading.value = true
    error.value = null
    try {
      // 1. 先尝试从现有的 tools 列表中查找
      const existingTool = tools.value.find((t) => t.slug === slug)
      if (existingTool) {
        currentTool.value = existingTool
      } else {
        // 2. 如果没找到，则请求 API
        const data = await fetchToolBySlug(slug)
        currentTool.value = data
      }
    } catch (e) {
      console.error(`Store: Error fetching tool ${slug}`, e)
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取相关工具（随机）
   */
  const fetchRelatedToolsAction = async (categoryId: string, excludeToolId: string) => {
    try {
      // 获取该分类下随机的 4 个工具
      // 我们请求 4 个是为了应对排除当前工具后可能少一个的情况
      const data = await fetchRandomToolsByCategory(categoryId, 4)
      relatedTools.value = data.filter((t) => t.id !== excludeToolId).slice(0, 3)
    } catch (e) {
      console.error('Store: Error fetching related tools', e)
    }
  }

  /**
   * 更新工具信息
   */
  const updateToolAction = async (id: string, updates: Partial<Tool>) => {
    loading.value = true
    try {
      const updatedTool = await updateTool(id, updates)
      if (updatedTool) {
        // 更新本地状态
        const index = tools.value.findIndex((t) => t.id === id)
        if (index !== -1) {
          tools.value[index] = updatedTool
        }
        if (currentTool.value?.id === id) {
          currentTool.value = updatedTool
        }
      }
      return updatedTool
    } catch (e) {
      console.error(`Store: Error updating tool ${id}`, e)
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建新工具
   */
  const createToolAction = async (tool: Partial<Tool>) => {
    loading.value = true
    try {
      const newTool = await createTool(tool)
      if (newTool) {
        // 更新本地状态
        tools.value.unshift(newTool)
        totalTools.value++
      }
      return newTool
    } catch (e) {
      console.error('Store: Error creating tool', e)
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    tools,
    currentTool,
    relatedTools,
    totalTools,
    loading,
    error,
    fetchCategories: fetchCategoriesAction,
    fetchTools: fetchToolsAction,
    searchTools: searchToolsAction,
    fetchToolsByCategory: fetchToolsByCategoryAction,
    fetchTool: fetchToolAction,
    fetchRelatedTools: fetchRelatedToolsAction,
    updateTool: updateToolAction,
    createTool: createToolAction,
  }
})
