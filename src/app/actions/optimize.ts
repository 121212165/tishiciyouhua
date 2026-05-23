'use server'

import { requireAuth } from '@/lib/auth'
import { optimizePrompt } from '@/lib/ai/optimize'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { ModelId } from '@/lib/ai/models'
import type { Style } from '@/lib/ai/prompts'

const optimizeSchema = z.object({
  prompt: z.string().min(1, '请输入提示词').max(10000, '提示词不能超过 10000 字符'),
  model: z.enum(['claude-3-5-sonnet', 'gpt-4o', 'gemini-pro']).default('claude-3-5-sonnet'),
  style: z.enum(['concise', 'detailed', 'creative']).default('detailed'),
})

export interface OptimizeActionState {
  success: boolean
  error?: string
  data?: {
    id: string
    original: string
    optimized: string
    model: ModelId
    style: Style
    tokensInput: number
    tokensOutput: number
    latencyMs: number
  }
}

export async function optimizeAction(
  prevState: OptimizeActionState | null,
  formData: FormData
): Promise<OptimizeActionState> {
  try {
    const user = await requireAuth()

    const parsed = optimizeSchema.safeParse({
      prompt: formData.get('prompt'),
      model: formData.get('model'),
      style: formData.get('style'),
    })

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const { prompt, model, style } = parsed.data
    const result = await optimizePrompt(prompt, model as ModelId, style as Style)

    // 保存到数据库
    const supabase = await createClient()
    const { data: record, error: dbError } = await supabase
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

    if (dbError) {
      console.error('Failed to save optimization:', dbError)
      // 不阻塞用户，只记录错误
    }

    // 记录用量
    await supabase.from('usage_records').insert({
      user_id: user.id,
      optimization_id: record?.id,
      action: 'optimize',
      tokens_used: result.tokensInput + result.tokensOutput,
      cost_cents: Math.ceil(
        (result.tokensInput * 0.003 + result.tokensOutput * 0.015) / 1000 * 100
      ),
    })

    return {
      success: true,
      data: {
        id: record?.id || '',
        ...result,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '优化失败，请重试',
    }
  }
}
