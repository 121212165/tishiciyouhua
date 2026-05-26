import { describe, it, expect, vi, beforeEach } from 'vitest'

// 在 import checkQuota 之前 mock supabase server 模块
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { checkQuota } from '@/lib/quota'
import { createClient } from '@/lib/supabase/server'

const mockCreateClient = vi.mocked(createClient)

/**
 * 构建 mock Supabase client，支持链式调用。
 * @param profileData - profiles 查询返回的数据
 * @param usageCount - usage_records 查询返回的 count
 * @param usageError - usage_records 查询返回的错误
 */
function buildMockSupabase(
  profileData: { plan: string } | null,
  usageCount: number | null,
  usageError: object | null = null
) {
  const mockClient = {
    from: vi.fn((table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: profileData }),
        }
      }
      if (table === 'usage_records') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockResolvedValue({
            count: usageCount,
            error: usageError,
          }),
        }
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      }
    }),
  }

  return mockClient
}

describe('checkQuota', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('付费用户始终允许，剩余次数无限', async () => {
    // Arrange
    const mockSupabase = buildMockSupabase({ plan: 'pro' }, null)
    mockCreateClient.mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

    // Act
    const result = await checkQuota('user-pro-1')

    // Assert
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(Infinity)
    expect(result.limit).toBe(Infinity)
  })

  it('免费用户今日用量为 0 时允许，剩余 10 次', async () => {
    // Arrange
    const mockSupabase = buildMockSupabase({ plan: 'free' }, 0)
    mockCreateClient.mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

    // Act
    const result = await checkQuota('user-free-1')

    // Assert
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(10)
    expect(result.used).toBe(0)
    expect(result.limit).toBe(10)
  })

  it('免费用户今日用量为 10 时不允许，剩余 0 次', async () => {
    // Arrange
    const mockSupabase = buildMockSupabase({ plan: 'free' }, 10)
    mockCreateClient.mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

    // Act
    const result = await checkQuota('user-free-2')

    // Assert
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.used).toBe(10)
    expect(result.limit).toBe(10)
  })

  it('免费用户今日用量为 5 时允许，剩余 5 次', async () => {
    // Arrange
    const mockSupabase = buildMockSupabase({ plan: 'free' }, 5)
    mockCreateClient.mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

    // Act
    const result = await checkQuota('user-free-3')

    // Assert
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(5)
    expect(result.used).toBe(5)
    expect(result.limit).toBe(10)
  })

  it('数据库错误时 fail open，允许请求', async () => {
    // Arrange
    const mockSupabase = buildMockSupabase({ plan: 'free' }, null, { message: 'connection timeout' })
    mockCreateClient.mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

    // Act
    const result = await checkQuota('user-error-1')

    // Assert
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(10)
    expect(result.limit).toBe(10)
  })

  it('profiles 查询返回 null 时视为免费用户', async () => {
    // Arrange
    const mockSupabase = buildMockSupabase(null, 3)
    mockCreateClient.mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>)

    // Act
    const result = await checkQuota('user-unknown-1')

    // Assert
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(7)
    expect(result.used).toBe(3)
  })
})
