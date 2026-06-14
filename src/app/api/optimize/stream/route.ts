import { NextRequest } from 'next/server'
import { sanitizeInput } from '@/lib/ai/optimize'
import { streamOptimize } from '@/lib/ai/provider'
import { buildSystemPromptWithLanguage, type Style } from '@/lib/ai/prompts'

export async function POST(req: NextRequest) {
  const { prompt, style = 'detailed' } = await req.json()

  const safety = sanitizeInput(prompt)
  if (!safety.safe) {
    return new Response(safety.reason, { status: 400 })
  }

  const systemPrompt = buildSystemPromptWithLanguage(style as Style, prompt)
  const encoder = new TextEncoder()
  let totalOutput = ''
  let tokensInput = 0
  let tokensOutput = 0

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamOptimize(prompt, systemPrompt)) {
          if (chunk.type === 'text_delta' && chunk.text) {
            totalOutput += chunk.text
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'text', content: chunk.text })}\n\n`)
            )
          } else if (chunk.type === 'usage') {
            tokensInput = chunk.tokensInput ?? 0
            tokensOutput = chunk.tokensOutput ?? 0
          }
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'done', tokensInput, tokensOutput })}\n\n`
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
