'use client'

import { useState, useCallback } from 'react'
import type { OptimizeActionState } from '@/app/actions/optimize'

interface OptimizationResultProps {
  result: OptimizeActionState | null
  isPending: boolean
}

const MODEL_LABELS: Record<string, string> = {
  'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
  'gpt-4o': 'GPT-4o',
  'gemini-pro': 'Gemini Pro',
}

export function OptimizationResult({ result, isPending }: OptimizationResultProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!result?.data?.optimized) return
    try {
      await navigator.clipboard.writeText(result.data.optimized)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
    }
  }, [result?.data?.optimized])

  const handleSave = useCallback(() => {
    // Results are already auto-saved by the server action
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  // Loading state: skeleton
  if (isPending) {
    return (
      <div className="card flex flex-col">
        <h2 className="text-lg font-semibold text-surface-100 mb-3">优化结果</h2>
        <div className="flex-1 min-h-[200px] rounded-xl border border-surface-700 bg-surface-800 p-4 space-y-3">
          <div className="h-4 bg-surface-700 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-surface-700 rounded animate-pulse w-full" />
          <div className="h-4 bg-surface-700 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-surface-700 rounded animate-pulse w-2/3" />
          <div className="h-4 bg-surface-700 rounded animate-pulse w-4/5" />
          <div className="h-4 bg-surface-700 rounded animate-pulse w-1/2" />
        </div>
        <div className="mt-4 h-9 w-20 bg-surface-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  // Error state
  if (result && !result.success) {
    return (
      <div className="card flex flex-col">
        <h2 className="text-lg font-semibold text-surface-100 mb-3">优化结果</h2>
        <div className="flex-1 min-h-[200px] rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span className="text-sm font-medium">优化失败</span>
          </div>
          <p className="text-sm text-red-300/80">{result.error}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!result?.data) {
    return (
      <div className="card flex flex-col">
        <h2 className="text-lg font-semibold text-surface-100 mb-3">优化结果</h2>
        <div className="flex-1 min-h-[200px] rounded-xl border border-surface-700 bg-surface-800 p-4 flex items-center justify-center">
          <p className="text-sm text-surface-500 text-center">
            优化结果将显示在这里
            <br />
            <span className="text-xs">在左侧输入提示词后点击"开始优化"</span>
          </p>
        </div>
      </div>
    )
  }

  // Success state
  const { optimized, model, tokensInput, tokensOutput, latencyMs } = result.data

  return (
    <div className="card flex flex-col">
      <h2 className="text-lg font-semibold text-surface-100 mb-3">优化结果</h2>

      {/* Optimized content */}
      <div className="flex-1 min-h-[200px] rounded-xl border border-surface-700 bg-surface-800 p-4 overflow-y-auto">
        <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap">
          {optimized}
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-surface-500">
        <span className="px-2 py-1 rounded bg-surface-800">
          {MODEL_LABELS[model] ?? model}
        </span>
        <span>输入: {tokensInput} tokens</span>
        <span>输出: {tokensOutput} tokens</span>
        <span>耗时: {(latencyMs / 1000).toFixed(1)}s</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleCopy}
          className="btn-secondary text-sm"
        >
          {copied ? '已复制' : '复制结果'}
        </button>
        <button
          onClick={handleSave}
          className="btn-secondary text-sm"
        >
          {saved ? '已保存' : '保存'}
        </button>
      </div>
    </div>
  )
}
