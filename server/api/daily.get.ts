import { CozeAPI } from '@coze/api'

// 定义 Coze 返回的数据项结构
interface CozeDailyItem {
  content: string
  report_date: string
  report_title: string
}

// 定义 Coze 响应结构
interface CozeDailyResponse {
  outputList: CozeDailyItem[]
  total?: number
  [key: string]: any
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  // 获取查询参数
  const page = parseInt(String(query.page || '1'), 10)
  const pageSize = parseInt(String(query.pageSize || '5'), 10)
  const specificDate = String(query.date || '')

  let startDay: string
  let endDay: string

  if (specificDate) {
    // 如果提供了具体日期，则只查询该日期
    startDay = `${specificDate} 00:00:00`
    endDay = `${specificDate} 23:59:59`
  } else {
    // 分页逻辑
    // Page 1: End = Today, Start = Today - (pageSize - 1) days
    // Page 2: End = Today - (page-1)*pageSize days, Start = End - (pageSize - 1) days

    const now = new Date()
    const endOffset = (page - 1) * pageSize
    const startOffset = endOffset + pageSize - 1

    const endDate = new Date(now)
    endDate.setDate(now.getDate() - endOffset)

    const startDate = new Date(now)
    startDate.setDate(now.getDate() - startOffset)

    // Format dates to YYYY-MM-DD
    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    startDay = `${formatDate(startDate)} 00:00:00`
    endDay = `${formatDate(endDate)} 23:59:59`
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
      // 日报生成工作流 ID
      workflow_id: '7583636153225920558',
      parameters: {
        startDay: startDay,
        endDay: endDay,
      },
    })

    if (!res.data) {
      return { items: [] }
    }

    // Coze 返回的 data 是 JSON 字符串
    let parsedData: CozeDailyResponse
    try {
      parsedData = JSON.parse(res.data)
    } catch {
      throw new Error('Invalid JSON response from Coze')
    }

    const outputList = parsedData.outputList || []
    const total = parsedData.total || 0

    if (!Array.isArray(outputList)) {
      console.warn('Unexpected Coze outputList structure:', outputList)
      return { items: [], total: 0 }
    }

    // 映射数据
    const items = outputList.map((item) => {
      const reportDateStr = item.report_date || ''

      // 解析日期
      // 格式: "2025-12-14 17:02:23 +0800 CST"
      const parts = reportDateStr.split(' ')
      const dateStr = parts[0] || new Date().toISOString().split('T')[0]

      return {
        // 使用日期作为 ID，确保 URL 友好且唯一
        id: dateStr,
        title: item.report_title || `${dateStr} AI日报`,
        content: item.content,
        date: dateStr,
        image: '',
      }
    })

    // 按日期降序排序 (以防万一)
    items.sort((a, b) => b.date.localeCompare(a.date))

    return {
      items: items,
      total: total || items.length, // 如果 Coze 没返回 total，暂用当前列表长度兜底，或者前端固定显示较大值
    }
  } catch (error: unknown) {
    console.error('Coze API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch daily news'

    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  }
})
