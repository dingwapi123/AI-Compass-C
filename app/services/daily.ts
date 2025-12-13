export interface DailyNewsItem {
  id: string
  content: string
  date: string
  image: string
}

/**
 * 获取 AI 日报
 * @param date - 可选日期
 * @returns Promise<DailyNewsItem[]>
 */
export const fetchDailyNews = async (date?: Date): Promise<DailyNewsItem[]> => {
  let dateParam = ''
  if (date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    dateParam = `${year}-${month}-${day}`
  }

  try {
    const response = await $fetch<{ items: DailyNewsItem[] }>('/api/daily', {
      query: dateParam ? { date: dateParam } : undefined,
    })
    return response.items || []
  } catch (error) {
    console.error('Failed to fetch daily news:', error)
    throw error
  }
}
