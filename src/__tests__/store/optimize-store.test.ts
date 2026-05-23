import { describe, it, expect, beforeEach } from 'vitest'
import { useOptimizeStore } from '@/store/optimize-store'

describe('useOptimizeStore', () => {
  beforeEach(() => {
    useOptimizeStore.getState().reset()
  })

  it('has correct initial state', () => {
    const state = useOptimizeStore.getState()
    expect(state.prompt).toBe('')
    expect(state.model).toBe('claude-3-5-sonnet')
    expect(state.style).toBe('detailed')
  })

  it('setPrompt updates the prompt', () => {
    useOptimizeStore.getState().setPrompt('测试提示词')
    expect(useOptimizeStore.getState().prompt).toBe('测试提示词')
  })

  it('setModel updates the model', () => {
    useOptimizeStore.getState().setModel('gpt-4o')
    expect(useOptimizeStore.getState().model).toBe('gpt-4o')
  })

  it('setStyle updates the style', () => {
    useOptimizeStore.getState().setStyle('concise')
    expect(useOptimizeStore.getState().style).toBe('concise')
  })

  it('reset restores default state', () => {
    const store = useOptimizeStore.getState()
    store.setPrompt('test')
    store.setModel('gpt-4o')
    store.setStyle('creative')

    store.reset()

    const state = useOptimizeStore.getState()
    expect(state.prompt).toBe('')
    expect(state.model).toBe('claude-3-5-sonnet')
    expect(state.style).toBe('detailed')
  })

  it('setPrompt does not affect other fields', () => {
    const store = useOptimizeStore.getState()
    store.setModel('gemini-pro')
    store.setStyle('creative')

    store.setPrompt('新提示词')

    const state = useOptimizeStore.getState()
    expect(state.prompt).toBe('新提示词')
    expect(state.model).toBe('gemini-pro')
    expect(state.style).toBe('creative')
  })

  it('setModel does not affect other fields', () => {
    const store = useOptimizeStore.getState()
    store.setPrompt('test prompt')
    store.setStyle('concise')

    store.setModel('gpt-4o')

    const state = useOptimizeStore.getState()
    expect(state.prompt).toBe('test prompt')
    expect(state.model).toBe('gpt-4o')
    expect(state.style).toBe('concise')
  })
})
