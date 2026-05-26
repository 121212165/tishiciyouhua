import { describe, it, expect } from 'vitest'
import { MODELS, MODEL_IDS, getModelsByTier, estimateCost, type ModelId } from '@/lib/ai/models'

describe('MODELS', () => {
  it('包含全部 5 个模型定义', () => {
    expect(Object.keys(MODELS)).toHaveLength(5)
    expect(MODELS).toHaveProperty('claude-3-5-sonnet')
    expect(MODELS).toHaveProperty('claude-opus-4-5')
    expect(MODELS).toHaveProperty('claude-haiku-4-5')
    expect(MODELS).toHaveProperty('gpt-4o')
    expect(MODELS).toHaveProperty('gemini-pro')
  })

  it('每个模型都有必要的字段', () => {
    for (const [id, model] of Object.entries(MODELS)) {
      expect(model).toHaveProperty('name')
      expect(model).toHaveProperty('provider')
      expect(model).toHaveProperty('modelId')
      expect(model).toHaveProperty('maxTokens')
      expect(model).toHaveProperty('costPer1kInput')
      expect(model).toHaveProperty('costPer1kOutput')
      expect(model).toHaveProperty('tier')
      expect(typeof model.costPer1kInput).toBe('number')
      expect(typeof model.costPer1kOutput).toBe('number')
    }
  })
})

describe('MODEL_IDS', () => {
  it('返回所有模型的 key', () => {
    expect(MODEL_IDS).toHaveLength(5)
    expect(MODEL_IDS).toContain('claude-3-5-sonnet')
    expect(MODEL_IDS).toContain('claude-opus-4-5')
    expect(MODEL_IDS).toContain('claude-haiku-4-5')
    expect(MODEL_IDS).toContain('gpt-4o')
    expect(MODEL_IDS).toContain('gemini-pro')
  })
})

describe('getModelsByTier', () => {
  it('economy 层级返回 haiku 和 gemini', () => {
    const result = getModelsByTier('economy')
    expect(result).toContain('claude-haiku-4-5')
    expect(result).toContain('gemini-pro')
    expect(result).toHaveLength(2)
  })

  it('standard 层级返回 sonnet 和 gpt-4o', () => {
    const result = getModelsByTier('standard')
    expect(result).toContain('claude-3-5-sonnet')
    expect(result).toContain('gpt-4o')
    expect(result).toHaveLength(2)
  })

  it('premium 层级返回 opus', () => {
    const result = getModelsByTier('premium')
    expect(result).toContain('claude-opus-4-5')
    expect(result).toHaveLength(1)
  })
})

describe('estimateCost', () => {
  it('对已知 token 数正确计算成本', () => {
    // claude-3-5-sonnet: input 0.003/1k, output 0.015/1k
    const cost = estimateCost('claude-3-5-sonnet', 1000, 1000)
    expect(cost).toBeCloseTo(0.003 + 0.015, 6)
  })

  it('token 数为 0 时返回 0', () => {
    const cost = estimateCost('claude-3-5-sonnet', 0, 0)
    expect(cost).toBe(0)
  })

  it('仅计算 input token 时 output 部分为 0', () => {
    const cost = estimateCost('gpt-4o', 2000, 0)
    expect(cost).toBeCloseTo(2000 * 0.005 / 1000, 6)
  })

  it('仅计算 output token 时 input 部分为 0', () => {
    const cost = estimateCost('gpt-4o', 0, 2000)
    expect(cost).toBeCloseTo(2000 * 0.015 / 1000, 6)
  })

  it('premium 模型成本高于 economy 模型', () => {
    const premiumCost = estimateCost('claude-opus-4-5', 1000, 1000)
    const economyCost = estimateCost('claude-haiku-4-5', 1000, 1000)
    expect(premiumCost).toBeGreaterThan(economyCost)
  })
})
