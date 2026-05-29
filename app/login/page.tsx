'use client'

import { useState, FormEvent } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      setErrorMsg('Auth not configured. Contact support.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: key },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error_description || 'Wrong email or password.')
        setStatus('error')
        return
      }
      localStorage.setItem('bp_access_token', data.access_token)
      localStorage.setItem('bp_user', JSON.stringify({ id: data.user?.id, email }))
      window.location.href = '/#process'
    } catch {
      setErrorMsg('Connection error. Try again.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-xl font-semibold text-charcoal">BoostProfits</Link>
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-charcoal mt-6 mb-2">
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
            {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={15} /></>}
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
