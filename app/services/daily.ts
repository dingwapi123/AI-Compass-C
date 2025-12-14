import type { DailyNewsItem } from '~/types/daily'

/**
 * 获取 AI 日报
 * @param params - 查询参数 (page, pageSize, date)
 * @returns Promise<{ items: DailyNewsItem[], total: number }>
 */
export const fetchDailyNews = async (params: { page?: number; pageSize?: number; date?: string } = {}): Promise<{ items: DailyNewsItem[], total: number }> => {
  try {
    const response = await $fetch<{ items: DailyNewsItem[], total: number }>('/api/daily', {
      query: params,
    })
    return {
      items: response.items || [],
      total: response.total || 0
    }
  } catch (error) {
    console.error('Failed to fetch daily news:', error)
    throw error
  }
}
