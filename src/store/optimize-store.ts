import { create } from 'zustand'

interface OptimizeState {
  prompt: string
  model: string
  style: string
  setPrompt: (prompt: string) => void
  setModel: (model: string) => void
  setStyle: (style: string) => void
  reset: () => void
}

export const useOptimizeStore = create<OptimizeState>((set) => ({
  prompt: '',
  model: 'claude-3-5-sonnet',
  style: 'detailed',
  setPrompt: (prompt) => set({ prompt }),
  setModel: (model) => set({ model }),
  setStyle: (style) => set({ style }),
  reset: () => set({ prompt: '', model: 'claude-3-5-sonnet', style: 'detailed' }),
}))
