'use client'

import { useState, FormEvent } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

export default function UrgencyCTA() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (url && key) {
        const res = await fetch(`${url}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ name, email, source: 'booking_cta' }),
        })
        if (!res.ok) throw new Error()
      }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="booking"
      className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border bg-navy text-white relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.04)_0%,_transparent_70%)]" />

      <div className="max-w-3xl mx-auto text-center relative">
        <AnimatedSection>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight mb-4">
            3 spots. This week only.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-[18px] text-white/65 leading-relaxed mb-10">
            We cap new projects at 3 per week. Not because we&apos;re busy — because doing more than
            that and the work suffers. Right now at least one is still open. Check if it&apos;s yours.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.16}>
          <p className="text-[11px] font-semibold tracking-[0.15em] text-white/35 uppercase mb-5">
            This slot closes in:
          </p>
          <CountdownTimer />
        </AnimatedSection>

        <AnimatedSection delay={0.24} className="mt-10">
          {status === 'success' ? (
            <div className="inline-flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={36} className="text-white/70" />
              <p className="text-lg font-semibold">You&apos;re in the queue.</p>
              <p className="text-sm text-white/45">Check your inbox — we&apos;ll be there in under 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all min-w-0"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all min-w-0"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-navy font-semibold rounded-xl hover:bg-white/90 transition-all disabled:opacity-60 whitespace-nowrap hover:shadow-lg"
              >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <><span>Claim My Spot</span><ArrowRight size={15} /></>}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-3 text-sm text-white/40">
              Something went wrong — email us at{' '}
              <a href="mailto:hello@boostprofits.com" className="underline">hello@boostprofits.com</a>
            </p>
          )}
          <p className="mt-4 text-xs text-white/25">No spam. No selling. Just a conversation about your copy.</p>
        </AnimatedSection>
      </div>
    </section>
  )
}
