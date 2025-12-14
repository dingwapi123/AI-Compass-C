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
  [key: string]: any
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  // 获取查询参数中的 date
  let dateParam = String(query.date || '')

  // 如果未提供，默认使用今天
  if (!dateParam) {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    dateParam = `${year}-${month}-${day}`
  }

  const startDay = `${dateParam} 00:00:00`
  const endDay = `${dateParam} 23:59:59`

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

    if (!Array.isArray(outputList)) {
      console.warn('Unexpected Coze outputList structure:', outputList)
      return { items: [] }
    }

    // 映射数据
    const items = outputList.map((item, index) => {
      const reportDateStr = item.report_date || ''

      // 解析日期
      // 格式: "2025-12-14 17:02:23 +0800 CST"
      const parts = reportDateStr.split(' ')
      const dateStr = parts[0] || dateParam

      return {
        // 使用索引作为 ID，确保列表渲染时的唯一性
        id: String(index),
        title: item.report_title || `${dateStr} AI日报`,
        content: item.content,
        date: dateStr,
        image: '',
      }
    })

    return {
      items: items,
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
