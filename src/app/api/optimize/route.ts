import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { optimizePrompt, sanitizeInput } from '@/lib/ai/optimize'
import { createClient } from '@/lib/supabase/server'
import type { ModelId } from '@/lib/ai/models'
import type { Style } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()

    const { prompt, model = 'claude-3-5-sonnet', style = 'detailed' } = body

    // 验证输入
    const safety = sanitizeInput(prompt)
    if (!safety.safe) {
      return NextResponse.json({ error: safety.reason }, { status: 400 })
    }

    const result = await optimizePrompt(prompt, model as ModelId, style as Style)

    // 保存
    const supabase = await createClient()
    const { data: record } = await supabase
      .from('optimizations')
      .insert({
        user_id: user.id,
        original_prompt: result.original,
        optimized_prompt: result.optimized,
        model: result.model,
        style: result.style,
        tokens_input: result.tokensInput,
        tokens_output: result.tokensOutput,
        latency_ms: result.latencyMs,
      })
      .select('id')
      .single()

    return NextResponse.json({
      success: true,
      data: { id: record?.id, ...result },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
