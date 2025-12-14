import { CozeAPI } from '@coze/api'

// 定义 Coze 返回的数据结构
interface CozeDailyResponse {
  outputList: string
  report_date: string
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

    const content = parsedData.outputList || ''
    const reportDateStr = parsedData.report_date || ''

    // 解析日期
    // 格式: "2025-12-14 17:02:23 +0800 CST"
    const parts = reportDateStr.split(' ')
    const dateStr = parts[0] || dateParam

    // 构造返回数据
    // 日报通常每天只有一条，我们将内容作为一条记录返回
    const dailyItem = {
      id: String(Date.now()), // 生成一个临时 ID
      content: content,
      date: dateStr,
      // 日报可能没有封面图，或者可以从内容中解析第一张图（可选优化）
      image: '',
    }

    return {
      items: [dailyItem],
    }
  } catch (error: unknown) {
    console.error('Coze API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch daily news'

    // 如果是开发环境，可以考虑返回 Mock 数据作为降级（可选）
    // 但为了确保用户知道是 API 失败，这里抛出错误
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  }
})
