'use client'

import type { ModelId } from '@/lib/ai/models'

interface ModelSelectorProps {
  value: ModelId
  onChange: (model: ModelId) => void
}

const MODELS: Array<{ id: ModelId; name: string; available: boolean }> = [
  { id: 'claude-3-5-sonnet', name: 'Claude Sonnet 4.6', available: true },
  { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', available: true },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', available: true },
  { id: 'gpt-4o', name: 'GPT-4o', available: false },
  { id: 'gemini-pro', name: 'Gemini Pro', available: false },
]

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-surface-500 shrink-0">模型</span>
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-800/50 border border-surface-700">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => model.available && onChange(model.id)}
            disabled={!model.available}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              value === model.id
                ? 'bg-primary-500/20 text-primary-400'
                : model.available
                ? 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50'
                : 'text-surface-600 cursor-not-allowed'
            }`}
          >
            {model.name}
            {!model.available && (
              <span className="ml-1.5 text-[10px] text-surface-600">
                即将支持
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
