'use client'

import { useState, useCallback } from 'react'
import type { ModelId } from '@/lib/ai/models'

interface OptimizationResultProps {
  content: string
  isStreaming: boolean
  isDone: boolean
  error: string | null
  tokensInput: number
  tokensOutput: number
  latencyMs: number
  model: ModelId
}

const MODEL_LABELS: Record<ModelId, string> = {
  'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
  'gpt-4o': 'GPT-4o',
  'gemini-pro': 'Gemini Pro',
}

export function OptimizationResult({
  content,
  isStreaming,
  isDone,
  error,
  tokensInput,
  tokensOutput,
  latencyMs,
  model,
}: OptimizationResultProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
    }
  }, [content])

  const handleSave = useCallback(() => {
    // Results are already auto-saved by the streaming route
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  // Error state
  if (error) {
    return (
      <div className="card flex flex-col">
        <h2 className="text-lg font-semibold text-surface-100 mb-3">优化结果</h2>
        <div className="flex-1 min-h-[200px] rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span className="text-sm font-medium">优化失败</span>
          </div>
          <p className="text-sm text-red-300/80">{error}</p>
        </div>
      </div>
    )
  }

  // Empty state: no content and not streaming
  if (!content && !isStreaming) {
    return (
      <div className="card flex flex-col">
        <h2 className="text-lg font-semibold text-surface-100 mb-3">优化结果</h2>
        <div className="flex-1 min-h-[200px] rounded-xl border border-surface-700 bg-surface-800 p-4 flex items-center justify-center">
          <p className="text-sm text-surface-500 text-center">
            优化结果将显示在这里
            <br />
            <span className="text-xs">在左侧输入提示词后点击&ldquo;开始优化&rdquo;</span>
          </p>
        </div>
      </div>
    )
  }

  // Streaming or completed content
  return (
    <div className="card flex flex-col">
      <h2 className="text-lg font-semibold text-surface-100 mb-3">优化结果</h2>

      {/* Optimized content with streaming cursor */}
      <div className="flex-1 min-h-[200px] rounded-xl border border-surface-700 bg-surface-800 p-4 overflow-y-auto">
        <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-0.5 bg-primary-400 animate-pulse align-text-bottom" />
          )}
        </p>
      </div>

      {/* Stats bar: only when done */}
      {isDone && tokensInput > 0 && (
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-surface-500">
          <span className="px-2 py-1 rounded bg-surface-800">
            {MODEL_LABELS[model] ?? model}
          </span>
          <span>输入: {tokensInput} tokens</span>
          <span>输出: {tokensOutput} tokens</span>
          <span>耗时: {(latencyMs / 1000).toFixed(1)}s</span>
        </div>
      )}

      {/* Streaming progress indicator */}
      {isStreaming && (
        <div className="flex items-center gap-2 mt-3 text-xs text-surface-500">
          <span className="inline-block w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          AI 正在生成...
        </div>
      )}

      {/* Action buttons: only when content exists and not streaming */}
      {content && !isStreaming && (
        <div className="flex items-center gap-3 mt-4">
          <button onClick={handleCopy} className="btn-secondary text-sm">
            {copied ? '已复制' : '复制结果'}
          </button>
          <button onClick={handleSave} className="btn-secondary text-sm">
            {saved ? '已保存' : '保存'}
          </button>
        </div>
      )}
    </div>
  )
}
