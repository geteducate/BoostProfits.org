'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import type { User } from '@supabase/supabase-js'

export type AppUser = {
  name: string
  email: string
  nickname?: string
}

const AUTH_EVENT = 'bp-auth-change'

function mapUser(u: User): AppUser {
  const meta = (u.user_metadata ?? {}) as Record<string, string>
  return {
    name: meta.full_name || meta.name || (u.email ?? '').split('@')[0],
    email: u.email ?? '',
    nickname: meta.nickname || undefined,
  }
}

/** Broadcast an auth change so every mounted useAuth() refreshes. */
export function notifyAuthChange() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(AUTH_EVENT))
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const readLocal = useCallback(() => {
    try {
      const raw = localStorage.getItem('bp_user')
      return raw ? (JSON.parse(raw) as AppUser) : null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // 1. Optimistic: show locally-stored user instantly (survives email-confirm flow)
    const local = readLocal()
    if (local && mounted) setUser(local)

    // 2. Real session from Supabase (source of truth when configured)
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return
        if (data.session?.user) {
          const u = mapUser(data.session.user)
          setUser(u)
          localStorage.setItem('bp_user', JSON.stringify(u))
        }
        setLoading(false)
      })

      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return
        if (session?.user) {
          const u = mapUser(session.user)
          setUser(u)
          localStorage.setItem('bp_user', JSON.stringify(u))
        }
      })

      return () => {
        mounted = false
        sub.subscription.unsubscribe()
      }
    }

    setLoading(false)
    return () => {
      mounted = false
    }
  }, [readLocal])

  // 3. Cross-component sync via custom event (covers local-only demo signups)
  useEffect(() => {
    const handler = () => setUser(readLocal())
    window.addEventListener(AUTH_EVENT, handler)
    return () => window.removeEventListener(AUTH_EVENT, handler)
  }, [readLocal])

  const signOut = useCallback(async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut()
      } catch {
        /* ignore */
      }
    }
    localStorage.removeItem('bp_user')
    localStorage.removeItem('bp_access_token')
    setUser(null)
    notifyAuthChange()
  }, [])

  return { user, loading, signOut }
}
