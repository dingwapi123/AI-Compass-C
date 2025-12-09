import type { Category } from '~/types'

/**
 * 分类服务
 * 处理所有与分类相关的 API 请求
 */
export const useCategoryService = () => {
  const client = useSupabaseClient()

  /**
   * 获取所有分类
   */
  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const { data, error } = await client
        .from('categories')
        .select('id,name,slug,icon,description,created_at')
        .order('name', { ascending: true })

      if (error) throw error
      return (data as Category[]) || []
    } catch (e) {
      console.error('Failed to fetch categories:', e)
      return []
    }
  }

  /**
   * 根据 Slug 获取单个分类
   */
  const fetchCategoryBySlug = async (slug: string): Promise<Category | null> => {
    try {
      const { data, error } = await client
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data as Category
    } catch (e) {
      console.error(`Failed to fetch category with slug ${slug}:`, e)
      return null
    }
  }

  return {
    fetchCategories,
    fetchCategoryBySlug
  }
}
