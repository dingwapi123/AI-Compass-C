export type NewsItem = {
  id: string
  slug: string
  title: string
  summary: string
  source: string
  source_url: string
  published_at: string
  tags?: string[]
}

export type ToolItem = {
  id: string
  slug: string
  name: string
  description: string
  url: string
  logo?: string
  categories: string[]
  tags?: string[]
  pricing?: "free" | "freemium" | "paid"
  models?: string[]
}

export const mockNews: NewsItem[] = [
  {
    id: "n1",
    slug: "openai-o4-mini-preview",
    title: "OpenAI 发布 o4-mini 预览，定位高性价比模型",
    summary: "o4-mini 主打推理与代码性价比，API 价格低于 gpt-4o-mini，同时支持新多模态接口。",
    source: "OpenAI Blog",
    source_url: "https://openai.com",
    published_at: "2025-02-18T03:00:00Z",
    tags: ["模型", "OpenAI", "发布"],
  },
  {
    id: "n2",
    slug: "anthropic-claude-3-7-sonnet",
    title: "Anthropic 发布 Claude 3.7 Sonnet，强调工具调用和长文本",
    summary: "Claude 3.7 Sonnet 提升了长上下文与工具调用可靠性，API 价格保持与 3.5 靠拢。",
    source: "Anthropic",
    source_url: "https://www.anthropic.com",
    published_at: "2025-02-17T10:00:00Z",
    tags: ["模型", "Anthropic", "长文本"],
  },
  {
    id: "n3",
    slug: "mistral-large-23-precision",
    title: "Mistral Large 2.3 上线，兼容 OpenAI 格式的 function calling",
    summary: "在编码与工具调用场景加入高精度模式，提供 Mistral-hosted embeddings。",
    source: "Mistral AI",
    source_url: "https://mistral.ai",
    published_at: "2025-02-17T06:00:00Z",
    tags: ["模型", "Mistral", "工具调用"],
  },
  {
    id: "n4",
    slug: "google-gemini-enterprise",
    title: "Google 推出 Gemini Enterprise 套件，主打企业合规与数据驻留",
    summary: "Gemini Enterprise 提供地区化数据驻留、审计日志、企业 SSO 与 DLP 选项。",
    source: "Google AI",
    source_url: "https://ai.google",
    published_at: "2025-02-16T04:00:00Z",
    tags: ["Google", "企业", "合规"],
  },
]

export const mockTools: ToolItem[] = [
  {
    id: "t1",
    slug: "chatgpt",
    name: "ChatGPT",
    description: "OpenAI 提供的通用对话与助手平台，支持插件与代码解释器。",
    url: "https://chat.openai.com",
    categories: ["通用助手"],
    tags: ["对话", "代码"],
    pricing: "freemium",
    models: ["GPT-4", "o4-mini"],
    logo: "https://cdn.openai.com/logos/chatgpt.png",
  },
  {
    id: "t2",
    slug: "claude",
    name: "Claude.ai",
    description: "Anthropic 的对话与分析工具，长上下文与工具调用表现强。",
    url: "https://claude.ai",
    categories: ["通用助手"],
    tags: ["长文本", "工具调用"],
    pricing: "freemium",
    models: ["Claude 3.7"],
  },
  {
    id: "t3",
    slug: "cursor",
    name: "Cursor",
    description: "面向开发者的 AI 代码编辑器，支持多模型与本地上下文。",
    url: "https://cursor.sh",
    categories: ["开发工具"],
    tags: ["IDE", "代码补全"],
    pricing: "freemium",
    models: ["o4-mini", "Claude 3.7", "Mistral Large"],
  },
  {
    id: "t4",
    slug: "perplexity",
    name: "Perplexity",
    description: "带引用的搜索与问答工具，聚合多源信息并生成摘要。",
    url: "https://www.perplexity.ai",
    categories: ["搜索"],
    tags: ["聚合搜索", "实时"],
    pricing: "freemium",
    models: ["Perplexity Large", "GPT-4"],
  },
  {
    id: "t5",
    slug: "notion-ai",
    name: "Notion AI",
    description: "Notion 内置的写作与整理助手，支持总结、重写、表格生成功能。",
    url: "https://www.notion.so/product/ai",
    categories: ["效率", "写作"],
    tags: ["总结", "写作"],
    pricing: "paid",
    models: ["GPT-4 族"],
  },
  {
    id: "t6",
    slug: "midjourney",
    name: "Midjourney",
    description: "图片生成工具，支持风格化和多轮提示调优。",
    url: "https://www.midjourney.com",
    categories: ["多模态", "设计"],
    tags: ["图像生成"],
    pricing: "paid",
    models: ["自研"],
  },
]
