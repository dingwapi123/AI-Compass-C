import { useSupabaseServiceRole } from '~~/server/utils/supabase.js'

export default defineEventHandler(async (event) => {
  // 1. 读取数据
  const body = await readBody(event)
  const { id, updates } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing tool ID',
    })
  }

  // 2. 使用 Service Role Key 操作数据库
  const supabase = useSupabaseServiceRole()

  // 移除可能存在的系统字段
  const { id: _, created_at, updated_at, ...cleanUpdates } = updates

  const { data, error } = await supabase
    .from('tools')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return data
})
