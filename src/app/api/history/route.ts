import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
    const from = (page - 1) * limit
    const to = from + limit - 1

    const supabase = await createClient()

    const [dataResult, countResult] = await Promise.all([
      supabase
        .from('optimizations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to),
      supabase
        .from('optimizations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ])

    if (dataResult.error) {
      console.error('history query error:', dataResult.error)
      return NextResponse.json(
        { error: '查询历史记录失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      records: dataResult.data ?? [],
      total: countResult.count ?? 0,
    })
  } catch (error) {
    console.error('history route error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
