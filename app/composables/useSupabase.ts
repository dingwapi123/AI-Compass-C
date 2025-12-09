import { createClient } from '@supabase/supabase-js'

// 客户端单例缓存
let clientInstance: ReturnType<typeof createClient> | null = null

/**
 * 手动封装的 Supabase Client
 * 替代 @nuxtjs/supabase 模块，避免自动重定向问题
 */
export const useSupabaseClient = () => {
  const config = useRuntimeConfig()

  // 服务端：每次请求创建一个新实例，避免请求间状态污染（虽然 Supabase JS client 本身大多是无状态的，除了 Auth）
  // 如果你的应用不涉及服务端 Auth 操作，也可以考虑在服务端使用单例。
  // 但为了安全起见，SSR 期间最好是新实例。
  if (import.meta.server) {
    const supabaseUrl = config.public.supabaseUrl
    const supabaseKey = config.public.supabasePublishableKey || config.public.supabaseAnonKey
    return createClient(supabaseUrl, supabaseKey)
  }

  // 客户端：使用单例模式，避免重复创建
  if (!clientInstance) {
    const supabaseUrl = config.public.supabaseUrl
    const supabaseKey = config.public.supabasePublishableKey || config.public.supabaseAnonKey

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase URL or Key is missing!')
    }

    clientInstance = createClient(supabaseUrl, supabaseKey)
  }

  return clientInstance
}
