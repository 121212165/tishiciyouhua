import Anthropic from '@anthropic-ai/sdk'

export interface AIResponse {
  content: string
  tokensInput: number
  tokensOutput: number
}

export interface StreamChunk {
  type: 'text_delta' | 'usage'
  text?: string
  tokensInput?: number
  tokensOutput?: number
}

export interface AIProvider {
  name: string
  optimize(prompt: string, systemPrompt: string, maxTokens: number): Promise<AIResponse>
  streamOptimize(prompt: string, systemPrompt: string, maxTokens: number): AsyncGenerator<StreamChunk>
}

// Claude Provider
export class ClaudeProvider implements AIProvider {
  name = 'Claude 3.5 Sonnet'
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }

  async optimize(prompt: string, systemPrompt: string, maxTokens: number): Promise<AIResponse> {
    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    return {
      content: response.content[0]?.type === 'text' ? response.content[0].text : '',
      tokensInput: response.usage.input_tokens,
      tokensOutput: response.usage.output_tokens,
    }
  }

  async *streamOptimize(
    prompt: string,
    systemPrompt: string,
    maxTokens: number
  ): AsyncGenerator<StreamChunk> {
    const stream = this.client.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
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
}

// GPT-4o Provider (placeholder for Phase 2 later)
export class OpenAIProvider implements AIProvider {
  name = 'GPT-4o'

  async optimize(): Promise<AIResponse> {
    throw new Error('GPT-4o 支持即将上线')
  }

  async *streamOptimize(): AsyncGenerator<StreamChunk> {
    throw new Error('GPT-4o 支持即将上线')
  }
}

// Gemini Provider (placeholder)
export class GeminiProvider implements AIProvider {
  name = 'Gemini Pro'

  async optimize(): Promise<AIResponse> {
    throw new Error('Gemini Pro 支持即将上线')
  }

  async *streamOptimize(): AsyncGenerator<StreamChunk> {
    throw new Error('Gemini Pro 支持即将上线')
  }
}

// Provider factory
export function getProvider(modelId: string): AIProvider {
  switch (modelId) {
    case 'gpt-4o':
      return new OpenAIProvider()
    case 'gemini-pro':
      return new GeminiProvider()
    case 'claude-3-5-sonnet':
    default:
      return new ClaudeProvider()
  }
}
