'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface PromptEditorProps {
  onOptimize: (prompt: string) => Promise<void>
  isPending: boolean
}

const MAX_CHARS = 10000

export function PromptEditor({ onOptimize, isPending }: PromptEditorProps) {
  const [prompt, setPrompt] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.max(textarea.scrollHeight, 200)}px`
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [prompt, adjustHeight])

  // Ctrl+Enter keyboard shortcut
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isPending && prompt.trim()) {
        e.preventDefault()
        onOptimize(prompt.trim())
      }
    },
    [isPending, prompt, onOptimize]
  )

  const handleSubmit = useCallback(() => {
    if (!prompt.trim() || isPending) return
    onOptimize(prompt.trim())
  }, [prompt, isPending, onOptimize])

  const charCount = prompt.length
  const isOverLimit = charCount > MAX_CHARS

  return (
    <div className="card flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-surface-100">原始提示词</h2>
        <span
          className={`text-xs ${
            isOverLimit
              ? 'text-red-400'
              : charCount > MAX_CHARS * 0.8
              ? 'text-yellow-400'
              : 'text-surface-500'
          }`}
        >
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={'在这里输入你想要优化的提示词...\n\n例如：帮我写一篇关于气候变化的文章'}
        className="input-field flex-1 min-h-[200px] resize-none leading-relaxed"
        disabled={isPending}
      />

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-surface-500">
          Ctrl+Enter 快速提交
        </p>
        <button
          onClick={handleSubmit}
          disabled={isPending || !prompt.trim() || isOverLimit}
          className="btn-primary"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner />
              优化中...
            </span>
          ) : (
            '开始优化'
          )}
        </button>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
