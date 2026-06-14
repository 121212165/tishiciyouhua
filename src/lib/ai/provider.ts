import Anthropic from '@anthropic-ai/sdk'

export interface StreamChunk {
  type: 'text_delta' | 'usage'
  text?: string
  tokensInput?: number
  tokensOutput?: number
}

export async function* streamOptimize(
  prompt: string,
  systemPrompt: string,
  maxTokens: number = 8192
): AsyncGenerator<StreamChunk> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6-20250514',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield { type: 'text_delta', text: event.delta.text }
    }
  }

  const finalMessage = await stream.finalMessage()
  yield {
    type: 'usage',
    tokensInput: finalMessage.usage.input_tokens,
    tokensOutput: finalMessage.usage.output_tokens,
  }
}
