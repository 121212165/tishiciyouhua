'use client'

import { useState, useCallback } from 'react'
import { PromptEditor } from '@/components/optimize/PromptEditor'
import { OptimizationResult } from '@/components/optimize/OptimizationResult'
import { ModelSelector } from '@/components/optimize/ModelSelector'
import { StyleSelector } from '@/components/optimize/StyleSelector'
import { useStreamOptimize } from '@/hooks/useStreamOptimize'
import type { ModelId } from '@/lib/ai/models'
import type { Style } from '@/lib/ai/prompts'

export default function OptimizePage() {
  const [model, setModel] = useState<ModelId>('claude-3-5-sonnet')
  const [style, setStyle] = useState<Style>('detailed')
  const stream = useStreamOptimize()

  const handleOptimize = useCallback(
    async (prompt: string) => {
      await stream.optimize(prompt, model, style)
    },
    [stream, model, style]
  )

  const handleAbort = useCallback(() => {
    stream.abort()
  }, [stream])

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
