import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export type PlanId = 'free' | 'pro_monthly' | 'pro_yearly'

export interface PlanConfig {
  name: string
  price: number
  priceId: string
  features: readonly string[]
  limits: {
    dailyOptimizations: number
    models: readonly string[]
  }
}

export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: '',
    features: ['每日 10 次优化', 'Claude 模型', '7 天历史记录'],
    limits: { dailyOptimizations: 10, models: ['claude-3-5-sonnet'] },
  },
  pro_monthly: {
    name: 'Pro 月付',
    price: 9.9,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
    features: ['无限优化', '全部模型', '完整模板库', '永久历史'],
    limits: {
      dailyOptimizations: Infinity,
      models: ['claude-3-5-sonnet', 'gpt-4o', 'gemini-pro'],
    },
  },
  pro_yearly: {
    name: 'Pro 年付',
    price: 79,
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
    features: ['无限优化', '全部模型', '完整模板库', '永久历史', '省 33%'],
    limits: {
      dailyOptimizations: Infinity,
      models: ['claude-3-5-sonnet', 'gpt-4o', 'gemini-pro'],
    },
  },
} as const satisfies Record<PlanId, PlanConfig>
