'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { PromptEditor } from '@/components/optimize/PromptEditor'
import { OptimizationResult } from '@/components/optimize/OptimizationResult'
import { ModelSelector } from '@/components/optimize/ModelSelector'
import { StyleSelector } from '@/components/optimize/StyleSelector'
import { useStreamOptimize } from '@/hooks/useStreamOptimize'
import { useUsage } from '@/hooks/useUsage'
import { useSubscription } from '@/hooks/useSubscription'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import type { ModelId } from '@/lib/ai/models'
import type { Style } from '@/lib/ai/prompts'

const FREE_DAILY_LIMIT = 10

export default function OptimizePage() {
  const [model, setModel] = useState<ModelId>('claude-3-5-sonnet')
  const [style, setStyle] = useState<Style>('detailed')
  const stream = useStreamOptimize()
  const { usage, mutate: mutateUsage } = useUsage()
  const { subscription } = useSubscription()
  const { toast } = useToast()
  const prevDoneRef = useRef(false)

  // Show toast when optimization completes
  useEffect(() => {
    if (stream.done && !prevDoneRef.current) {
      const totalTokens = stream.tokensInput + stream.tokensOutput
      const latencySec = (stream.latencyMs / 1000).toFixed(1)
      toast({
        title: '优化完成',
        description: `消耗 ${totalTokens.toLocaleString('zh-CN')} tokens，耗时 ${latencySec} 秒`,
      })
      // Refresh usage stats
      mutateUsage()
    }
    prevDoneRef.current = stream.done
  }, [stream.done, stream.tokensInput, stream.tokensOutput, stream.latencyMs, toast, mutateUsage])

  const handleOptimize = useCallback(
    async (prompt: string) => {
      await stream.optimize(prompt, model, style)
    },
    [stream, model, style]
  )

  const handleAbort = useCallback(() => {
    stream.abort()
  }, [stream])

  const isFreePlan = subscription.plan === 'free'
  const remainingQuota = isFreePlan
    ? Math.max(0, FREE_DAILY_LIMIT - usage.totalOptimizations)
    : null

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-surface-50 mb-1">提示词优化</h1>
          <p className="text-sm text-surface-400">
            输入你的原始提示词，AI 会自动分析并优化
          </p>
        </div>
        {/* Quota display */}
        {isFreePlan && (
          <Badge variant={remainingQuota === 0 ? 'destructive' : 'secondary'}>
            今日已使用 {usage.totalOptimizations}/{FREE_DAILY_LIMIT} 次
          </Badge>
        )}
        {!isFreePlan && usage.totalOptimizations > 0 && (
          <Badge variant="secondary">
            今日已使用 {usage.totalOptimizations} 次
          </Badge>
        )}
      </div>

      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <ModelSelector value={model} onChange={setModel} />
        <StyleSelector value={style} onChange={setStyle} />
      </div>

      {/* Main content: editor + result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PromptEditor
          onOptimize={handleOptimize}
          isPending={stream.isStreaming}
          onAbort={handleAbort}
        />
        <OptimizationResult
          content={stream.content}
          isStreaming={stream.isStreaming}
          isDone={stream.done}
          error={stream.error}
          tokensInput={stream.tokensInput}
          tokensOutput={stream.tokensOutput}
          latencyMs={stream.latencyMs}
          model={model}
        />
      </div>
    </div>
  )
}
