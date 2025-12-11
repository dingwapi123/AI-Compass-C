import { useSupabaseClient } from './useSupabase'

export const useSupabaseUpload = () => {
  const supabase = useSupabaseClient()
  const uploading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 上传文件到 Supabase Storage
   * @param file 要上传的文件对象
   * @param bucket 存储桶名称，默认为 'tools'
   * @param path 可选的文件路径前缀
   */
  const uploadFile = async (file: File, bucket: string = 'tools', path: string = '') => {
    uploading.value = true
    error.value = null

    try {
      // 生成唯一文件名
      const fileExt = file.name.split('.').pop()
      const fileName = `${path}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // 获取公开访问链接
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path)

      return publicUrl
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown upload error'
      error.value = message
      console.error('Upload failed:', e)
      throw new Error(message)
    } finally {
      uploading.value = false
    }
  }

  return {
    uploadFile,
    uploading,
    error,
  }
}
