'use client'

import AnimatedSection from '@/components/ui/AnimatedSection'
import { Lock } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'We read everything.',
    description:
      'Your page, your DMs, your competitor\'s copy. We find the exact line where buyers stop reading and start leaving.',
    blurred: false,
  },
  {
    number: '02',
    title: 'The diagnosis.',
    description:
      'We map exactly where your funnel leaks money and why. Most clients are shocked — it\'s usually one or two sentences.',
    blurred: true,
  },
  {
    number: '03',
    title: 'The rewrite.',
    description:
      'Every word is replaced with something that earns its place. Structure, order, rhythm — all rebuilt for one job: make them act.',
    blurred: true,
  },
  {
    number: '04',
    title: 'You get results.',
    description:
      'Better replies. Higher conversions. Copy that makes people move instead of wonder. You\'ll know it\'s working within days.',
    blurred: false,
  },
]

export default function Process() {
  return (
    <section id="process" className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border bg-[#F5F1EB]/40">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-4">
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal">
            How we do it.
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.06} className="text-center mb-16">
          <p className="text-[16px] text-charcoal/50">
            We show you the start and the end.{' '}
            <span className="text-navy/70 font-medium">The middle stays ours.</span>
          </p>
        </AnimatedSection>

        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 relative">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-warm-border" aria-hidden="true" />

          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center relative">
                {step.blurred ? (
                  <>
                    <div className="relative z-10 w-16 h-16 rounded-full border-2 border-dashed border-navy/20 bg-cream flex items-center justify-center mb-6">
                      <Lock size={16} className="text-navy/30" />
                    </div>
                    <div className="select-none">
                      <div className="relative">
                        <div className="blur-sm">
                          <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">{step.title}</h3>
                          <p className="text-[14px] text-charcoal/55 leading-relaxed">{step.description}</p>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <p className="text-[12px] font-semibold text-navy/60 bg-cream/90 px-3 py-1 rounded-full border border-navy/10">
                            Unlock with sign-up
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative z-10 w-16 h-16 rounded-full border border-warm-border bg-cream flex items-center justify-center mb-6 shadow-sm">
                      <span className="font-serif text-lg font-semibold text-navy">{step.number}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">{step.title}</h3>
                    <p className="text-[14px] text-charcoal/55 leading-relaxed">{step.description}</p>
                  </>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 ${step.blurred ? 'border-dashed border-navy/20 bg-cream' : 'border-warm-border bg-cream'}`}>
                    {step.blurred
                      ? <Lock size={13} className="text-navy/30" />
                      : <span className="font-serif text-sm font-semibold text-navy">{step.number}</span>
                    }
                  </div>
                  {i < steps.length - 1 && <div className="flex-1 w-px bg-warm-border mt-2" style={{ minHeight: 40 }} />}
                </div>
                <div className="pt-2 pb-10 flex-1">
                  {step.blurred ? (
                    <div className="relative">
                      <div className="blur-sm select-none">
                        <h3 className="font-serif text-lg font-semibold text-charcoal mb-1">{step.title}</h3>
                        <p className="text-[14px] text-charcoal/55 leading-relaxed">{step.description}</p>
                      </div>
                      <div className="absolute inset-0 flex items-center">
                        <a href="/signup" className="text-[12px] font-semibold text-navy/70 bg-cream/95 px-3 py-1 rounded-full border border-navy/10">
                          Sign up to unlock →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-serif text-lg font-semibold text-charcoal mb-1">{step.title}</h3>
                      <p className="text-[14px] text-charcoal/55 leading-relaxed">{step.description}</p>
                    </>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5} className="text-center mt-12">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 border border-navy/20 text-navy rounded-lg text-sm font-medium hover:bg-navy hover:text-white transition-all"
          >
            <Lock size={13} />
            Sign up free to see the full process
          </a>
        </AnimatedSection>
      </div>
    </section>
  )
}
