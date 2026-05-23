'use client'

import { useState } from 'react'
import { STRIPE_PLANS } from '@/lib/stripe'
import type { PlanId } from '@/lib/stripe'
import { createCheckoutSession } from '@/app/actions/subscription'

interface PricingCardsProps {
  currentPlan: PlanId
}

const CHECKING_OUT: Record<string, boolean> = {}

export default function PricingCards({ currentPlan }: PricingCardsProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return

    setLoadingPlan(planId)
    try {
      await createCheckoutSession(planId as 'pro_monthly' | 'pro_yearly')
    } catch {
      // redirect 抛出的不算错误，其他错误在这里处理
    } finally {
      setLoadingPlan(null)
    }
  }

  const planEntries = Object.entries(STRIPE_PLANS) as [PlanId, typeof STRIPE_PLANS.free][]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {planEntries.map(([planId, plan]) => {
        const isCurrent = planId === currentPlan
        const isPaid = planId !== 'free'
        const isLoading = loadingPlan === planId

        return (
          <div
            key={planId}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              isCurrent
                ? 'border-primary-500 bg-primary-500/5'
                : 'border-surface-800 bg-surface-900'
            }`}
          >
            {planId === 'pro_yearly' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  省 33%
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-surface-100">{plan.name}</h3>
              <div className="mt-2">
                {plan.price === 0 ? (
                  <span className="text-2xl font-bold text-surface-50">免费</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-surface-50">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-surface-500">
                      /{planId === 'pro_yearly' ? '年' : '月'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <ul className="flex-1 space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-surface-300">
                  <svg
                    className="w-4 h-4 mt-0.5 text-primary-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {isCurrent ? (
              <button
                disabled
                className="w-full rounded-xl bg-surface-700 px-4 py-2.5 text-sm font-medium text-surface-400 cursor-default"
              >
                当前方案
              </button>
            ) : isPaid ? (
              <button
                onClick={() => handleUpgrade(planId)}
                disabled={isLoading}
                className="w-full rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '处理中...' : '立即升级'}
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-xl border border-surface-700 px-4 py-2.5 text-sm font-medium text-surface-400"
              >
                免费使用
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
