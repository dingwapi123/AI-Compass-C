import type { FetchOptions } from 'ofetch'

/**
 * 通用 API 请求封装
 * 用于非 Supabase 的常规接口请求
 */
export const useRequest = <T = unknown>(url: string, options: FetchOptions = {}) => {
  const defaults: FetchOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    onResponseError({ response }) {
      console.error(`[API Error] ${response.status} ${url}:`, response._data)
    },
  }

  // @ts-expect-error - $fetch types strictness
  return $fetch<T>(url, {
    ...defaults,
    ...options,
    headers: {
      ...defaults.headers,
      ...options.headers,
    },
  })
}
