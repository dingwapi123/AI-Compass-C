import { CozeAPI } from '@coze/api'

// 定义 Coze 返回的数据结构
interface CozeNewsItem {
  id: number | string
  uuid?: string
  title: string
  content: string
  source: string
  news_date: string
  tags: string | string[] // 可能是 JSON 字符串或数组
  url: string
  bstudio_create_time?: string
}

interface CozeResponseData {
  outputList: CozeNewsItem[]
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  // 默认使用今天 00:00:00，或者用户指定的日期
  let dateParam = ''
  if (query.date) {
    dateParam = String(query.date)
  } else {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    dateParam = `${year}-${month}-${day} 00:00:00`
  }

  // 检查 Token
  if (!config.cozeApiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: NUXT_COZE_API_TOKEN is missing',
    })
  }

  const client = new CozeAPI({
    token: config.cozeApiToken,
    baseURL: config.cozeApiBaseUrl,
  })

  try {
    const res = await client.workflows.runs.create({
      // 每日新闻获取工作流 ID
      workflow_id: '7581112574068310016',
      parameters: {
        time: dateParam,
      },
    })

    if (!res.data) {
      return { items: [] }
    }

    // Coze 返回的 data 是 JSON 字符串
    let parsedData: CozeResponseData
    try {
      parsedData = JSON.parse(res.data)
    } catch {
      throw new Error('Invalid JSON response from Coze')
    }

    const outputList = parsedData.outputList || []

    // 映射数据
    const newsItems = outputList.map((item) => {
      // 解析 tags
      let tags: string[] = []
      try {
        if (typeof item.tags === 'string') {
          tags = JSON.parse(item.tags)
        } else if (Array.isArray(item.tags)) {
          tags = item.tags
        }
      } catch {
        tags = []
      }

      // 解析日期
      let dateStr = ''
      let timeStr = ''

      try {
        const dateObj = new Date(item.news_date)
        if (!isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear()
          const month = String(dateObj.getMonth() + 1).padStart(2, '0')
          const day = String(dateObj.getDate()).padStart(2, '0')
          const hours = String(dateObj.getHours()).padStart(2, '0')
          const minutes = String(dateObj.getMinutes()).padStart(2, '0')

          dateStr = `${year}-${month}-${day}`
          timeStr = `${hours}:${minutes}`
        } else {
          // Fallback
          const now = new Date()
          dateStr = now.toISOString().split('T')[0]
          timeStr = '00:00'
        }
      } catch {
        // Ignore date parse errors
        const now = new Date()
        dateStr = now.toISOString().split('T')[0]
        timeStr = '00:00'
      }

      return {
        id: String(item.id || item.uuid),
        title: item.title,
        summary: item.content,
        content: item.content,
        source: item.source || 'AI 快讯',
        time: timeStr,
        date: dateStr,
        link: item.url,
        tags: tags,
      }
    })

    // 排序
    newsItems.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date)
      return b.time.localeCompare(a.time)
    })

    return {
      items: newsItems,
    }
  } catch (error: unknown) {
    console.error('Coze API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch news'
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  }
})
