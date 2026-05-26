'use client'

import useSWR from 'swr'
import type { Optimization } from '@/types/database'

interface HistoryResponse {
  records: Optimization[]
  total: number
}

interface UseHistoryOptions {
  page?: number
  limit?: number
}

const fetcher = async (url: string): Promise<HistoryResponse> => {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? '加载历史记录失败')
  }
  return res.json()
}

export function useHistory(options: UseHistoryOptions = {}) {
  const { page = 1, limit = 20 } = options

  const { data, error, isLoading, mutate } = useSWR<HistoryResponse>(
    `/api/history?page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    records: data?.records ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
  }
}
