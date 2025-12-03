import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useSupabaseRest } from '../../app/composables/services/useSupabase'

// Mock useRuntimeConfig
mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    public: {
      supabaseUrl: 'https://mock.supabase.co',
      supabaseAnonKey: 'mock-key'
    }
  })
})

// Mock $fetch
// $fetch is a global in Nuxt, we might need to stub it on globalThis or use mockNuxtImport if it's imported
globalThis.$fetch = vi.fn().mockResolvedValue([{ id: 1 }]) as any

describe('useSupabaseRest', () => {
  it('should construct correct URL', async () => {
    const { get } = useSupabaseRest()
    const res = await get('tools')
    
    expect(globalThis.$fetch).toHaveBeenCalledWith(
      'https://mock.supabase.co/rest/v1/tools',
      expect.objectContaining({
        headers: expect.objectContaining({
          apikey: 'mock-key'
        })
      })
    )
    expect(res).toEqual([{ id: 1 }])
  })
})
