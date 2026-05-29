'use client'

import { useState, FormEvent } from 'react'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!agreed) { setErrorMsg('Please agree to the terms to continue.'); return }
    setStatus('loading')
    setErrorMsg('')

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      // No Supabase configured — just show success
      setStatus('success')
      return
    }

    try {
      // Get approximate location from IP
      let location = 'Unknown'
      try {
        const geoRes = await fetch('https://ipapi.co/json/')
        if (geoRes.ok) {
          const geo = await geoRes.json()
          location = [geo.city, geo.country_name].filter(Boolean).join(', ')
        }
      } catch { /* location stays Unknown */ }

      // Create auth user
      const authRes = await fetch(`${url}/auth/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: key },
        body: JSON.stringify({ email, password }),
      })
      const authData = await authRes.json()
      if (!authRes.ok) { setErrorMsg(authData.msg || 'Sign-up failed.'); setStatus('error'); return }

      const userId = authData.user?.id
      if (userId) {
        // Save profile
        await fetch(`${url}/rest/v1/profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${authData.access_token}`, Prefer: 'return=minimal' },
          body: JSON.stringify({ id: userId, name, email, location }),
        })
        // Save to leads too
        await fetch(`${url}/rest/v1/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${authData.access_token}`, Prefer: 'return=minimal' },
          body: JSON.stringify({ name, email, source: 'signup', location }),
        })
        // Persist session
        localStorage.setItem('bp_access_token', authData.access_token)
        localStorage.setItem('bp_user', JSON.stringify({ id: userId, name, email }))
      }
      setStatus('success')
    } catch {
      setErrorMsg('Something went wrong. Try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <CheckCircle2 size={40} className="text-navy mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">You&apos;re in.</h2>
          <p className="text-charcoal/55 mb-6">Account created. Now go see the full process.</p>
          <Link href="/#process" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg text-sm font-medium">
            See the full process <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-xl font-semibold text-charcoal">BoostProfits</Link>
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-charcoal mt-6 mb-2">
            Create your account.
          </h1>
          <p className="text-charcoal/50 text-sm">Sign up free. See the full process. No card needed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Your name" value={name}
            onChange={(e) => setName(e.target.value)} required
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />
          <input
            type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />
          <input
            type="password" placeholder="Password (min 8 chars)" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={8}
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />

          {/* Terms agreement — small print, but present */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-warm-border accent-navy"
            />
            <span className="text-[12px] text-charcoal/40 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="underline hover:text-charcoal transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-charcoal transition-colors">Privacy Policy</Link>
              , including collection of my name, email, and approximate location for service analytics.
            </span>
          </label>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit" disabled={status === 'loading'}
            className="w-full py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={15} /></>}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-charcoal/45">
          Already have one?{' '}
          <Link href="/login" className="text-navy font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
