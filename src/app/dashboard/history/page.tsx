'use client'

import { useState, useMemo } from 'react'
import { useHistory } from '@/hooks/useHistory'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Optimization } from '@/types/database'

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

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<Optimization | null>(null)
  const { records, total, isLoading, error } = useHistory()

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records
    const query = search.toLowerCase()
    return records.filter(
      (r) =>
        r.original_prompt.toLowerCase().includes(query) ||
        (r.optimized_prompt?.toLowerCase().includes(query) ?? false)
    )
  }, [records, search])

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {
      // silent fail
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-50 mb-1">优化历史</h1>
          <p className="text-sm text-surface-400">
            {isLoading
              ? '加载中...'
              : total > 0
                ? `共 ${total} 条记录`
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
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

      {/* Error */}
      {error && (
        <div className="card border-red-500/30 text-red-400 text-sm">
          加载失败：{error.message}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-3 w-1/2 mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {records.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="w-full text-left card hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm text-surface-200 line-clamp-2 leading-relaxed">
                      {truncate(record.original_prompt, 120)}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {MODEL_LABELS[record.model] ?? record.model}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {STYLE_LABELS[record.style] ?? record.style}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-surface-500">
                    <span>{formatDate(record.created_at)}</span>
                    {record.tokens_input != null && (
                      <span>输入: {record.tokens_input} tokens</span>
                    )}
                    {record.tokens_output != null && (
                      <span>输出: {record.tokens_output} tokens</span>
                    )}
                    {record.latency_ms != null && (
                      <span>耗时: {record.latency_ms}ms</span>
                    )}
                  </div>
                </button>
              ))}

              {filteredRecords.length === 0 && search && (
                <div className="text-center py-12 text-surface-500">
                  未找到匹配的记录
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Detail dialog */}
      <Dialog
        open={selectedRecord != null}
        onOpenChange={(open) => {
          if (!open) setSelectedRecord(null)
        }}
      >
        <DialogContent className="max-w-2xl bg-surface-900 border-surface-700">
          <DialogHeader>
            <DialogTitle className="text-surface-100">优化详情</DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-surface-500 mb-1 block">
                  原始提示词
                </label>
                <p className="text-sm text-surface-300 leading-relaxed whitespace-pre-wrap bg-surface-800 rounded-lg p-3">
                  {selectedRecord.original_prompt}
                </p>
              </div>

              <Separator className="bg-surface-700" />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-surface-500">优化后</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() =>
                      selectedRecord.optimized_prompt &&
                      handleCopy(selectedRecord.optimized_prompt)
                    }
                  >
                    复制
                  </Button>
                </div>
                <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap bg-surface-800 rounded-lg p-3">
                  {selectedRecord.optimized_prompt ?? '无结果'}
                </p>
              </div>

              <Separator className="bg-surface-700" />

              <div className="flex items-center gap-3 text-xs text-surface-500">
                <span>
                  模型：{MODEL_LABELS[selectedRecord.model] ?? selectedRecord.model}
                </span>
                <span>
                  风格：{STYLE_LABELS[selectedRecord.style] ?? selectedRecord.style}
                </span>
                <span>{formatDate(selectedRecord.created_at)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
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
