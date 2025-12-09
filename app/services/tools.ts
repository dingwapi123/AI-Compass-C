import type { Tool } from '~/types'

/**
 * 工具服务
 * 处理所有与工具相关的 API 请求
 */
export const useToolService = () => {
  const client = useSupabaseClient()

  /**
   * 获取工具列表
   */
  const fetchTools = async (params: Record<string, any> = {}): Promise<Tool[]> => {
    try {
      const {
        select = 'id,name,slug,description,url,icon,images,tags,pricing,category_id,created_at,updated_at',
        order = 'created_at.desc',
        page,
        pageSize,
        limit,
        ...filters
      } = params

      let query = client.from('tools').select(select)

      // 处理过滤条件
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null) return

        // 简单处理：如果是字符串且包含 . 则尝试解析操作符，否则默认为 eq
        // 这里为了兼容性，保留一些基础逻辑，但更推荐直接传入处理好的 filters
        // 由于直接使用 supabase client，建议 params 尽量保持简单，复杂查询在 Service 内部构建
        query = query.eq(key, value)
      })

      // 处理排序
      if (order) {
        const [column, direction] = order.split('.')
        query = query.order(column, { ascending: direction === 'asc' })
      }

      // 处理分页
      if (page && pageSize) {
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)
      } else if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return (data as Tool[]) || []
    } catch (e) {
      console.error('Failed to fetch tools:', e)
      return []
    }
  }

  /**
   * 根据 Slug 获取单个工具
   */
  const fetchToolBySlug = async (slug: string): Promise<Tool | null> => {
    try {
      const { data, error } = await client.from('tools').select('*').eq('slug', slug).single()

      if (error) throw error
      return data as Tool
    } catch (e) {
      console.error(`Failed to fetch tool with slug ${slug}:`, e)
      return null
    }
  }

  /**
   * 搜索工具
   */
  const searchTools = async (query: string): Promise<Tool[]> => {
    if (!query) return []
    try {
      const { data, error } = await client
        .from('tools')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      return (data as Tool[]) || []
    } catch (e) {
      console.error('Search failed:', e)
      return []
    }
  }

  return {
    fetchTools,
    fetchToolBySlug,
    searchTools,
  }
}
