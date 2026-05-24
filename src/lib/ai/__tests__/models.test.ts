import { describe, it, expect } from 'vitest'
import { estimateCost, getModelsByTier, MODELS, MODEL_IDS } from '../models'

describe('estimateCost', () => {
  it('calculates cost correctly for claude-3-5-sonnet', () => {
    // costPer1kInput: 0.003, costPer1kOutput: 0.015
    // (1000 * 0.003 + 2000 * 0.015) / 1000 = (3 + 30) / 1000 = 0.033
    const cost = estimateCost('claude-3-5-sonnet', 1000, 2000)
    expect(cost).toBeCloseTo(0.033, 6)
  })

  it('calculates cost correctly for claude-opus-4-5', () => {
    // costPer1kInput: 0.015, costPer1kOutput: 0.075
    // (1000 * 0.015 + 1000 * 0.075) / 1000 = (15 + 75) / 1000 = 0.09
    const cost = estimateCost('claude-opus-4-5', 1000, 1000)
    expect(cost).toBeCloseTo(0.09, 6)
  })

  it('calculates cost correctly for claude-haiku-4-5', () => {
    // costPer1kInput: 0.0008, costPer1kOutput: 0.004
    // (5000 * 0.0008 + 5000 * 0.004) / 1000 = (4 + 20) / 1000 = 0.024
    const cost = estimateCost('claude-haiku-4-5', 5000, 5000)
    expect(cost).toBeCloseTo(0.024, 6)
  })

  it('returns 0 for zero tokens', () => {
    const cost = estimateCost('claude-3-5-sonnet', 0, 0)
    expect(cost).toBe(0)
  })

  it('calculates cost for input-only tokens', () => {
    // (1000 * 0.003 + 0 * 0.015) / 1000 = 0.003
    const cost = estimateCost('claude-3-5-sonnet', 1000, 0)
    expect(cost).toBeCloseTo(0.003, 6)
  })

  it('calculates cost for output-only tokens', () => {
    // (0 * 0.003 + 1000 * 0.015) / 1000 = 0.015
    const cost = estimateCost('claude-3-5-sonnet', 0, 1000)
    expect(cost).toBeCloseTo(0.015, 6)
  })

  it('premium model (opus) costs more than standard (sonnet) for same tokens', () => {
    const sonnetCost = estimateCost('claude-3-5-sonnet', 1000, 1000)
    const opusCost = estimateCost('claude-opus-4-5', 1000, 1000)
    expect(opusCost).toBeGreaterThan(sonnetCost)
  })

  it('economy model (haiku) costs less than standard (sonnet) for same tokens', () => {
    const sonnetCost = estimateCost('claude-3-5-sonnet', 1000, 1000)
    const haikuCost = estimateCost('claude-haiku-4-5', 1000, 1000)
    expect(haikuCost).toBeLessThan(sonnetCost)
  })
})

describe('getModelsByTier', () => {
  it('returns economy tier models', () => {
    const economy = getModelsByTier('economy')
    expect(economy.length).toBeGreaterThan(0)
    expect(economy).toContain('claude-haiku-4-5')
    expect(economy).toContain('gemini-pro')
    for (const id of economy) {
      expect(MODELS[id].tier).toBe('economy')
    }
  })

  it('returns standard tier models', () => {
    const standard = getModelsByTier('standard')
    expect(standard.length).toBeGreaterThan(0)
    expect(standard).toContain('claude-3-5-sonnet')
    expect(standard).toContain('gpt-4o')
    for (const id of standard) {
      expect(MODELS[id].tier).toBe('standard')
    }
  })

  it('returns premium tier models', () => {
    const premium = getModelsByTier('premium')
    expect(premium.length).toBeGreaterThan(0)
    expect(premium).toContain('claude-opus-4-5')
    for (const id of premium) {
      expect(MODELS[id].tier).toBe('premium')
    }
  })

  it('all tiers combined cover all models', () => {
    const economy = getModelsByTier('economy')
    const standard = getModelsByTier('standard')
    const premium = getModelsByTier('premium')
    const allTierModels = [...economy, ...standard, ...premium]
    expect(allTierModels.length).toBe(MODEL_IDS.length)
  })
})

describe('MODELS', () => {
  it('each model has required fields', () => {
    for (const id of MODEL_IDS) {
      const model = MODELS[id]
      expect(model.name).toBeDefined()
      expect(typeof model.name).toBe('string')
      expect(model.provider).toBeDefined()
      expect(typeof model.provider).toBe('string')
      expect(model.modelId).toBeDefined()
      expect(typeof model.modelId).toBe('string')
      expect(model.maxTokens).toBeDefined()
      expect(typeof model.maxTokens).toBe('number')
      expect(model.maxTokens).toBeGreaterThan(0)
      expect(model.costPer1kInput).toBeDefined()
      expect(typeof model.costPer1kInput).toBe('number')
      expect(model.costPer1kInput).toBeGreaterThanOrEqual(0)
      expect(model.costPer1kOutput).toBeDefined()
      expect(typeof model.costPer1kOutput).toBe('number')
      expect(model.costPer1kOutput).toBeGreaterThanOrEqual(0)
      expect(model.tier).toBeDefined()
      expect(['economy', 'standard', 'premium']).toContain(model.tier)
    }
  })

  it('output cost is higher than input cost for all models', () => {
    for (const id of MODEL_IDS) {
      const model = MODELS[id]
      expect(model.costPer1kOutput).toBeGreaterThan(model.costPer1kInput)
    }
  })
})
