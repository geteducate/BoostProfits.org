'use client'

import { useState, FormEvent, useEffect } from 'react'
import { ArrowRight, Loader2, CheckCircle2, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const REFERRAL_OPTIONS = [
  'Instagram / TikTok',
  'X (Twitter)',
  'YouTube',
  'Google Search',
  'Friend or Referral',
  'Podcast',
  'Blog / Article',
  'Reddit',
  'LinkedIn',
  'Other',
]

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referral, setReferral] = useState('')
  const [referralOther, setReferralOther] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Load Cloudflare Turnstile
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!agreed) { setErrorMsg('Please agree to the terms to continue.'); return }

    // Check Turnstile token
    const turnstileResponse = (
      document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement
    )?.value
    if (!turnstileResponse) {
      setErrorMsg('Please complete the security check.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) { setStatus('success'); return }

    try {
      let location = 'Unknown'
      try {
        const geo = await fetch('https://ipapi.co/json/').then((r) => r.json())
        location = [geo.city, geo.country_name].filter(Boolean).join(', ')
      } catch { /* silent */ }

      const referralSource = referral === 'Other' ? referralOther : referral

      const authRes = await fetch(`${url}/auth/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: key },
        body: JSON.stringify({ email, password }),
      })
      const authData = await authRes.json()
      if (!authRes.ok) { setErrorMsg(authData.msg || 'Sign-up failed.'); setStatus('error'); return }

      const userId = authData.user?.id
      if (userId) {
        const token = authData.access_token
        const headers = {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${token}`,
          Prefer: 'return=minimal',
        }
        await Promise.all([
          fetch(`${url}/rest/v1/profiles`, {
            method: 'POST', headers,
            body: JSON.stringify({ id: userId, name: fullName, nickname, email, location, referral_source: referralSource }),
          }),
          fetch(`${url}/rest/v1/leads`, {
            method: 'POST', headers,
            body: JSON.stringify({ name: fullName, email, source: 'signup', location }),
          }),
        ])
        localStorage.setItem('bp_access_token', token)
        localStorage.setItem('bp_user', JSON.stringify({ id: userId, name: fullName, email }))
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
          <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-navy" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">You&apos;re in.</h2>
          <p className="text-charcoal/55 mb-7">Account created. Now see what we kept hidden.</p>
          <Link href="/#process" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy/90 transition-all">
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
          <p className="text-charcoal/50 text-sm">Free. No card. See what&apos;s behind the blur.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <input
            type="text" placeholder="Full name" value={fullName}
            onChange={(e) => setFullName(e.target.value)} required
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />

          {/* Email */}
          <input
            type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />

          {/* Nickname / Company */}
          <input
            type="text" placeholder="Nickname or company name (optional)" value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />

          {/* Password */}
          <input
            type="password" placeholder="Password (min 8 characters)" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={8}
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />

          {/* Where did you hear about us */}
          <div className="relative">
            <select
              value={referral} onChange={(e) => setReferral(e.target.value)} required
              className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal text-sm focus:outline-none focus:border-navy/30 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Where did you hear about us?</option>
              {REFERRAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/35 pointer-events-none" />
          </div>

          {/* Other referral text */}
          {referral === 'Other' && (
            <input
              type="text" placeholder="Tell us where..." value={referralOther}
              onChange={(e) => setReferralOther(e.target.value)} required
              className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
            />
          )}

          {/* Cloudflare Turnstile */}
          <div className="flex justify-center py-1">
            <div
              className="cf-turnstile"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
              data-theme="light"
            />
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-warm-border accent-navy flex-shrink-0"
            />
            <span className="text-[12px] text-charcoal/40 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="underline hover:text-charcoal">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-charcoal">Privacy Policy</Link>
              , including collection of my name, email, and approximate location.
            </span>
          </label>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit" disabled={status === 'loading'}
            className="w-full py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {status === 'loading'
              ? <Loader2 size={16} className="animate-spin" />
              : <><span>Create Account</span><ArrowRight size={15} /></>
            }
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
