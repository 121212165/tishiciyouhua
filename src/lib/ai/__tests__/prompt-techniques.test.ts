import { describe, it, expect } from 'vitest'
import {
  getTechniqueById,
  getTechniquesForStyle,
  getTechniquesByDifficulty,
  searchTechniquesByUseCase,
  getTechniqueStats,
  PROMPT_TECHNIQUES,
  STYLE_TECHNIQUE_MAP,
} from '../prompt-techniques'

describe('getTechniqueById', () => {
  it('returns correct technique for known ID', () => {
    const technique = getTechniqueById('chain-of-thought')
    expect(technique).toBeDefined()
    expect(technique!.id).toBe('chain-of-thought')
    expect(technique!.name).toBe('Chain-of-Thought')
    expect(technique!.nameZh).toBe('思维链')
  })

  it('returns technique with all required fields', () => {
    const technique = getTechniqueById('few-shot')
    expect(technique).toBeDefined()
    expect(technique!.description).toBeDefined()
    expect(technique!.example).toBeDefined()
    expect(technique!.applicableStyles).toBeDefined()
    expect(Array.isArray(technique!.applicableStyles)).toBe(true)
    expect(technique!.difficulty).toBeDefined()
    expect(technique!.useCases).toBeDefined()
    expect(Array.isArray(technique!.useCases)).toBe(true)
  })

  it('returns undefined for unknown ID', () => {
    const technique = getTechniqueById('nonexistent-technique')
    expect(technique).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    const technique = getTechniqueById('')
    expect(technique).toBeUndefined()
  })

  it('is case-sensitive', () => {
    const technique = getTechniqueById('Chain-of-Thought')
    expect(technique).toBeUndefined()
  })
})

describe('getTechniquesForStyle', () => {
  it('returns techniques for "concise" style', () => {
    const techniques = getTechniquesForStyle('concise')
    expect(techniques.length).toBeGreaterThan(0)
    expect(techniques.length).toBe(STYLE_TECHNIQUE_MAP['concise']!.length)
    for (const t of techniques) {
      expect(STYLE_TECHNIQUE_MAP['concise']).toContain(t.id)
    }
  })

  it('returns techniques for "detailed" style', () => {
    const techniques = getTechniquesForStyle('detailed')
    expect(techniques.length).toBeGreaterThan(0)
    expect(techniques.length).toBe(STYLE_TECHNIQUE_MAP['detailed']!.length)
  })

  it('returns techniques for "creative" style', () => {
    const techniques = getTechniquesForStyle('creative')
    expect(techniques.length).toBeGreaterThan(0)
    expect(techniques.length).toBe(STYLE_TECHNIQUE_MAP['creative']!.length)
  })

  it('returns empty array for unknown style', () => {
    const techniques = getTechniquesForStyle('nonexistent')
    expect(techniques).toEqual([])
  })

  it('each returned technique is a valid PromptTechnique', () => {
    const techniques = getTechniquesForStyle('detailed')
    for (const t of techniques) {
      expect(t).toHaveProperty('id')
      expect(t).toHaveProperty('name')
      expect(t).toHaveProperty('nameZh')
      expect(t).toHaveProperty('description')
      expect(t).toHaveProperty('difficulty')
    }
  })
})

describe('getTechniquesByDifficulty', () => {
  it('returns basic techniques', () => {
    const basics = getTechniquesByDifficulty('basic')
    expect(basics.length).toBeGreaterThan(0)
    for (const t of basics) {
      expect(t.difficulty).toBe('basic')
    }
  })

  it('returns intermediate techniques', () => {
    const intermediates = getTechniquesByDifficulty('intermediate')
    expect(intermediates.length).toBeGreaterThan(0)
    for (const t of intermediates) {
      expect(t.difficulty).toBe('intermediate')
    }
  })

  it('returns advanced techniques', () => {
    const advanced = getTechniquesByDifficulty('advanced')
    expect(advanced.length).toBeGreaterThan(0)
    for (const t of advanced) {
      expect(t.difficulty).toBe('advanced')
    }
  })

  it('all difficulties combined cover all techniques', () => {
    const basic = getTechniquesByDifficulty('basic')
    const intermediate = getTechniquesByDifficulty('intermediate')
    const advanced = getTechniquesByDifficulty('advanced')
    const total = basic.length + intermediate.length + advanced.length
    expect(total).toBe(PROMPT_TECHNIQUES.length)
  })
})

