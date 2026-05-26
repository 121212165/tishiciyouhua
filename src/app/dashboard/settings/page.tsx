'use client'

import { useUser } from '@/hooks/useUser'
import { useSubscription } from '@/hooks/useSubscription'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

const PLAN_LABELS: Record<string, string> = {
  free: '免费版',
  pro: '专业版',
  enterprise: '企业版',
}

const PLAN_COLORS: Record<string, string> = {
  free: 'secondary',
  pro: 'default',
  enterprise: 'default',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '--'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export default function SettingsPage() {
  const { data: user, isLoading: userLoading } = useUser()
  const { subscription, isLoading: subLoading } = useSubscription()

  const isLoading = userLoading || subLoading

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-50 mb-1">设置</h1>
        <p className="text-sm text-surface-400">管理你的账号和偏好</p>
      </div>

      {/* Profile */}
      <section className="card">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">个人信息</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">
              邮箱
            </label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <input
                type="email"
                disabled
                value={user?.email ?? '--'}
                className="input-field opacity-60 cursor-not-allowed"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">
              显示名称
            </label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <input
                type="text"
                placeholder="设置显示名称"
                defaultValue={
                  user?.profile?.display_name ?? ''
                }
                className="input-field"
              />
            )}
          </div>
          <Button variant="default" size="sm" disabled>
            保存（即将支持）
          </Button>
        </div>
      </section>

      {/* Subscription */}
      <section className="card">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">
          订阅管理
        </h2>

        {subLoading ? (
          <div className="space-y-3 max-w-md">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-10 w-28" />
          </div>
        ) : (
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-3">
              <span className="text-sm text-surface-200">当前计划：</span>
              <Badge
                variant={
                  (PLAN_COLORS[subscription.plan] as 'default' | 'secondary') ??
                  'secondary'
                }
              >
                {PLAN_LABELS[subscription.plan] ?? subscription.plan}
              </Badge>
              <Badge variant="outline" className="text-surface-400 border-surface-600">
                {subscription.status === 'active' ? '生效中' : subscription.status}
              </Badge>
            </div>

            {subscription.current_period_end && (
              <p className="text-sm text-surface-400">
                到期时间：{formatDate(subscription.current_period_end)}
              </p>
            )}

            <Separator className="bg-surface-700" />

            <div className="flex items-center gap-3">
              {subscription.plan === 'free' ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    // TODO: redirect to pricing / checkout
                    window.location.href = '/dashboard#pricing'
                  }}
                >
                  升级计划
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // TODO: redirect to Stripe customer portal
                    window.location.href = '/api/stripe/portal'
                  }}
                >
                  管理订阅
                </Button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Preferences */}
      <section className="card">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">偏好设置</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">
              默认模型
            </label>
            <select className="input-field" disabled>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </select>
            <p className="mt-1 text-xs text-surface-500">更多模型即将支持</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">
              默认优化风格
            </label>
            <select className="input-field" disabled>
              <option value="detailed">详细</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  )
}
