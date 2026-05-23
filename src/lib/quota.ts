import { createClient } from '@/lib/supabase/server'

const DAILY_FREE_LIMIT = 10

export interface QuotaResult {
  allowed: boolean
  used: number
  limit: number
  remaining: number
}

export async function checkQuota(userId: string): Promise<QuotaResult> {
  const supabase = await createClient()

  // 获取用户 plan，付费用户无配额限制
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()

  if (profile && profile.plan !== 'free') {
    return { allowed: true, used: 0, limit: Infinity, remaining: Infinity }
  }

  // 免费用户：检查今日用量
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count, error } = await supabase
    .from('usage_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', 'optimize')
    .gte('created_at', today.toISOString())

  if (error) {
    // On DB error, allow the request (fail open)
    return { allowed: true, used: 0, limit: DAILY_FREE_LIMIT, remaining: DAILY_FREE_LIMIT }
  }

  const used = count ?? 0
  const remaining = Math.max(0, DAILY_FREE_LIMIT - used)

  return {
    allowed: remaining > 0,
    used,
    limit: DAILY_FREE_LIMIT,
    remaining,
  }
}