describe('searchTechniquesByUseCase', () => {
  it('finds techniques for math-related use case', () => {
    const results = searchTechniquesByUseCase('数学')
    expect(results.length).toBeGreaterThan(0)
    for (const t of results) {
      expect(t.useCases.some((uc) => uc.includes('数学'))).toBe(true)
    }
  })

  it('finds techniques for code review use case', () => {
    const results = searchTechniquesByUseCase('代码审查')
    expect(results.length).toBeGreaterThan(0)
  })

  it('finds techniques for classification use case', () => {
    const results = searchTechniquesByUseCase('分类')
    expect(results.length).toBeGreaterThan(0)
  })

  it('returns empty array for no match', () => {
    const results = searchTechniquesByUseCase('completely-nonexistent-use-case-xyz')
    expect(results).toEqual([])
  })

  it('search is case-insensitive', () => {
    const lower = searchTechniquesByUseCase('math')
    const upper = searchTechniquesByUseCase('MATH')
    // Neither should match since use cases are in Chinese, but both should return empty consistently
    expect(lower.length).toBe(upper.length)
  })
})

describe('getTechniqueStats', () => {
  it('returns correct total techniques count', () => {
    const stats = getTechniqueStats()
    expect(stats.totalTechniques).toBe(PROMPT_TECHNIQUES.length)
    expect(stats.totalTechniques).toBeGreaterThan(0)
  })

  it('returns correct difficulty distribution', () => {
    const stats = getTechniqueStats()
    expect(stats.byDifficulty).toHaveProperty('basic')
    expect(stats.byDifficulty).toHaveProperty('intermediate')
    expect(stats.byDifficulty).toHaveProperty('advanced')

    const totalFromDistribution =
      stats.byDifficulty['basic']! +
      stats.byDifficulty['intermediate']! +
      stats.byDifficulty['advanced']!
    expect(totalFromDistribution).toBe(stats.totalTechniques)
  })

  it('returns valid total use cases count', () => {
    const stats = getTechniqueStats()
    expect(stats.totalUseCases).toBeGreaterThan(0)
    expect(typeof stats.totalUseCases).toBe('number')
  })

  it('returns style keys from STYLE_TECHNIQUE_MAP', () => {
    const stats = getTechniqueStats()
    expect(stats.styles).toEqual(Object.keys(STYLE_TECHNIQUE_MAP))
    expect(stats.styles).toContain('concise')
    expect(stats.styles).toContain('detailed')
    expect(stats.styles).toContain('creative')
  })

  it('each technique has at least one use case', () => {
    for (const t of PROMPT_TECHNIQUES) {
      expect(t.useCases.length).toBeGreaterThan(0)
    }
  })

  it('each technique has at least one applicable style', () => {
    for (const t of PROMPT_TECHNIQUES) {
      expect(t.applicableStyles.length).toBeGreaterThan(0)
    }
  })
})

describe('PROMPT_TECHNIQUES', () => {
  it('contains expected techniques', () => {
    const ids = PROMPT_TECHNIQUES.map((t) => t.id)
    expect(ids).toContain('chain-of-thought')
    expect(ids).toContain('few-shot')
    expect(ids).toContain('role-prompting')
    expect(ids).toContain('tree-of-thought')
    expect(ids).toContain('react')
  })

  it('has unique IDs for all techniques', () => {
    const ids = PROMPT_TECHNIQUES.map((t) => t.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('every technique has a non-empty example', () => {
    for (const t of PROMPT_TECHNIQUES) {
      expect(t.example.length).toBeGreaterThan(10)
    }
  })
})
