import type { FetchOptions } from 'ofetch'

/**
 * 创建 Supabase REST 请求
 * - 自动拼接 `rest/v1` 路径
 * - 注入 `apikey` 与 `Authorization` 头（匿名只读）
 */
export function useSupabaseRest() {
  const config = useRuntimeConfig()
  const base = config.public.supabaseUrl
  const key = config.public.supabaseAnonKey

  /**
   * 发送 GET 请求到 Supabase REST
   */
  async function get<T = unknown>(
    path: string,
    params?: Record<string, unknown>,
    options?: FetchOptions<'json'>
  ): Promise<T> {
    const url = `${base}/rest/v1/${path}`
    return $fetch<T>(url, {
      method: 'GET' as const,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      query: params,
      onResponseError({ response }) {
        console.error(`[Supabase Error] ${response.status} ${path}:`, response._data)
      },
      ...options,
    })
  }

  /**
   * 发送 GET 请求并返回原始响应（含 headers）
   */
  async function getRaw<T = unknown>(
    path: string,
    params?: Record<string, unknown>,
    options?: FetchOptions<'json'>
  ): Promise<{ data: T; headers: Headers }> {
    const url = `${base}/rest/v1/${path}`
    const res = await $fetch.raw<T>(url, {
      method: 'GET' as const,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      query: params,
      onResponseError({ response }) {
        console.error(`[Supabase Error] ${response.status} ${path}:`, response._data)
      },
      ...options,
    })
    return { data: res._data as T, headers: res.headers }
  }

  return { get, getRaw }
}

/**
 * 工具：通用分页参数构造
 */
export function buildPagination(limit = 20, page = 1) {
  const from = (page - 1) * limit
  const to = from + limit - 1
  return { limit, page, from, to }
}
