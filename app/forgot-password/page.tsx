'use client'

import { useState, FormEvent } from 'react'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) { setStatus('sent'); return }

    try {
      await fetch(`${url}/auth/v1/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: key },
        body: JSON.stringify({ email }),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-xl font-semibold text-charcoal">BoostProfits</Link>
          <h1 className="font-serif text-3xl font-semibold text-charcoal mt-6 mb-2">Reset your password.</h1>
          <p className="text-charcoal/50 text-sm">We&apos;ll send a reset link to your email.</p>
        </div>

        {status === 'sent' ? (
          <div className="text-center">
            <CheckCircle2 size={36} className="text-navy mx-auto mb-3" />
            <p className="text-charcoal/70 text-sm">If an account exists for {email}, you&apos;ll get a reset link shortly.</p>
            <Link href="/login" className="block mt-6 text-sm text-navy font-medium hover:underline">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" placeholder="Your email address" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3.5 rounded-xl border border-warm-border bg-white text-charcoal placeholder:text-charcoal/35 text-sm focus:outline-none focus:border-navy/30 transition-all"
            />
            {status === 'error' && <p className="text-red-500 text-sm">Something went wrong. Try again.</p>}
            <button
              type="submit" disabled={status === 'loading'}
              className="w-full py-3.5 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <><span>Send Reset Link</span><ArrowRight size={15} /></>}
            </button>
            <p className="text-center text-sm text-charcoal/45">
              <Link href="/login" className="hover:text-charcoal transition-colors">Back to sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
