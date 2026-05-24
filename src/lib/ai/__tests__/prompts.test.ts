import { describe, it, expect } from 'vitest'
import {
  buildSystemPromptWithLanguage,
  STYLES,
  STYLE_IDS,
  QUALITY_DIMENSIONS,
} from '../prompts'

// detectLanguage is not exported directly, so we test it indirectly through buildSystemPromptWithLanguage.
// However, we can extract it by testing the output of buildSystemPromptWithLanguage which includes the detected language.

describe('detectLanguage (via buildSystemPromptWithLanguage)', () => {
  it('detects Chinese text', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', '帮我写一篇关于人工智能的文章')
    expect(prompt).toContain('中文')
  })

  it('detects English text', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', 'Write a blog post about machine learning')
    expect(prompt).toContain('English')
  })

  it('detects Japanese text', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', '人工知能についての記事を書いてください')
    expect(prompt).toContain('日本語')
  })

  it('detects Korean text', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', '인공지능에 대한 기사를 작성해 주세요')
    expect(prompt).toContain('한국어')
  })

  it('detects mixed Chinese-English as Chinese (first char match)', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', '请帮我用Python写一个data analysis程序')
    expect(prompt).toContain('中文')
  })

  it('falls back to "other" for non-CJK non-Latin text', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', '1234567890 !@#$%^&*()')
    expect(prompt).toContain('与用户输入相同的语言')
  })
})

describe('buildSystemPromptWithLanguage', () => {
  it('includes style instruction for "concise" style', () => {
    const prompt = buildSystemPromptWithLanguage('concise', 'Write a blog post')
    expect(prompt).toContain('精炼')
    expect(prompt).toContain('去除冗余')
  })

  it('includes style instruction for "detailed" style', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', '写一篇文章')
    expect(prompt).toContain('CO-STAR')
    expect(prompt).toContain('全面补充')
  })

  it('includes style instruction for "creative" style', () => {
    const prompt = buildSystemPromptWithLanguage('creative', 'Write something creative')
    expect(prompt).toContain('创意思维')
    expect(prompt).toContain('发散性')
  })

  it('includes style instruction for "academic" style', () => {
    const prompt = buildSystemPromptWithLanguage('academic', 'Write a research paper')
    expect(prompt).toContain('学术')
    expect(prompt).toContain('严谨')
  })

  it('includes style instruction for "technical" style', () => {
    const prompt = buildSystemPromptWithLanguage('technical', 'Write API docs')
    expect(prompt).toContain('技术文档')
    expect(prompt).toContain('代码示例')
  })

  it('includes style instruction for "business" style', () => {
    const prompt = buildSystemPromptWithLanguage('business', 'Write a business plan')
    expect(prompt).toContain('商务')
    expect(prompt).toContain('结果导向')
  })

  it('includes style instruction for "instruction" style', () => {
    const prompt = buildSystemPromptWithLanguage('instruction', 'Write step by step guide')
    expect(prompt).toContain('指令序列')
    expect(prompt).toContain('动词开头')
  })

  it('includes few-shot examples', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', '写一篇文章')
    expect(prompt).toContain('示例 1')
    expect(prompt).toContain('示例 2')
    expect(prompt).toContain('示例 3')
    expect(prompt).toContain('帮我写一篇关于 AI 的文章')
    expect(prompt).toContain('写一个排序算法')
    expect(prompt).toContain('分析一下我们公司的销售数据')
  })

  it('includes CO-STAR framework in system prompt', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', 'Write a blog')
    expect(prompt).toContain('CO-STAR')
    expect(prompt).toContain('Context')
    expect(prompt).toContain('Objective')
    expect(prompt).toContain('Style')
    expect(prompt).toContain('Tone')
    expect(prompt).toContain('Audience')
    expect(prompt).toContain('Response')
  })

  it('throws for invalid style', () => {
    expect(() => buildSystemPromptWithLanguage('nonexistent' as any, 'test')).toThrow(
      '未知的优化风格'
    )
  })

  it('includes language output instruction', () => {
    const prompt = buildSystemPromptWithLanguage('detailed', '写一篇文章')
    expect(prompt).toContain('输出语言')
    expect(prompt).toContain('与用户输入语言保持一致')
  })
})

describe('STYLES', () => {
  const requiredFields = ['name', 'instruction'] as const

  STYLE_IDS.forEach((styleId) => {
    it(`style "${styleId}" has required fields (name, instruction)`, () => {
      const style = STYLES[styleId]
      expect(style).toBeDefined()
      for (const field of requiredFields) {
        expect(style![field]).toBeDefined()
        expect(typeof style![field]).toBe('string')
        expect((style![field] as string).length).toBeGreaterThan(0)
      }
    })
  })

  it('contains exactly 7 styles', () => {
    expect(STYLE_IDS.length).toBe(7)
  })

  it('contains expected style IDs', () => {
    expect(STYLE_IDS).toContain('concise')
    expect(STYLE_IDS).toContain('detailed')
    expect(STYLE_IDS).toContain('creative')
    expect(STYLE_IDS).toContain('academic')
    expect(STYLE_IDS).toContain('technical')
    expect(STYLE_IDS).toContain('business')
    expect(STYLE_IDS).toContain('instruction')
  })
})

describe('QUALITY_DIMENSIONS', () => {
  it('contains 5 dimensions', () => {
    expect(QUALITY_DIMENSIONS.length).toBe(5)
  })

  it('each dimension has name, description, and weight', () => {
    for (const dim of QUALITY_DIMENSIONS) {
      expect(dim.name).toBeDefined()
      expect(typeof dim.name).toBe('string')
      expect(dim.description).toBeDefined()
      expect(typeof dim.description).toBe('string')
      expect(dim.weight).toBeDefined()
      expect(typeof dim.weight).toBe('number')
      expect(dim.weight).toBeGreaterThan(0)
      expect(dim.weight).toBeLessThanOrEqual(1)
    }
  })

  it('weights sum to 1.0', () => {
    const totalWeight = QUALITY_DIMENSIONS.reduce((sum, dim) => sum + dim.weight, 0)
    expect(totalWeight).toBeCloseTo(1.0, 10)
  })
})
