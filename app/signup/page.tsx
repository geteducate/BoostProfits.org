'use client'

import { useState, FormEvent } from 'react'
import { ArrowRight, Loader2, CheckCircle2, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { notifyAuthChange } from '@/lib/useAuth'
import { Logo } from '@/components/Logo'

const REFERRAL_OPTIONS = [
  'Instagram / TikTok',
  'X (Twitter)',
  'YouTube',
  'Google Search',
  'Friend or Referral',
  'Podcast',
  'LinkedIn',
  'Reddit',
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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function getLocation(): Promise<string> {
    try {
      const geo = await fetch('https://ipapi.co/json/').then((r) => r.json())
      return [geo.city, geo.country_name].filter(Boolean).join(', ') || 'Unknown'
    } catch {
      return 'Unknown'
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!agreed) {
      setErrorMsg('Please agree to the terms to continue.')
      return
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      return
    }

    setStatus('loading')
    const referralSource = referral === 'Other' ? referralOther : referral
    const location = await getLocation()

    // ── Path A: Supabase configured → real auth + data collection ──
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, nickname, referral_source: referralSource, location },
          },
        })

        if (error) {
          setErrorMsg(error.message)
          setStatus('idle')
          return
        }

        // Always record the lead (leads table allows anon insert)
        await supabase.from('leads').insert({
          name: fullName,
          email,
          source: 'signup',
          location,
        })

        // Best-effort profile insert (works once a session exists)
        if (data.user) {
          await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: fullName,
              nickname,
              email,
              location,
              referral_source: referralSource,
            })
            .then(() => {}, () => {}) // ignore RLS failure pre-confirmation
        }

        // Persist user locally so the header updates immediately
        localStorage.setItem('bp_user', JSON.stringify({ name: fullName, email, nickname }))
        notifyAuthChange()
        setStatus('success')
        return
      } catch {
        setErrorMsg('Something went wrong. Please try again.')
        setStatus('idle')
        return
      }
    }

    // ── Path B: Supabase not configured yet → local demo (UI still works) ──
    localStorage.setItem('bp_user', JSON.stringify({ name: fullName, email, nickname }))
    notifyAuthChange()
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-navy" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">You&apos;re in.</h2>
          <p className="text-charcoal/55 mb-7">
            Account created. Now go see what we kept hidden.
          </p>
          <Link
            href="/#process"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy/90 transition-all"
          >
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
          <Link href="/" className="inline-flex justify-center mb-6">
            <Logo size="lg" />
          </Link>
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-charcoal mb-2">
            Create your account.
          </h1>
          <p className="text-charcoal/50 text-sm">Free. No card. See what&apos;s behind the blur.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            type="text" placeholder="Full name" value={fullName}
            onChange={(e) => setFullName(e.target.value)} required
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />
          <input
            type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />
          <input
            type="text" placeholder="Nickname or company name (optional)" value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />
          <input
            type="password" placeholder="Password (min 8 characters)" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={8}
            className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
          />

          <div className="relative">
            <select
              value={referral} onChange={(e) => setReferral(e.target.value)} required
              className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal text-sm focus:outline-none focus:border-navy/30 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Where did you hear about us?</option>
              {REFERRAL_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/35 pointer-events-none" />
          </div>

          {referral === 'Other' && (
            <input
              type="text" placeholder="Tell us where..." value={referralOther}
              onChange={(e) => setReferralOther(e.target.value)} required
              className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
            />
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-warm-border accent-navy flex-shrink-0"
            />
            <span className="text-[12px] text-charcoal/40 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="underline hover:text-charcoal">Terms</Link> and{' '}
              <Link href="/privacy" className="underline hover:text-charcoal">Privacy Policy</Link>,
              including collection of my name, email, and approximate location.
            </span>
          </label>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit" disabled={status === 'loading'}
            className="w-full py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {status === 'loading'
              ? <Loader2 size={16} className="animate-spin" />
              : <><span>Create Account</span><ArrowRight size={15} /></>}
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
