import AnimatedSection from '@/components/ui/AnimatedSection'
import { Check, ArrowRight, Zap, Star, Crown } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/mo',
    description: 'Try it. See what changes.',
    Icon: Zap,
    features: [
      '1 landing page audit',
      '5 headline rewrites',
      'Offer clarity check',
      'CTA review',
      '48-hour delivery',
      'Email support',
    ],
    cta: 'Start for $19',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$59',
    period: '/mo',
    description: 'The full rewrite. The real results.',
    Icon: Star,
    features: [
      'Everything in Starter',
      'Full page rewrite',
      'Offer restructuring + positioning',
      'CTA and funnel optimization',
      '3 email sequences',
      '7-day delivery',
      'Priority response',
    ],
    cta: 'Go Pro',
    popular: true,
  },
  {
    name: 'Elite',
    price: 'Custom',
    period: '',
    description: 'For serious operators. We talk numbers.',
    Icon: Crown,
    features: [
      'Full funnel — pages, emails, DMs',
      'Monthly strategy sessions',
      'Dedicated conversion writer',
      'Positioning system',
      'Ongoing optimization',
      'No contracts',
    ],
    cta: 'Talk to Us',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-4">
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal">
            Pick your level.
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.06} className="text-center mb-14">
          <p className="text-[17px] text-charcoal/55">
            No contracts. Start tonight. Change your mind tomorrow.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                className={`group rounded-2xl border p-7 flex flex-col h-full transition-all duration-300 ${
                  plan.popular
                    ? 'border-navy/30 bg-navy text-white shadow-2xl md:-translate-y-4 hover:-translate-y-5'
                    : 'border-warm-border bg-white hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Plan header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    {plan.popular && (
                      <p className="text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase mb-2">
                        Most Popular
                      </p>
                    )}
                    <h3
                      className={`font-serif text-2xl font-semibold ${
                        plan.popular ? 'text-white' : 'text-charcoal'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p className={`text-sm mt-0.5 ${plan.popular ? 'text-white/55' : 'text-charcoal/45'}`}>
                      {plan.description}
                    </p>
                  </div>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      plan.popular ? 'bg-white/15' : 'bg-navy/8'
                    }`}
                  >
                    <plan.Icon size={16} className={plan.popular ? 'text-white/80' : 'text-navy/60'} />
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1 mb-7">
                  <span
                    className={`font-serif text-5xl font-semibold tracking-tight ${
                      plan.popular ? 'text-white' : 'text-charcoal'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`mb-2 text-sm ${plan.popular ? 'text-white/50' : 'text-charcoal/40'}`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className={`mt-0.5 flex-shrink-0 ${
                          plan.popular ? 'text-white/60' : 'text-navy/55'
                        }`}
                      />
                      <span
                        className={`text-[14px] leading-snug ${
                          plan.popular ? 'text-white/75' : 'text-charcoal/65'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#booking"
                  className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl font-medium text-sm transition-all ${
                    plan.popular
                      ? 'bg-white text-navy hover:bg-white/90 shadow-sm'
                      : 'bg-navy text-white hover:bg-navy/90 hover:shadow-sm'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
