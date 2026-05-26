'use client'

import useSWR from 'swr'

interface UsageStats {
  totalOptimizations: number
  tokensInput: number
  tokensOutput: number
  totalTokens: number
  totalCostCents: number
}

const DEFAULT_USAGE: UsageStats = {
  totalOptimizations: 0,
  tokensInput: 0,
  tokensOutput: 0,
  totalTokens: 0,
  totalCostCents: 0,
}

const fetcher = async (url: string): Promise<UsageStats> => {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? '获取用量失败')
  }
  return res.json()
}

export function useUsage() {
  const { data, error, isLoading, mutate } = useSWR<UsageStats>(
    '/api/usage',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  )

  return {
    usage: data ?? DEFAULT_USAGE,
    isLoading,
    error,
    mutate,
  }
}
