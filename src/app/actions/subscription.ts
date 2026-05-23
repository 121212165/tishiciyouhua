'use server'

import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PLANS } from '@/lib/stripe'
import type { PlanId } from '@/lib/stripe'
import { redirect } from 'next/navigation'

type PaidPlanId = Exclude<PlanId, 'free'>

export async function createCheckoutSession(planId: PaidPlanId) {
  const user = await requireAuth()
  const supabase = await createClient()

  const plan = STRIPE_PLANS[planId]
  if (!plan.priceId) throw new Error('无效的套餐')

  // 获取或创建 Stripe customer
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = sub?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    })
    customerId = customer.id

    // 保存 customer ID
    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      plan: 'free',
      status: 'active',
    })
  }

  // 创建 Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
    metadata: { userId: user.id, planId },
  })

  redirect(session.url!)
}

export async function createPortalSession() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!sub?.stripe_customer_id) throw new Error('未找到订阅信息')

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  })

  redirect(portalSession.url)
}
