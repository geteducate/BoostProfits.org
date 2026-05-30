'use client'

import { useState, FormEvent } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { notifyAuthChange } from '@/lib/useAuth'
import { Logo } from '@/components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    // ── Supabase configured → real login ──
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setErrorMsg(error.message || 'Wrong email or password.')
        setStatus('idle')
        return
      }
      if (data.user) {
        const meta = (data.user.user_metadata ?? {}) as Record<string, string>
        localStorage.setItem(
          'bp_user',
          JSON.stringify({
            name: meta.full_name || email.split('@')[0],
            email,
            nickname: meta.nickname,
          })
        )
        notifyAuthChange()
      }
      router.push('/#process')
      return
    }

    // ── Not configured: local demo fallback ──
    const local = localStorage.getItem('bp_user')
    if (local) {
      notifyAuthChange()
      router.push('/#process')
    } else {
      setErrorMsg('No account found. Please sign up first.')
      setStatus('idle')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex justify-center mb-6">
            <Logo size="lg" />
          </Link>
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-charcoal mb-2">
            Welcome back.
          </h1>
          <p className="text-charcoal/50 text-sm">Sign in to see the full process.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit" disabled={status === 'loading'}
            className="w-full py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {status === 'loading'
              ? <Loader2 size={16} className="animate-spin" />
              : <><span>Sign In</span><ArrowRight size={15} /></>}
          </button>
        </form>

        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-charcoal/45">
            No account?{' '}
            <Link href="/signup" className="text-navy font-medium hover:underline">Sign up free</Link>
          </p>
          <Link href="/forgot-password" className="text-sm text-charcoal/35 hover:text-charcoal transition-colors">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  )
}
