'use client'

import type { Style } from '@/lib/ai/prompts'

interface StyleSelectorProps {
  value: Style
  onChange: (style: Style) => void
}

const STYLES: Array<{ id: Style; name: string; description: string }> = [
  { id: 'concise', name: '简洁', description: '精炼核心要素' },
  { id: 'detailed', name: '详细', description: '全面补充上下文' },
  { id: 'creative', name: '创意', description: '突破常规思路' },
  { id: 'academic', name: '学术', description: '严谨论证结构' },
  { id: 'technical', name: '技术文档', description: '精确代码友好' },
  { id: 'business', name: '商务', description: '专业结果导向' },
  { id: 'instruction', name: '指令式', description: '分步可执行' },
]

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-surface-500 shrink-0">风格</span>
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-800/50 border border-surface-700">
        {STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange(style.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              value === style.id
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50'
            }`}
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  )
}
