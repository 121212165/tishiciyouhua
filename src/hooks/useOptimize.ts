'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { optimizeAction, type OptimizeActionState } from '@/app/actions/optimize'

export function useOptimize() {
  const [state, formAction] = useFormState<OptimizeActionState | null, FormData>(
    optimizeAction,
    null
  )

  return {
    state,
    formAction,
    isPending: useFormStatus().pending,
  }
}
