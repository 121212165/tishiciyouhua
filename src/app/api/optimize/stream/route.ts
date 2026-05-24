import { NextRequest } from 'next/server'
import { getUser } from '@/lib/auth'
import { sanitizeInput } from '@/lib/ai/optimize'
import { getProvider } from '@/lib/ai/provider'
import { STYLES, type Style, buildSystemPromptWithLanguage } from '@/lib/ai/prompts'
import { createClient } from '@/lib/supabase/server'
import { checkQuota } from '@/lib/quota'
import type { ModelId } from '@/lib/ai/models'

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 检查配额
  const quota = await checkQuota(user.id)
  if (!quota.allowed) {
    return new Response('今日免费额度已用完，请升级 Pro', { status: 429 })
  }

  const { prompt, model = 'claude-3-5-sonnet', style = 'detailed' } = await req.json()

  const safety = sanitizeInput(prompt)
  if (!safety.safe) {
    return new Response(safety.reason, { status: 400 })
  }

  const styleConfig = STYLES[style as Style]
  if (!styleConfig) {
    return new Response('无效的优化风格', { status: 400 })
  }

  const systemPrompt = buildSystemPromptWithLanguage(style as Style, prompt)

  const provider = getProvider(model as ModelId)
  const encoder = new TextEncoder()
  const startTime = Date.now()
  let totalOutput = ''
  let tokensInput = 0
  let tokensOutput = 0

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of provider.streamOptimize(prompt, systemPrompt, 8192)) {
          if (chunk.type === 'text_delta' && chunk.text) {
            totalOutput += chunk.text
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'text', content: chunk.text })}\n\n`
              )
            )
          } else if (chunk.type === 'usage') {
            tokensInput = chunk.tokensInput ?? 0
            tokensOutput = chunk.tokensOutput ?? 0
          }
        }

        const latencyMs = Date.now() - startTime

        // 保存到数据库
        const supabase = await createClient()
        const { data: record } = await supabase
          .from('optimizations')
          .insert({
            user_id: user.id,
            original_prompt: prompt,
            optimized_prompt: totalOutput,
            model,
            style,
            tokens_input: tokensInput,
            tokens_output: tokensOutput,
            latency_ms: latencyMs,
          })
          .select('id')
          .single()

        // 记录用量
        await supabase.from('usage_records').insert({
          user_id: user.id,
          optimization_id: record?.id,
          action: 'optimize',
          tokens_used: tokensInput + tokensOutput,
        })

        // 发送完成事件
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'done',
              id: record?.id,
              tokensInput,
              tokensOutput,
              latencyMs,
            })}\n\n`
          )
        )

        controller.close()
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'error',
              message: error instanceof Error ? error.message : '优化失败',
            })}\n\n`
          )
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
