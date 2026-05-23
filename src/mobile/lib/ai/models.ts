export const MODELS = {
  'claude-3-5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    maxTokens: 4096,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
  },
  'gpt-4o': {
    name: 'GPT-4o',
    provider: 'openai',
    maxTokens: 4096,
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
  },
  'gemini-pro': {
    name: 'Gemini Pro',
    provider: 'google',
    maxTokens: 4096,
    costPer1kInput: 0.00025,
    costPer1kOutput: 0.0005,
  },
} as const

export type ModelId = keyof typeof MODELS
