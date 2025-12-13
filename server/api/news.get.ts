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

  // 获取查询参数中的 startTime 和 endTime
  let startTime = String(query.startTime || '')
  let endTime = String(query.endTime || '')

  // 如果未提供，默认使用今天的时间范围
  if (!startTime || !endTime) {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    startTime = `${year}-${month}-${day} 00:00:00`
    endTime = `${year}-${month}-${day} 23:59:59`
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
        startTime: startTime,
        endTime: endTime,
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
      // 格式: "2025-12-12 15:57:00 +0800 CST"
      // 简单粗暴：直接按空格分割取前两段
      const parts = (item.news_date || '').split(' ')
      const dateStr = parts[0] || new Date().toISOString().split('T')[0]
      const timeStr = parts[1] ? parts[1].slice(0, 5) : '00:00'

      return {
        id: String(item.id || item.uuid),
        title: item.title,
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
