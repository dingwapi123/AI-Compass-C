import { defineStore } from 'pinia'

export interface NewsItem {
  id: number | string
  title: string
  description?: string
  summary?: string
  content?: string
  date: string
  source?: string
  tags?: string[]
  image?: string
  url?: string
  category?: 'breaking' | 'daily' | 'article'
  created_at?: string
}

export const useNewsStore = defineStore('news', () => {
  const newsList = ref<NewsItem[]>([])
  const dailyList = ref<NewsItem[]>([])
  const loading = ref(false)

  const client = useSupabaseClient()

  /**
   * 获取快讯列表
   */
  async function fetchBreakingNews(params: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { page, pageSize, limit, ...filters } = params
      let query = client
        .from('news')
        .select('*')
        .eq('category', 'breaking')
        .order('date', { ascending: false })

      // 处理其他过滤条件
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          query = query.eq(key, value)
        }
      })

      // 处理分页
      if (typeof page === 'number' && typeof pageSize === 'number') {
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)
      } else if (typeof limit === 'number') {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error

      if (data) {
        newsList.value = data as NewsItem[]
        return data as NewsItem[]
      }
      return []
    } catch (e) {
      console.error('Fetch breaking news failed:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取 AI 日报
   */
  async function fetchDailyNews(params: Record<string, unknown> = {}) {
    loading.value = true
    try {
      const { page, pageSize, limit, ...filters } = params
      let query = client
        .from('news')
        .select('*')
        .eq('category', 'daily')
        .order('date', { ascending: false })

      // 处理其他过滤条件
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          query = query.eq(key, value)
        }
      })

      // 处理分页
      if (typeof page === 'number' && typeof pageSize === 'number') {
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)
      } else if (typeof limit === 'number') {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error

      if (data) {
        dailyList.value = data as NewsItem[]
        return data as NewsItem[]
      }
      return []
    } catch (e) {
      console.error('Fetch daily news failed:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    newsList,
    dailyList,
    loading,
    fetchBreakingNews,
    fetchDailyNews,
  }
})
