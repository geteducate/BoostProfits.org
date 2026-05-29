import AnimatedSection from '@/components/ui/AnimatedSection'
import { MessageSquareOff, TrendingDown, Eye, HelpCircle } from 'lucide-react'

const painPoints = [
  { Icon: MessageSquareOff, label: 'Words that inform people but never make them want to buy' },
  { Icon: TrendingDown, label: 'DMs and ads that get seen but not acted on' },
  { Icon: Eye, label: 'Traffic that reads everything, remembers nothing, buys nothing' },
  { Icon: HelpCircle, label: 'An offer that makes sense to you but confuses everyone else' },
]

export default function Problem() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border bg-[#F5F1EB]/40">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal mb-6">
            You&apos;re not losing sales. You&apos;re bleeding them.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-[18px] text-charcoal/65 leading-relaxed mb-12">
            Every visitor who found you, read your page, and left without buying — that was a
            buyer. They had money. They had the problem. Something in the words gave them a reason
            to hesitate. And hesitation online means gone. That&apos;s not a traffic problem.
            That&apos;s a words problem.
          </p>
        </AnimatedSection>

        <div className="space-y-3">
          {painPoints.map(({ Icon, label }, i) => (
            <AnimatedSection key={i} delay={0.12 + i * 0.08}>
              <div className="group flex items-start gap-4 p-4 rounded-xl border border-warm-border bg-white/70 hover:bg-white hover:shadow-sm transition-all">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center group-hover:bg-navy/10 transition-colors">
                  <Icon size={15} className="text-navy/45" />
                </div>
                <p className="text-[16px] text-charcoal/70 leading-snug pt-1">{label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
