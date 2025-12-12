import { createClient } from '@supabase/supabase-js'

let serviceRoleInstance: ReturnType<typeof createClient> | null = null

export const useSupabaseServiceRole = () => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl || ''
  const serviceRoleKey = config.supabaseServiceRoleKey || ''

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase URL or Service Role Key')
  }

  if (!serviceRoleInstance) {
    serviceRoleInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return serviceRoleInstance
}
