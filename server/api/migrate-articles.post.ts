import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'
// 注意：采用文件系统读取方式作为主实现

/**
 * 解析文件中的 Markdown 正文（移除 YAML frontmatter）
 */
async function readMarkdownBody(slug: string): Promise<string> {
  const cwd = process.cwd()
  const mdPath = resolve(cwd, 'content', 'articles', `${slug}.md`)
  const mdcPath = resolve(cwd, 'content', 'articles', `${slug}.mdc`)
  let content = ''
  try {
    content = await fs.readFile(mdPath, 'utf-8')
  } catch {
    try {
      content = await fs.readFile(mdcPath, 'utf-8')
    } catch {
      content = ''
    }
  }
  const fm = content.match(/^---[\s\S]*?---\n?/)
  return fm ? content.slice(fm[0].length) : content
}

/**
 * 将字符串转换为 slug（小写，去除非字母数字，空格转横线）
 */
function toSlug(input: string): string {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

/**
 * 构造 Supabase REST 客户端（使用 service_role）
 */
function useSupabaseAdmin(event: any) {
  const config = useRuntimeConfig()
  const base = config.public.supabaseUrl
  const key = config.supabaseServiceRoleKey
  async function get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    const url = `${base}/rest/v1/${path}`
    return $fetch<T>(url, {
      method: 'GET',
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      query: params,
    })
  }
  async function post<T = any>(path: string, body: any): Promise<T[]> {
    const url = `${base}/rest/v1/${path}`
    return $fetch<T[]>(url, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=representation' },
      body,
    })
  }
  async function patch<T = any>(path: string, filter: Record<string, any>, body: any): Promise<T[]> {
    const url = `${base}/rest/v1/${path}`
    return $fetch<T[]>(url, {
      method: 'PATCH',
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=representation' },
      query: filter,
      body,
    })
  }
  return { get, post, patch }
}

/**
 * 执行迁移：将 content/articles 的文章批量写入 Supabase
 */
export default defineEventHandler(async (event) => {
  const { get, post, patch } = useSupabaseAdmin(event)
  const files = await listArticleFiles()

  const report = { inserted: 0, updated: 0, authors: 0, categories: 0, tags: 0, errors: [] as string[] }

  for (const f of files) {
    try {
      const slug: string = f.slug
      const fileText = await fs.readFile(f.fullPath, 'utf-8')
      const content_md = await readMarkdownBody(slug)
      const fm = parseFrontmatter(fileText)
      const authorName: string | undefined = fm.author || undefined
      const categoryName: string | undefined = fm.category || undefined
      const tags: string[] = Array.isArray(fm.tags) ? fm.tags : (typeof fm.tags === 'string' && fm.tags ? [fm.tags] : [])
      const created_at: string | undefined = fm.date || undefined
      const title: string | undefined = fm.title || (content_md.match(/^#\s+(.+)$/m)?.[1] || undefined)
      const description: string | undefined = fm.description || undefined

      let author_id: string | undefined
      if (authorName) {
        const found = await get<any[]>('authors', { name: `eq.${authorName}`, select: 'id', limit: 1 })
        if (found[0]?.id) author_id = found[0].id
        else {
          const created = await post<any>('authors', { name: authorName })
          author_id = created[0]?.id
          report.authors += 1
        }
      }

      let category_id: string | undefined
      if (categoryName) {
        const cslug = toSlug(categoryName)
        const found = await get<any[]>('categories', { slug: `eq.${cslug}`, select: 'id', limit: 1 })
        if (found[0]?.id) category_id = found[0].id
        else {
          const created = await post<any>('categories', { name: categoryName, slug: cslug })
          category_id = created[0]?.id
          report.categories += 1
        }
      }

      const tagIds: string[] = []
      for (const t of tags) {
        const tslug = toSlug(t)
        const found = await get<any[]>('tags', { slug: `eq.${tslug}`, select: 'id', limit: 1 })
        if (found[0]?.id) tagIds.push(found[0].id)
        else {
          const created = await post<any>('tags', { name: t, slug: tslug })
          if (created[0]?.id) tagIds.push(created[0].id)
          report.tags += 1
        }
      }

      const existing = await get<any[]>('articles', { slug: `eq.${slug}`, select: 'id', limit: 1 })
      let article_id: string | undefined = existing[0]?.id
      const payload: any = {
        slug,
        title,
        description,
        content_md,
        author_id: author_id ?? null,
        category_id: category_id ?? null,
        status: 'published',
      }
      if (created_at) payload.created_at = created_at

      if (!article_id) {
        const created = await post<any>('articles', payload)
        article_id = created[0]?.id
        report.inserted += 1
      } else {
        const updated = await patch<any>('articles', { slug: `eq.${slug}` }, payload)
        article_id = updated[0]?.id || article_id
        report.updated += 1
      }

      if (article_id && tagIds.length) {
        for (const tid of tagIds) {
          const atFound = await get<any[]>('article_tags', { article_id: `eq.${article_id}`, tag_id: `eq.${tid}`, select: 'article_id', limit: 1 })
          if (!atFound[0]) {
            await post<any>('article_tags', { article_id, tag_id: tid })
          }
        }
      }
    } catch (e: any) {
      report.errors.push(String(e?.message || e))
    }
  }

  return report
})
/**
 * 枚举 content/articles 目录下的 Markdown/MDC 文件
 */
async function listArticleFiles(): Promise<{ slug: string; fullPath: string }[]> {
  const cwd = process.cwd()
  const dir = resolve(cwd, 'content', 'articles')
  const entries = await fs.readdir(dir).catch(() => [])
  const files = entries.filter((f) => /\.(md|mdc)$/i.test(f))
  return files.map((f) => ({ slug: f.replace(/\.(md|mdc)$/i, ''), fullPath: resolve(dir, f) }))
}

/**
 * 简易 frontmatter 解析（支持字符串与数组）
 */
function parseFrontmatter(text: string): Record<string, any> {
  const res: Record<string, any> = {}
  const fm = text.match(/^---[\s\S]*?---\n?/)
  if (!fm) return res
  const block = fm[0].replace(/^---\n?/, '').replace(/\n?---\n?$/, '')
  for (const raw of block.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1)
      res[key] = value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    } else {
      res[key] = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
    }
  }
  return res
}