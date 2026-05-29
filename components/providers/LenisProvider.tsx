'use client'

import { useEffect } from 'react'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let rafId: number

    async function init() {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        touchMultiplier: 1.5,
      })

      function raf(time: number) {
        lenis!.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    init()

    return () => {
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

  return <>{children}</>
}
