import { defineStore } from 'pinia'
import type { Tool, Category } from '~/types'

export const useToolsStore = defineStore('tools', () => {
  const tools = ref<Tool[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

  // 使用 Service 层
  // 由于 Nuxt 自动导入在某些 IDE/linter 环境可能不被识别，或者还未重新索引
  // 但在运行时应该是可用的。为了消除 linter 错误，我们假设这些是全局可用的
  // 如果是实际运行错误，说明 nuxt.config.ts 修改还未生效（可能需要重启 dev server）
  // 但在这里我们先忽略 linter 错误，或者显式导入（如果它们不是自动导入的话）
  // 由于我们刚修改了 nuxt.config.ts，可能需要手动 import
  // 但由于它们是 composables (在 services 目录下)，Nuxt 会自动导入它们

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
      // 如果需要，可以在这里处理回退逻辑
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
    } catch (e) {
      console.error('Failed to fetch tools:', e)
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
      // 搜索结果是否需要更新到 tools 状态？
      // 还是直接返回？这里选择更新到 tools 状态，或者返回
      // 考虑到 search 页面可能需要单独的状态，这里先更新 tools
      tools.value = data
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
