import Anthropic from '@anthropic-ai/sdk'
import { OPTIMIZE_SYSTEM_PROMPT, STYLES, type Style } from './prompts'
import { MODELS, type ModelId } from './models'

// Prompt Injection 防护
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /<\|im_start\|>/i,
]

export function sanitizeInput(prompt: string): { safe: boolean; reason?: string } {
  if (prompt.length > 10000) return { safe: false, reason: '输入超过最大长度限制（10000 字符）' }
  if (prompt.trim().length === 0) return { safe: false, reason: '输入不能为空' }
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) return { safe: false, reason: '检测到不安全的输入模式' }
  }
  return { safe: true }
}

export interface OptimizeResult {
  original: string
  optimized: string
  model: ModelId
  style: Style
  tokensInput: number
  tokensOutput: number
  latencyMs: number
}

export async function optimizePrompt(
  input: string,
  model: ModelId = 'claude-3-5-sonnet',
  style: Style = 'detailed'
): Promise<OptimizeResult> {
  // 1. sanitize
  const safety = sanitizeInput(input)
  if (!safety.safe) throw new Error(safety.reason)

  // 2. 构建 system prompt
  const styleConfig = STYLES[style]
  const systemPrompt = `${OPTIMIZE_SYSTEM_PROMPT}\n\n优化风格：${styleConfig.instruction}`

  // 3. 调用 Anthropic API（MVP 阶段只支持 Claude）
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const startTime = Date.now()

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: input }],
  })

  const latencyMs = Date.now() - startTime
  const optimized = response.content[0].type === 'text' ? response.content[0].text : ''
  const tokensInput = response.usage.input_tokens
  const tokensOutput = response.usage.output_tokens

  return {
    original: input,
    optimized,
    model,
    style,
    tokensInput,
    tokensOutput,
    latencyMs,
  }
}
