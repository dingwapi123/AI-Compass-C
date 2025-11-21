import { defineContentConfig, defineCollection, z } from '@nuxt/content'

/**
 * 内容集合配置（文章）
 */
export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: 'articles/**/*.md',
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        author: z.string().optional(),
        date: z.union([z.string(), z.date()]).optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
      }),
    }),
  },
})
