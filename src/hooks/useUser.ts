'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const supabase = createClient()

  return useSWR('user', async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return { ...user, profile }
  })
}
