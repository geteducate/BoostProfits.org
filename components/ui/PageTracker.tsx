'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTracker() {
  const pathname = usePathname()
  const startTime = useRef(Date.now())
  const sessionId = useRef<string>('')

  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current =
        sessionStorage.getItem('bp_session') ??
        (() => {
          const id = Math.random().toString(36).slice(2)
          sessionStorage.setItem('bp_session', id)
          return id
        })()
    }
  }, [])

  useEffect(() => {
    startTime.current = Date.now()

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return

    // Fire page view
    fetch(`${url}/rest/v1/page_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        page: pathname,
        event_type: 'view',
        session_id: sessionId.current,
      }),
    }).catch(() => {})

    // Fire time-on-page when leaving
    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000)
      if (duration < 2) return
      navigator.sendBeacon &&
        navigator.sendBeacon(
          `${url}/rest/v1/page_events`,
          JSON.stringify({
            page: pathname,
            event_type: 'leave',
            duration_s: duration,
            session_id: sessionId.current,
          })
        )
    }
  }, [pathname])

  return null
}
