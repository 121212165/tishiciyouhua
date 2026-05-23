'use client'

import { useState, useMemo } from 'react'

interface OptimizationRecord {
  id: string
  original: string
  optimized: string
  model: string
  style: string
  tokensInput: number
  tokensOutput: number
  createdAt: string
}

// Placeholder data -- will be replaced with Supabase query
const PLACEHOLDER_RECORDS: OptimizationRecord[] = []

const MODEL_LABELS: Record<string, string> = {
  'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
  'gpt-4o': 'GPT-4o',
  'gemini-pro': 'Gemini Pro',
}

const STYLE_LABELS: Record<string, string> = {
  concise: '简洁',
  detailed: '详细',
  creative: '创意',
}

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return PLACEHOLDER_RECORDS
    const query = search.toLowerCase()
    return PLACEHOLDER_RECORDS.filter(
      (r) =>
        r.original.toLowerCase().includes(query) ||
        r.optimized.toLowerCase().includes(query)
    )
  }, [search])

  const selectedRecord = selectedId
    ? PLACEHOLDER_RECORDS.find((r) => r.id === selectedId) ?? null
    : null

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-50 mb-1">优化历史</h1>
          <p className="text-sm text-surface-400">
            {PLACEHOLDER_RECORDS.length > 0
              ? `共 ${PLACEHOLDER_RECORDS.length} 条记录`
              : '暂无优化记录'}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索提示词..."
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Content */}
      {PLACEHOLDER_RECORDS.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-3">
            {filteredRecords.map((record) => (
              <button
                key={record.id}
                onClick={() => setSelectedId(record.id)}
                className={`w-full text-left card hover:border-indigo-500/30 transition-colors ${
                  selectedId === record.id ? 'border-indigo-500/50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm text-surface-200 line-clamp-2 leading-relaxed">
                    {record.original}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-800 text-surface-400">
                      {MODEL_LABELS[record.model] ?? record.model}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-800 text-surface-400">
                      {STYLE_LABELS[record.style] ?? record.style}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-surface-500">
                  <span>{record.createdAt}</span>
                  <span>输入: {record.tokensInput} tokens</span>
                  <span>输出: {record.tokensOutput} tokens</span>
                </div>
              </button>
            ))}

            {filteredRecords.length === 0 && search && (
              <div className="text-center py-12 text-surface-500">
                未找到匹配的记录
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            {selectedRecord ? (
              <div className="card sticky top-6 space-y-4">
                <h3 className="font-semibold text-surface-100">优化详情</h3>
                <div>
                  <label className="text-xs text-surface-500 mb-1 block">
                    原始提示词
                  </label>
                  <p className="text-sm text-surface-300 leading-relaxed whitespace-pre-wrap">
                    {selectedRecord.original}
                  </p>
                </div>
                <div className="border-t border-surface-800 pt-4">
                  <label className="text-xs text-surface-500 mb-1 block">
                    优化后
                  </label>
                  <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap">
                    {selectedRecord.optimized}
                  </p>
                </div>
                <div className="border-t border-surface-800 pt-4 flex items-center gap-3">
                  <button className="btn-secondary text-xs px-3 py-1.5">
                    复制
                  </button>
                  <button className="btn-primary text-xs px-3 py-1.5">
                    再次优化
                  </button>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12 text-surface-500 text-sm">
                选择一条记录查看详情
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card text-center py-16">
      <svg
        className="w-12 h-12 text-surface-600 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
      <h3 className="font-semibold text-surface-200 mb-2">暂无优化记录</h3>
      <p className="text-sm text-surface-500 mb-4">
        去优化页面试试吧，历史记录会自动保存在这里
      </p>
      <a href="/dashboard/optimize" className="btn-primary text-sm">
        开始优化
      </a>
    </div>
  )
}
