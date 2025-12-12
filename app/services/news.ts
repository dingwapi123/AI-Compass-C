import type { NewsItem } from '~/types/news'

/**
 * 获取指定日期的新闻快讯
 * @param date - 日期对象
 * @returns Promise<NewsItem[]>
 */
export const fetchNewsByDate = async (date: Date): Promise<NewsItem[]> => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateParam = `${year}-${month}-${day} 00:00:00`

  try {
    const response = await $fetch<{ items: NewsItem[] }>('/api/news', {
      query: { date: dateParam },
    })
    return response.items || []
  } catch (error) {
    console.error('Failed to fetch news:', error)
    throw error
  }
}
