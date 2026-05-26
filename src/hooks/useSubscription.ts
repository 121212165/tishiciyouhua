'use client'

import useSWR from 'swr'
import type { Plan } from '@/types/database'

interface SubscriptionInfo {
  plan: Plan
  status: string
  current_period_end: string | null
}

const DEFAULT_SUBSCRIPTION: SubscriptionInfo = {
  plan: 'free',
  status: 'active',
  current_period_end: null,
}

const fetcher = async (url: string): Promise<SubscriptionInfo> => {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? '加载订阅信息失败')
  }
  return res.json()
}

export function useSubscription() {
  const { data, error, isLoading, mutate } = useSWR<SubscriptionInfo>(
    '/api/subscription',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  )

  return {
    subscription: data ?? DEFAULT_SUBSCRIPTION,
    isLoading,
    error,
    mutate,
  }
}
