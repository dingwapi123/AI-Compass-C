import { useSupabaseServiceRole } from "~~/server/utils/supabase.js"

export default defineEventHandler(async (event) => {
  // 1. 读取数据
  const body = await readBody(event)
  
  // 2. 使用 Service Role Key 操作数据库
  const supabase = useSupabaseServiceRole()
  
  // 移除可能存在的系统字段
  const { id, created_at, updated_at, ...toolData } = body

  const { data, error } = await supabase
    .from('tools')
    .insert(toolData)
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
