'use client'

import { useState, useCallback } from 'react'
import { PromptEditor } from '@/components/optimize/PromptEditor'
import { OptimizationResult } from '@/components/optimize/OptimizationResult'
import { ModelSelector } from '@/components/optimize/ModelSelector'
import { StyleSelector } from '@/components/optimize/StyleSelector'
import type { OptimizeActionState } from '@/app/actions/optimize'
import type { ModelId } from '@/lib/ai/models'
import type { Style } from '@/lib/ai/prompts'

export default function OptimizePage() {
  const [model, setModel] = useState<ModelId>('claude-3-5-sonnet')
  const [style, setStyle] = useState<Style>('detailed')
  const [result, setResult] = useState<OptimizeActionState | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleOptimize = useCallback(
    async (prompt: string) => {
      setIsPending(true)
      setResult(null)

      try {
        const response = await fetch('/api/optimize', {
          method: 'POST',
          body: JSON.stringify({ prompt, model, style }),
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await response.json()

        if (!response.ok) {
          setResult({ success: false, error: data.error || '优化失败，请重试' })
          return
        }

        setResult(data as OptimizeActionState)
      } catch {
        setResult({ success: false, error: '网络错误，请检查连接后重试' })
      } finally {
        setIsPending(false)
      }
    },
    [model, style]
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-50 mb-1">提示词优化</h1>
        <p className="text-sm text-surface-400">
          输入你的原始提示词，AI 会自动分析并优化
        </p>
      </div>

      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <ModelSelector value={model} onChange={setModel} />
        <StyleSelector value={style} onChange={setStyle} />
      </div>

      {/* Main content: editor + result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PromptEditor onOptimize={handleOptimize} isPending={isPending} />
        <OptimizationResult result={result} isPending={isPending} />
      </div>
    </div>
  )
}
