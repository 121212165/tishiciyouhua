import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Today's usage records
  const { data: records, error } = await supabase
    .from('usage_records')
    .select('tokens_used, cost_cents, created_at')
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString())

  if (error) {
    return NextResponse.json({ error: '获取用量失败' }, { status: 500 })
  }

  const totalOptimizations = records?.length ?? 0
  const totalTokens = records?.reduce((sum, r) => sum + (r.tokens_used ?? 0), 0) ?? 0
  const totalCostCents = records?.reduce((sum, r) => sum + (r.cost_cents ?? 0), 0) ?? 0

  // Count unique input/output from optimizations table today
  const { data: todayOpts } = await supabase
    .from('optimizations')
    .select('tokens_input, tokens_output')
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString())

  const tokensInput = todayOpts?.reduce((sum, o) => sum + (o.tokens_input ?? 0), 0) ?? 0
  const tokensOutput = todayOpts?.reduce((sum, o) => sum + (o.tokens_output ?? 0), 0) ?? 0

  return NextResponse.json({
    totalOptimizations,
    tokensInput,
    tokensOutput,
    totalTokens,
    totalCostCents,
  })
}
