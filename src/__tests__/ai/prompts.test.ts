import { describe, it, expect } from 'vitest'
import { STYLES, buildSystemPromptWithLanguage, type Style } from '@/lib/ai/prompts'

describe('STYLES', () => {
  it('包含所有预期的风格 key', () => {
    const expectedStyles = ['concise', 'detailed', 'creative', 'academic', 'technical', 'business', 'instruction']

    for (const style of expectedStyles) {
      expect(STYLES).toHaveProperty(style)
    }
    expect(Object.keys(STYLES)).toHaveLength(7)
  })

  it('每个风格都有 name 和 instruction 字段', () => {
    for (const [key, config] of Object.entries(STYLES)) {
      expect(config).toHaveProperty('name')
      expect(config).toHaveProperty('instruction')
      expect(typeof config.name).toBe('string')
      expect(typeof config.instruction).toBe('string')
      expect(config.name.length).toBeGreaterThan(0)
      expect(config.instruction.length).toBeGreaterThan(0)
    }
  })
})

describe('buildSystemPromptWithLanguage', () => {
  const allStyles = Object.keys(STYLES) as Style[]

  it.each(allStyles)('对风格 "%s" 返回非空字符串', (style) => {
    // Act
    const result = buildSystemPromptWithLanguage(style, '写一篇关于机器学习的文章')

    // Assert
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('输出包含风格的 instruction 内容', () => {
    // Arrange
    const input = '写一篇关于人工智能的文章'

    // Act
    const result = buildSystemPromptWithLanguage('detailed', input)

    // Assert - 应包含详细风格的 instruction（而非 name）
    expect(result).toContain(STYLES.detailed.instruction)
  })

  it('输出包含风格的完整配置', () => {
    // Arrange & Act - 验证每个风格的 instruction 都出现在输出中
    for (const [key, config] of Object.entries(STYLES)) {
      const result = buildSystemPromptWithLanguage(key as Style, '写一篇关于AI的文章')
      expect(result).toContain(config.instruction)
    }
  })

  it('输出包含参考示例中的示例输入', () => {
    // Arrange - buildSystemPromptWithLanguage 使用固定的 few-shot 示例
    const input = '写一篇关于人工智能的文章'

    // Act
    const result = buildSystemPromptWithLanguage('detailed', input)

    // Assert - 应包含 few-shot 示例中的用户输入
    expect(result).toContain('帮我写一篇关于 AI 的文章')
  })

  it('输出长度大于输入长度', () => {
    // Arrange
    const input = '写一篇关于气候变化的文章'

    // Act
    const result = buildSystemPromptWithLanguage('detailed', input)

    // Assert
    expect(result.length).toBeGreaterThan(input.length)
  })

  it('中文输入触发中文输出语言设定', () => {
    // Arrange
    const input = '写一篇关于人工智能的文章'

    // Act
    const result = buildSystemPromptWithLanguage('concise', input)

    // Assert
    expect(result).toContain('中文')
  })

  it('英文输入触发英文输出语言设定', () => {
    // Arrange
    const input = 'Write an article about artificial intelligence'

    // Act
    const result = buildSystemPromptWithLanguage('concise', input)

    // Assert
    expect(result).toContain('English')
  })

  it('输出包含 CO-STAR 框架相关内容', () => {
    // Arrange
    const input = '分析销售数据'

    // Act
    const result = buildSystemPromptWithLanguage('detailed', input)

    // Assert
    expect(result).toContain('CO-STAR')
  })

  it('输出包含参考示例', () => {
    // Arrange
    const input = '写一篇关于AI的文章'

    // Act
    const result = buildSystemPromptWithLanguage('detailed', input)

    // Assert
    expect(result).toContain('示例')
  })
})
