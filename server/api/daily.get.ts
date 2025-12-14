import { CozeAPI } from '@coze/api'

// 定义 Coze 返回的数据结构 (基于 Coze 表结构)
interface CozeDailyNewsItem {
  id: number
  content: string
  report_date: string
  images_url: string
  // 其他字段如 sys_platform, uuid, bstudio_create_time 可能存在但前端暂不需要
}

interface CozeResponseData {
  outputList: CozeDailyNewsItem[]
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  // 模拟数据模式：如果开启，将返回 Mock 数据
  const USE_MOCK = true

  if (USE_MOCK) {
    const mockData: CozeDailyNewsItem[] = [
      {
        id: 1,
        report_date: '2025-12-13 00:00:00',
        images_url:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
        content: `
## 🤖 AI 技术前沿

### 1. Google 发布 Gemini 3
Google 今日正式发布了下一代多模态模型 **Gemini 3**。新模型在推理能力、多模态理解和长上下文处理方面取得了重大突破。

- **性能提升**：相比 Gemini 2.0，推理速度提升 2 倍，错误率降低 40%。
- **超长上下文**：支持高达 10M token 的上下文窗口。
- **原生多模态**：支持文本、图像、音频、视频的任意组合输入输出。

### 2. OpenAI Sora 2.0 预览
OpenAI 展示了 **Sora 2.0** 的生成效果。新版本生成的视频时长可达 2 分钟，且支持更复杂的物理模拟和角色一致性保持。

\`\`\` js [file.js]
// 示例：使用 JavaScript SDK 调用 Sora 2.0 (伪代码)
import openai

client = openai.Client()
response = client.video.generate(
    model="sora-2.0",
    prompt="A cyberpunk city with neon lights, 4k resolution, cinematic lighting",
    duration=120
)
console.log(response.video_url)
\`\`\`

\`\`\`vue
<script setup lang="ts">
const message = ref('Hello World!')

function updateMessage() {
  message.value = 'Button clicked!'
}
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <UButton @click="updateMessage">
      Click me
    </UButton>
  </div>
</template>
\`\`\`
**Strong text**
*Emphasized text*
[Nuxt documentation](https://nuxt.com)
> Nuxt UI automatically adapts to your theme settings, ensuring consistent typography across your entire application.
 ---
 Regular markdown with **bold** and *italic* text.

::callout{icon="i-lucide-rocket" color="primary"}
Use MDC components for rich interactions!
::

::tabs

:::tabs-item{label="Installation"}
Use pnpm add @nuxt/ui to install
:::

:::tabs-item{label="Usage"}
Import components and use them in your templates
:::

::

::code-group

\`\`\`bash [pnpm]
pnpm add @nuxt/ui
\`\`\`

\`\`\`bash [yarn]
yarn add @nuxt/ui
\`\`\`

\`\`\`bash [npm]
npm install @nuxt/ui
\`\`\`

\`\`\`bash [bun]
bun add @nuxt/ui
\`\`\`

::
        `,
      },
      {
        id: 2,
        report_date: '2025-12-12 00:00:00',
        images_url:
          'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
        content: `
## 🚀 行业动态

### 1. 阿里 Qwen-2.5 开源
阿里云通义千问团队发布并开源了 **Qwen-2.5** 系列模型，包括 7B、14B、72B 等多个尺寸。新模型在代码生成和数学推理能力上全面超越了 Llama 3。

### 2. 微软 Copilot 深度集成 Windows 12
微软宣布下一代操作系统 Windows 12 将在内核层面深度集成 Copilot，实现系统级的 AI 智能调度和任务自动化。

> "AI 不再是一个应用，而是操作系统的心脏。" —— Satya Nadella

| 功能 | Windows 11 | Windows 12 (AI) |
| :--- | :--- | :--- |
| 搜索 | 关键词匹配 | 语义理解 |
| 任务栏 | 静态 | 动态预测 |
| 文件管理 | 目录树 | 智能分类 |
        `,
      },
      {
        id: 3,
        report_date: '2025-12-11 00:00:00',
        images_url:
          'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=800&auto=format&fit=crop',
        content: `
## 💡 创新应用

### 1. Notion AI 2.0 发布
Notion 发布了 AI 2.0 版本，新增了“智能数据库”功能，能够根据用户描述自动构建和填充数据库内容。

### 2. Midjourney V7 alpha 测试
Midjourney V7 开启 alpha 测试，重点增强了对文字渲染的控制能力，以及更精准的光影模拟。
        `,
      },
    ]

    const newsItems = mockData.map((item) => {
      const parts = (item.report_date || '').split(' ')
      const dateStr = parts[0] || new Date().toISOString().split('T')[0]

      return {
        id: String(item.id),
        content: item.content,
        date: dateStr,
        image: item.images_url,
      }
    })

    return { items: newsItems }
  }

  // 默认使用今天
  let dateParam = ''
  if (query.date) {
    dateParam = String(query.date)
  } else {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    dateParam = `${year}-${month}-${day}`
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
    // 使用与新闻相同的 Workflow ID
    const WORKFLOW_ID = '7581112574068310016'

    // 注意：这里使用的是 daily 接口的逻辑，如果参数不同需要调整
    const res = await client.workflows.runs.create({
      workflow_id: WORKFLOW_ID,
      parameters: {
        time: dateParam + ' 00:00:00',
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
      if (typeof res.data === 'object') {
        parsedData = res.data as unknown as CozeResponseData
      } else {
        throw new Error('Invalid JSON response from Coze')
      }
    }

    const outputList = parsedData.outputList || []

    // 映射数据
    const newsItems = outputList.map((item) => {
      const parts = (item.report_date || '').split(' ')
      const dateStr = parts[0] || new Date().toISOString().split('T')[0]

      return {
        id: String(item.id),
        content: item.content,
        date: dateStr,
        image:
          item.images_url ||
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
      }
    })

    return {
      items: newsItems,
    }
  } catch (error: unknown) {
    console.error('Coze API Error (Daily):', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch daily news'
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  }
})
