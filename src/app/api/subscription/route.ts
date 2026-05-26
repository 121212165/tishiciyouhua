import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import type { Plan } from '@/types/database'

interface SubscriptionResponse {
  plan: Plan
  status: string
  current_period_end: string | null
}

const DEFAULT_SUBSCRIPTION: SubscriptionResponse = {
  plan: 'free',
  status: 'active',
  current_period_end: null,
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('subscription query error:', error)
      return NextResponse.json(
        { error: '查询订阅信息失败' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(DEFAULT_SUBSCRIPTION)
    }

    const response: SubscriptionResponse = {
      plan: (data.plan as Plan) ?? 'free',
      status: data.status ?? 'active',
      current_period_end: data.current_period_end ?? null,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('subscription route error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
