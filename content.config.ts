import { defineContentConfig, defineCollection, z } from "@nuxt/content"

/**
 * 内容集合配置（文章）
 */
export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "**/*.md",
    }),
    articles: defineCollection({
      type: "page",
      source: { include: "articles/**/*.{md,mdc}", prefix: "articles" },
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
