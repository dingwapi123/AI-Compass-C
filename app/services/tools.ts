import type { Tool, Category } from '~/types'
import { useSupabaseClient } from '~/composables/useSupabase'

/**
 * 从 Supabase 随机获取工具列表
 * @param count - 需要获取的工具数量，默认为 4
 * @returns Promise<Tool[]> - 返回随机的工具列表
 */
export const fetchRandomTools = async (count: number = 4): Promise<Tool[]> => {
  const supabase = useSupabaseClient()

  // 这里我们获取最新的 20 条数据，然后在前端进行随机打乱取前 count 条
  // 这样可以避免复杂的 SQL 随机查询，对于小数据量场景足够高效
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .limit(20)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching random tools:', error)
    return []
  }

  if (!data) return []

  // 随机打乱数组
  const shuffled = data.sort(() => 0.5 - Math.random())

  // 返回前 count 条
  return shuffled.slice(0, count) as Tool[]
}

/**
 * 获取所有分类
 * @returns Promise<Category[]> - 返回分类列表
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const supabase = useSupabaseClient()
  const { data, error } = await supabase.from('categories').select('*').order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

/**
 * 根据分类 ID 获取工具列表
 * @param categoryId - 分类 ID
 * @param limit - 获取数量限制，可选
 * @returns Promise<Tool[]> - 返回该分类下的工具列表
 */
export const fetchToolsByCategory = async (categoryId: string, limit?: number): Promise<Tool[]> => {
  const supabase = useSupabaseClient()
  let query = supabase
    .from('tools')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error(`Error fetching tools for category ${categoryId}:`, error)
    return []
  }

  return data as Tool[]
}

/**
 * 获取所有工具
 * @returns Promise<Tool[]> - 返回所有工具列表
 */
export const fetchAllTools = async (): Promise<Tool[]> => {
  const supabase = useSupabaseClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all tools:', error)
    return []
  }

  return data as Tool[]
}
