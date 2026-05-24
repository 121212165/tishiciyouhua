export const MODELS = {
  'deepseek-v4-flash': {
    name: 'DeepSeek V4 Flash',
    provider: 'anthropic',
    modelId: 'deepseek-v4-flash',
    maxTokens: 8192,
    costPer1kInput: 0.0001,
    costPer1kOutput: 0.0002,
    description: 'DeepSeek V4 Flash，超低延迟，适合快速优化',
    tier: 'economy' as const,
  },
  'claude-3-5-sonnet': {
    name: 'Claude Sonnet 4.6',
    provider: 'anthropic',
    modelId: 'claude-sonnet-4-6-20250514',
    maxTokens: 8192,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    description: '最佳编码和通用能力，性价比最优',
    tier: 'standard' as const,
  },
  'claude-opus-4-5': {
    name: 'Claude Opus 4.5',
    provider: 'anthropic',
    modelId: 'claude-opus-4-5-20250514',
    maxTokens: 8192,
    costPer1kInput: 0.015,
    costPer1kOutput: 0.075,
    description: '最深度推理能力，适合复杂分析和架构设计',
    tier: 'premium' as const,
  },
  'claude-haiku-4-5': {
    name: 'Claude Haiku 4.5',
    provider: 'anthropic',
    modelId: 'claude-haiku-4-5-20250514',
    maxTokens: 8192,
    costPer1kInput: 0.0008,
    costPer1kOutput: 0.004,
    description: '轻量快速，90% Sonnet 能力，3 倍成本节省',
    tier: 'economy' as const,
  },
  'gpt-4o': {
    name: 'GPT-4o',
    provider: 'openai',
    modelId: 'gpt-4o',
    maxTokens: 4096,
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
    description: 'OpenAI 多模态旗舰模型',
    tier: 'standard' as const,
  },
  'gemini-pro': {
    name: 'Gemini Pro',
    provider: 'google',
    modelId: 'gemini-pro',
    maxTokens: 4096,
    costPer1kInput: 0.00025,
    costPer1kOutput: 0.0005,
    description: 'Google 大模型，性价比极高',
    tier: 'economy' as const,
  },
} as const

export type ModelId = keyof typeof MODELS

export const MODEL_IDS = Object.keys(MODELS) as ModelId[]

export type ModelTier = (typeof MODELS)[ModelId]['tier']

/**
 * 获取指定 tier 的模型列表
 */
export function getModelsByTier(tier: ModelTier): ModelId[] {
  return MODEL_IDS.filter((id) => MODELS[id].tier === tier)
}

/**
 * 计算预估成本（美元）
 */
export function estimateCost(modelId: ModelId, inputTokens: number, outputTokens: number): number {
  const model = MODELS[modelId]
  return (inputTokens * model.costPer1kInput + outputTokens * model.costPer1kOutput) / 1000
}
