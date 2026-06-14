'use client'

import { useState, useCallback, useRef } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<{ tokens: number; latency: number } | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const handleOptimize = useCallback(async () => {
    if (!prompt.trim() || isStreaming) return
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setResult('')
    setError(null)
    setStats(null)
    setIsStreaming(true)

    try {
      const res = await fetch('/api/optimize/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || '请求失败')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('无法读取响应')

      const decoder = new TextDecoder()
      let buffer = ''
      let totalContent = ''
      const startTime = Date.now()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = JSON.parse(line.slice(6))
          if (data.type === 'text' && data.content) {
            totalContent += data.content
            setResult(totalContent)
          } else if (data.type === 'done') {
            setStats({
              tokens: (data.tokensInput ?? 0) + (data.tokensOutput ?? 0),
              latency: Date.now() - startTime,
            })
          } else if (data.type === 'error') {
            throw new Error(data.message ?? '优化失败')
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : '优化失败')
    } finally {
      setIsStreaming(false)
    }
  }, [prompt, isStreaming])

  const handleCopy = useCallback(async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }, [result])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          提示词优化器
        </h1>
        <p className="text-gray-400 mb-8">输入你的原始提示词，AI 使用 CO-STAR 框架自动优化</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">原始提示词</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isStreaming && prompt.trim()) {
                  e.preventDefault()
                  handleOptimize()
                }
              }}
              placeholder="在这里输入你想要优化的提示词...&#10;&#10;例如：帮我写一篇关于气候变化的文章"
              className="w-full h-48 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none"
              disabled={isStreaming}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">Ctrl+Enter 快速提交</span>
              <span className="text-xs text-gray-500">{prompt.length} / 10,000</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleOptimize}
              disabled={isStreaming || !prompt.trim() || prompt.length > 10000}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isStreaming ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  优化中...
                </span>
              ) : '开始优化'}
            </button>
            {isStreaming && (
              <button
                onClick={() => { abortRef.current?.abort(); setIsStreaming(false) }}
                className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                停止
              </button>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {(result || isStreaming) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">优化结果</label>
                {result && !isStreaming && (
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 rounded-lg border border-gray-700 bg-gray-800 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    {copied ? '已复制' : '复制结果'}
                  </button>
                )}
              </div>
              <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 min-h-[200px] overflow-y-auto">
                <pre className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {result}
                  {isStreaming && <span className="inline-block w-2 h-4 ml-0.5 bg-indigo-400 animate-pulse align-text-bottom" />}
                </pre>
              </div>
              {stats && (
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>{stats.tokens.toLocaleString()} tokens</span>
                  <span>{(stats.latency / 1000).toFixed(1)}s</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
