import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { rateLimit } from '@/lib/rate-limit'

// rate-limit.ts 使用模块级 Map 存储状态，无法直接清空。
// 为避免测试间状态干扰，每个测试用唯一的 identifier。
let idCounter = 0
function uniqueId(): string {
  return `test-${++idCounter}-${Date.now()}`
}

describe('rateLimit', () => {
  it('首次请求成功', () => {
    // Arrange
    const id = uniqueId()

    // Act
    const result = rateLimit(id, 5, 60_000)

    // Assert
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('返回正确的剩余次数', () => {
    // Arrange
    const id = uniqueId()
    const limit = 3

    // Act - 发送 2 次请求
    rateLimit(id, limit, 60_000)
    rateLimit(id, limit, 60_000)
    const result = rateLimit(id, limit, 60_000)

    // Assert
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(0)
  })

  it('超出限制后返回 success: false', () => {
    // Arrange
    const id = uniqueId()
    const limit = 2

    // Act - 发送超过限制的请求
    rateLimit(id, limit, 60_000)
    rateLimit(id, limit, 60_000)
    const result = rateLimit(id, limit, 60_000)

    // Assert
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('窗口过期后请求重新成功', () => {
    // Arrange
    const id = uniqueId()
    const limit = 1
    const windowMs = 100 // 100ms 短窗口

    // Act - 触发限制
    rateLimit(id, limit, windowMs)
    const blocked = rateLimit(id, limit, windowMs)
    expect(blocked.success).toBe(false)

    // 等待窗口过期后重新请求
    const start = Date.now()
    while (Date.now() - start < windowMs + 10) {
      // busy wait
    }
    const afterExpiry = rateLimit(id, limit, windowMs)

    // Assert
    expect(afterExpiry.success).toBe(true)
    expect(afterExpiry.remaining).toBe(limit - 1)
  })

  it('不同 identifier 有独立的限制', () => {
    // Arrange
    const id1 = uniqueId()
    const id2 = uniqueId()
    const limit = 1

    // Act - id1 触发限制
    rateLimit(id1, limit, 60_000)
    const blocked = rateLimit(id1, limit, 60_000)
    expect(blocked.success).toBe(false)

    // id2 应该仍然可用
    const result = rateLimit(id2, limit, 60_000)

    // Assert
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(0)
  })

  it('默认参数下 limit 为 10，窗口为 60 秒', () => {
    // Arrange
    const id = uniqueId()

    // Act
    const result = rateLimit(id)

    // Assert
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(9)
  })

  it('每次请求 remaining 递减', () => {
    // Arrange
    const id = uniqueId()
    const limit = 5

    // Act & Assert
    for (let i = 0; i < limit; i++) {
      const result = rateLimit(id, limit, 60_000)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(limit - 1 - i)
    }
  })
})
