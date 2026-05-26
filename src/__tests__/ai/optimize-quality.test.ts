import { describe, it, expect } from 'vitest'
import { assessInputQuality } from '@/lib/ai/optimize'

describe('assessInputQuality', () => {
  it('极短输入（< 10 字符）得分低且包含「输入过短」问题', () => {
    // Arrange
    const input = '写代码'

    // Act
    const result = assessInputQuality(input)

    // Assert
    expect(result.score).toBeLessThan(80)
    expect(result.issues).toContain('输入过短，信息量不足')
  })

  it('包含任务动词的输入比不包含的得分更高', () => {
    // Arrange - withoutVerb 必须不包含任何任务动词（写/生成/分析/翻译/总结 等）
    const withVerb = '写一篇关于人工智能发展趋势的详细报告，包括技术突破和未来展望'
    const withoutVerb = '一篇关于人工智能发展趋势的详细报告，包括技术突破和未来展望'

    // Act
    const scoreWithVerb = assessInputQuality(withVerb)
    const scoreWithoutVerb = assessInputQuality(withoutVerb)

    // Assert
    expect(scoreWithVerb.score).toBeGreaterThan(scoreWithoutVerb.score)
  })

  it('包含角色设定的输入得分更高', () => {
    // Arrange
    const withRole = '你是一位资深数据分析师，请分析以下销售数据的趋势和异常情况并给出详细建议'
    const withoutRole = '请分析以下销售数据的趋势和异常情况并给出详细建议'

    // Act
    const scoreWithRole = assessInputQuality(withRole)
    const scoreWithoutRole = assessInputQuality(withoutRole)

    // Assert
    expect(scoreWithRole.score).toBeGreaterThan(scoreWithoutRole.score)
  })

  it('包含格式规范的输入得分更高', () => {
    // Arrange
    const withFormat = '你是一位资深数据分析师，请分析以下销售数据的趋势并以表格格式展示结果和详细建议报告'
    const withoutFormat = '你是一位资深数据分析师，请分析以下销售数据的趋势并给出结果和详细建议报告'

    // Act
    const scoreWithFormat = assessInputQuality(withFormat)
    const scoreWithoutFormat = assessInputQuality(withoutFormat)

    // Assert
    expect(scoreWithFormat.score).toBeGreaterThan(scoreWithoutFormat.score)
  })

  it('长文本无换行会触发「未使用结构化格式」问题', () => {
    // Arrange: need > 100 chars without newlines, without format keywords, without task verbs
    const input = '一篇关于技术发展趋势的详细报告，包括当前的技术突破和未来的应用场景以及行业的整体变化趋势和各种不同的发展方向'.repeat(2)

    // Act
    const result = assessInputQuality(input)

    // Assert
    expect(result.issues).toContain('长文本未使用结构化格式')
  })

  it('长且结构良好的输入（含换行、任务动词、格式）得分高（> 80）', () => {
    // Arrange
    const input = `你是一位资深技术架构师

请分析以下微服务架构的设计方案：

## 任务
评估系统的可扩展性和可靠性

## 要求
1. 分析各服务间的依赖关系
2. 识别潜在的单点故障
3. 给出优化建议

## 输出格式
使用 Markdown 表格对比改进前后的效果`

    // Act
    const result = assessInputQuality(input)

    // Assert
    expect(result.score).toBeGreaterThan(80)
  })

  it('得分始终在 0 到 100 之间', () => {
    // Arrange - 测试各种边界输入
    const inputs = [
      '',
      '短',
      '写代码',
      '你是一位资深数据分析师，请分析销售数据并以表格格式展示结果，目标是找出增长趋势',
      '分析一下'.repeat(100),
    ]

    // Act & Assert
    for (const input of inputs) {
      const result = assessInputQuality(input)
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    }
  })

  it('质量差的输入返回非空的 issues 和 suggestions 数组', () => {
    // Arrange - 极短的模糊输入
    const input = '一些'

    // Act
    const result = assessInputQuality(input)

    // Assert
    expect(result.issues.length).toBeGreaterThan(0)
    expect(result.suggestions.length).toBeGreaterThan(0)
  })
})
