import { defineStore } from 'pinia'
import type { Tool, Category } from '~/types'

export const useToolsStore = defineStore('tools', () => {
  const tools = ref<Tool[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

  // Mock data for development if API fails or is empty
  const mockCategories: Category[] = [
    {
      id: '1',
      name: '文本写作',
      slug: 'text-writing',
      icon: 'i-heroicons-pencil',
      description: 'AI 写作助手',
    },
    {
      id: '2',
      name: '图像生成',
      slug: 'image-generation',
      icon: 'i-heroicons-photo',
      description: 'AI 绘画工具',
    },
    {
      id: '3',
      name: '代码编程',
      slug: 'coding',
      icon: 'i-heroicons-code-bracket',
      description: 'AI 编程辅助',
    },
    {
      id: '4',
      name: '音频处理',
      slug: 'audio',
      icon: 'i-heroicons-microphone',
      description: 'AI 语音合成与识别',
    },
    {
      id: '5',
      name: '视频制作',
      slug: 'video',
      icon: 'i-heroicons-video-camera',
      description: 'AI 视频生成',
    },
  ]

  const mockTools: Tool[] = [
    {
      id: '1',
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'OpenAI 开发的通用 AI 聊天机器人，支持多种任务。',
      url: 'https://chat.openai.com',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      category_id: '1',
      is_free: true,
      pricing_model: 'freemium',
      created_at: new Date().toISOString(),
      tags: ['聊天', '写作', '通用'],
    },
    {
      id: '2',
      name: 'Midjourney',
      slug: 'midjourney',
      description: '强大的 AI 图像生成工具，通过 Discord 使用。',
      url: 'https://www.midjourney.com',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png',
      category_id: '2',
      is_free: false,
      pricing_model: 'paid',
      created_at: new Date().toISOString(),
      tags: ['绘图', '艺术'],
    },
    {
      id: '3',
      name: 'GitHub Copilot',
      slug: 'github-copilot',
      description: 'GitHub 推出的 AI 编程助手。',
      url: 'https://github.com/features/copilot',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/GitHub_Copilot_logo.png',
      category_id: '3',
      is_free: false,
      pricing_model: 'paid',
      created_at: new Date().toISOString(),
      tags: ['编程', '代码'],
    },
    {
      id: '4',
      name: 'Stable Diffusion',
      slug: 'stable-diffusion',
      description: '强大的开源文生图模型，支持本地部署。',
      url: 'https://stability.ai',
      image_url: 'https://image.lexica.art/full_jpg/000305a4-583a-402d-8d0d-29972574431d',
      category_id: '2',
      is_free: true,
      pricing_model: 'free',
      created_at: new Date().toISOString(),
      tags: ['绘图', '开源'],
    },
    {
      id: '5',
      name: 'Notion AI',
      slug: 'notion-ai',
      description: '集成在 Notion 中的 AI 写作助手。',
      url: 'https://www.notion.so/product/ai',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
      category_id: '1',
      is_free: false,
      pricing_model: 'paid',
      created_at: new Date().toISOString(),
      tags: ['写作', '办公'],
    },
    {
      id: '6',
      name: 'Runway',
      slug: 'runway',
      description: '专业的 AI 视频编辑与生成工具。',
      url: 'https://runwayml.com',
      image_url:
        'https://yt3.googleusercontent.com/ytc/AIdro_k3K1k4qF9_y7_y7_y7_y7_y7_y7_y7_y7_y7=s900-c-k-c0x00ffffff-no-rj',
      category_id: '5',
      is_free: false,
      pricing_model: 'freemium',
      created_at: new Date().toISOString(),
      tags: ['视频', '编辑'],
    },
  ]

  async function fetchCategories() {
    try {
      loading.value = true
      const { get } = useSupabaseRest()
      const data = await get<Category[]>('categories')
      categories.value = data && data.length ? data : mockCategories
    } catch (e) {
      console.error('Failed to fetch categories, using mock:', e)
      categories.value = mockCategories
    } finally {
      loading.value = false
    }
  }

  async function fetchTools(params?: Record<string, unknown>) {
    try {
      loading.value = true
      const { get } = useSupabaseRest()
      // Simply fetching all for demo, in production should use pagination
      const data = await get<Tool[]>('tools', params)
      tools.value = data && data.length ? data : mockTools
    } catch (e) {
      console.error('Failed to fetch tools, using mock:', e)
      tools.value = mockTools
    } finally {
      loading.value = false
    }
  }

  async function getToolBySlug(slug: string) {
    // First check store
    const existing = tools.value.find((t) => t.slug === slug)
    if (existing) return existing

    // Then fetch
    try {
      const { get } = useSupabaseRest()
      const data = await get<Tool[]>('tools', { slug: `eq.${slug}` })
      return data?.[0] || mockTools.find((t) => t.slug === slug)
    } catch (e) {
      return mockTools.find((t) => t.slug === slug)
    }
  }

  return {
    tools,
    categories,
    loading,
    fetchCategories,
    fetchTools,
    getToolBySlug,
  }
})
