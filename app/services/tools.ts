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
 * 获取工具列表（支持分页和搜索）
 * @param params 查询参数
 * @returns Promise<{ data: Tool[], count: number }> - 返回工具列表和总数
 */
export const fetchTools = async (
  params: {
    page?: number
    pageSize?: number
    search?: string
    categoryIds?: string[]
    pricing?: string[]
  } = {}
): Promise<{ data: Tool[]; count: number }> => {
  const supabase = useSupabaseClient()
  const { page = 1, pageSize = 12, search, categoryIds, pricing } = params

  // 1. 构建基础查询
  let query = supabase.from('tools').select('*', { count: 'exact' }) // 请求总数

  // 2. 应用过滤条件
  if (search) {
    // 简单的模糊搜索，匹配名称或描述
    // 注意：Supabase 的 ilike 语法是 'column.ilike.%value%'
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (categoryIds && categoryIds.length > 0) {
    query = query.in('category_id', categoryIds)
  }

  if (pricing && pricing.length > 0) {
    query = query.in('pricing', pricing)
  }

  // 3. 应用分页
  // range 是 0-based index
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.order('created_at', { ascending: false }).range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching tools:', error)
    return { data: [], count: 0 }
  }

  return { data: data as Tool[], count: count || 0 }
}

/**
 * 获取所有工具（保留原有 API 兼容性，但建议迁移到 fetchTools）
 * @returns Promise<Tool[]> - 返回所有工具列表
 */
export const fetchAllTools = async (): Promise<Tool[]> => {
  const { data } = await fetchTools({ pageSize: 1000 })
  return data
}

/**
 * 根据 Slug 获取单个工具详情
 * @param slug - 工具 Slug
 * @returns Promise<Tool | null> - 返回工具详情或 null
 */
export const fetchToolBySlug = async (slug: string): Promise<Tool | null> => {
  const supabase = useSupabaseClient()
  const { data, error } = await supabase.from('tools').select('*').eq('slug', slug).single()

  if (error) {
    console.error(`Error fetching tool with slug ${slug}:`, error)
    return null
  }

  return data as Tool
}
