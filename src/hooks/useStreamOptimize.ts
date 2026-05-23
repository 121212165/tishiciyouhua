'use client'

import { useState, useCallback, useRef } from 'react'

interface StreamState {
  content: string
  isStreaming: boolean
  error: string | null
  done: boolean
  tokensInput: number
  tokensOutput: number
  latencyMs: number
  id: string
}

const INITIAL_STATE: StreamState = {
  content: '',
  isStreaming: false,
  error: null,
  done: false,
  tokensInput: 0,
  tokensOutput: 0,
  latencyMs: 0,
  id: '',
}

export function useStreamOptimize() {
  const [state, setState] = useState<StreamState>(INITIAL_STATE)
  const abortRef = useRef<AbortController | null>(null)

  const optimize = useCallback(
    async (prompt: string, model: string, style: string) => {
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      setState({
        ...INITIAL_STATE,
        isStreaming: true,
      })

      try {
        const res = await fetch('/api/optimize/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model, style }),
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

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue

            const data = JSON.parse(line.slice(6)) as {
              type: 'text' | 'done' | 'error'
              content?: string
              id?: string
              tokensInput?: number
              tokensOutput?: number
              latencyMs?: number
              message?: string
            }

            if (data.type === 'text' && data.content) {
              setState((prev) => ({
                ...prev,
                content: prev.content + data.content,
              }))
            } else if (data.type === 'done') {
              setState((prev) => ({
                ...prev,
                done: true,
                isStreaming: false,
                id: data.id ?? '',
                tokensInput: data.tokensInput ?? 0,
                tokensOutput: data.tokensOutput ?? 0,
                latencyMs: data.latencyMs ?? 0,
              }))
            } else if (data.type === 'error') {
              throw new Error(data.message ?? '优化失败')
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: error instanceof Error ? error.message : '优化失败',
        }))
      }
    },
    []
  )

  const abort = useCallback(() => {
    abortRef.current?.abort()
    setState((prev) => ({ ...prev, isStreaming: false }))
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState(INITIAL_STATE)
  }, [])

  return { ...state, optimize, abort, reset }
}
